import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {createHelloController, HELLO_KEY} from '../assets/hello.mjs';

function fixture({saved, reduce = false, blocked = false} = {}) {
  const values = new Map(saved ? [[HELLO_KEY, '1']] : []), scheduled = new Map();
  let now = 0, id = 0;
  const document = {activeElement:null};
  function element() {
    const classes = new Set(), events = new Map();
    return {isConnected:true, hidden:false, inert:false, offsetWidth:660,
      classList:{add:(...v)=>v.forEach(x=>classes.add(x)),remove:(...v)=>v.forEach(x=>classes.delete(x)),contains:v=>classes.has(v)},
      focus(){document.activeElement=this;},
      addEventListener:(name,fn)=>events.set(name,fn),removeEventListener:name=>events.delete(name),
      emit:(name,event={})=>events.get(name)?.(event),
      setAttribute(name){if(name==='hidden')this.hidden=true;},removeAttribute(name){if(name==='inert')this.inert=false;},
    };
  }
  Object.assign(document,element());
  document.documentElement=element();document.body=element();document.activeElement=document.body;
  const nodes=Object.fromEntries(['hello-intro','site-content','hello-skip','main'].map(x=>[x,element()]));
  document.getElementById=id=>nodes[id];
  const storage={getItem(k){if(blocked)throw Error('blocked');return values.get(k)??null;},setItem(k,v){if(blocked)throw Error('blocked');values.set(k,v);}};
  const setTimer=(fn,ms)=>{scheduled.set(++id,{fn,at:now+ms});return id;};
  const clearTimer=id=>scheduled.delete(id);
  const advance=ms=>{const end=now+ms;while(true){const next=[...scheduled].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;now=next[1].at;scheduled.delete(next[0]);next[1].fn();}now=end;};
  const controller=createHelloController({document,storage,reducedMotion:()=>reduce,setTimer,clearTimer});
  return {document,nodes,values,storage,setTimer,advance,controller,scheduled};
}

test('first visit blocks background focus until handwriting and exit finish, then records completion',()=>{
  const f=fixture();assert.equal(f.controller.play(),true);
  assert.equal(f.nodes['site-content'].inert,true);assert.equal(f.document.activeElement,f.nodes['hello-skip']);
  f.advance(4099);assert.equal(f.nodes['site-content'].inert,true);assert.equal(f.values.size,0);
  f.advance(481);assert.equal(f.nodes['hello-intro'].hidden,true);assert.equal(f.nodes['site-content'].inert,false);
  assert.equal(f.document.activeElement,f.nodes.main);assert.equal(f.values.get(HELLO_KEY),'1');assert.equal(f.scheduled.size,0);
  assert.equal(f.controller.play(),false);
});
test('skip and Escape dismiss once, release focus and prevent a second automatic intro',()=>{
  for(const input of ['click','Escape']){
    const f=fixture();f.controller.play();
    if(input==='click')f.nodes['hello-skip'].emit('click');
    else f.document.emit('keydown',{key:'Escape',preventDefault(){}});
    f.controller.dismiss();f.advance(480);
    assert.equal(f.nodes['site-content'].inert,false);assert.equal(f.nodes['hello-intro'].hidden,true);
    assert.equal(f.values.get(HELLO_KEY),'1');assert.equal(f.controller.play(),false);
  }
});
test('returning visitors enter directly and can deliberately replay with focus restored',()=>{
  const f=fixture({saved:true});assert.equal(f.controller.play(),false);
  const trigger=f.nodes.main;trigger.focus();assert.equal(f.controller.play({force:true}),true);
  assert.equal(f.controller.play({force:true}),false);f.advance(4580);assert.equal(f.document.activeElement,trigger);
});
test('unavailable storage never traps the user and playback is remembered for the current page',()=>{
  const f=fixture({blocked:true});assert.equal(f.controller.play(),true);f.advance(10000);
  assert.equal(f.nodes['site-content'].inert,false);assert.equal(f.controller.play(),false);
});
test('reduced motion skips the automatic intro; explicit replay shows the static lettering briefly',()=>{
  const f=fixture({reduce:true});assert.equal(f.controller.play(),false);assert.equal(f.nodes['site-content'].inert,false);
  assert.equal(f.controller.play({force:true}),true);f.advance(1200);
  assert.equal(f.nodes['hello-intro'].hidden,true);assert.equal(f.nodes['site-content'].inert,false);
});
test('Tab remains on the skip control while the intro is active',()=>{
  const f=fixture();f.controller.play();let prevented=false;
  f.document.emit('keydown',{key:'Tab',preventDefault(){prevented=true;}});
  assert.equal(prevented,true);assert.equal(f.document.activeElement,f.nodes['hello-skip']);
});
test('HTML bootstrap releases the page if the intro module never loads',async()=>{
  const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
  const bootstrap=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const f=fixture();runInNewContext(bootstrap,{document:f.document,localStorage:f.storage,matchMedia:()=>({matches:false}),setTimeout:f.setTimer});
  assert.equal(f.document.documentElement.classList.contains('hello-pending'),true);
  f.nodes['site-content'].inert=true;f.advance(6500);
  assert.equal(f.document.documentElement.classList.contains('hello-pending'),false);assert.equal(f.nodes['site-content'].inert,false);
});
