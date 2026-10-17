import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createThemeSwitcher} from '../assets/theme.mjs';

function fixture({theme='light', supported=true, reduce=false, width=390, height=844, bounds={left:320,top:18,width:44,height:44}, fail}={}) {
  const values=new Map(), classes=new Set(), applied=[], saved=[];
  const root={dataset:{theme},style:{setProperty:(k,v)=>values.set(k,v),removeProperty:k=>values.delete(k)},classList:{add:v=>classes.add(v),remove:v=>classes.delete(v)}};
  let finish, skipCount=0, captures=0;
  const finished=new Promise(resolve=>{finish=resolve;});
  const document={documentElement:root};
  if(supported)document.startViewTransition=update=>{
    captures++;
    if(fail==='start')throw Error('unavailable');
    update();
    return {ready:fail==='ready'?Promise.reject(Error('skipped')):Promise.resolve(),finished,skipTransition(){skipCount++;finish();}};
  };
  const switchTheme=createThemeSwitcher({document,window:{innerWidth:width,innerHeight:height},applyTheme:v=>{root.dataset.theme=v;applied.push(v);},saveTheme:v=>saved.push(v),reducedMotion:()=>reduce});
  return {switchTheme,button:{getBoundingClientRect:()=>bounds},root,values,classes,applied,saved,finish,get skips(){return skipCount;},get captures(){return captures;}};
}

test('both appearance directions reveal from the button center and cover every viewport corner',async()=>{
  for(const theme of ['light','dark'])for(const geometry of [
    {width:390,height:844,bounds:{left:320,top:18,width:44,height:44}},
    {width:1440,height:900,bounds:{left:1236,top:26,width:44,height:44}},
    {width:844,height:390,bounds:{left:760,top:12,width:44,height:44}},
  ]) {
    const f=fixture({theme,...geometry});const pending=f.switchTheme(f.button);await Promise.resolve();
    const x=parseFloat(f.values.get('--theme-reveal-x')),y=parseFloat(f.values.get('--theme-reveal-y')),r=parseFloat(f.values.get('--theme-reveal-radius'));
    assert.equal(x,geometry.bounds.left+22);assert.equal(y,geometry.bounds.top+22);
    for(const [cx,cy] of [[0,0],[geometry.width,0],[0,geometry.height],[geometry.width,geometry.height]])assert.ok(r>Math.hypot(cx-x,cy-y));
    assert.equal(f.root.dataset.theme,theme==='dark'?'light':'dark');assert.equal(f.classes.has('theme-revealing'),true);
    f.finish();assert.equal(await pending,true);assert.equal(f.values.size,0);assert.equal(f.classes.size,0);assert.equal(f.saved.length,1);
  }
});
test('rapid clicks cannot overlap captures or overwrite the saved appearance',async()=>{
  const f=fixture(),pending=f.switchTheme(f.button);assert.equal(await f.switchTheme(f.button),false);
  assert.equal(f.captures,1);assert.deepEqual(f.saved,['dark']);f.finish();await pending;
  await f.switchTheme(f.button);assert.deepEqual(f.saved,['dark','light']);
});
test('unsupported browsers and reduced motion still switch and save the appearance once',async()=>{
  for(const options of [{supported:false},{reduce:true}]) {
    const f=fixture(options);assert.equal(await f.switchTheme(f.button),true);
    assert.deepEqual(f.applied,['dark']);assert.deepEqual(f.saved,['dark']);assert.equal(f.captures,0);assert.equal(f.classes.size,0);
  }
});
test('failed or skipped captures apply the appearance without leaving an overlay or lock',async()=>{
  for(const fail of ['start','ready']) {
    const f=fixture({fail});assert.equal(await f.switchTheme(f.button),true);
    assert.deepEqual(f.applied,['dark']);assert.deepEqual(f.saved,['dark']);assert.equal(f.values.size,0);assert.equal(f.classes.size,0);
    await f.switchTheme(f.button);assert.equal(f.root.dataset.theme,'light');
  }
});
