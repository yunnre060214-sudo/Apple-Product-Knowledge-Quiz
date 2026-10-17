import {APPLE_PATH} from './brand.mjs?v=2.0.4';
export const SITE_URL = 'https://yunnre060214-sudo.github.io/Apple-Product-Knowledge-Quiz/';
export function shareText(report, title) {
  return `Apple 冷知识 · ${report.correct}/${report.total} 题 · ${report.score} 分\n「${title}」\n不服来战！\n${SITE_URL}`;
}
export async function createShareCard(report, title, line) {
  await document.fonts?.ready;
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1440;
  const c=canvas.getContext('2d');if(!c)throw new Error('Canvas unavailable');
  const bg=c.createLinearGradient(0,0,1080,1440);bg.addColorStop(0,'#f0ecff');bg.addColorStop(.48,'#f9faff');bg.addColorStop(1,'#e6f7f0');c.fillStyle=bg;c.fillRect(0,0,1080,1440);
  const blob=(x,y,r,color)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);};
  blob(1000,80,500,'#cdc1ff90');blob(70,1300,400,'#9fdccf80');
  c.fillStyle='#ffffffd9';c.beginPath();c.roundRect(60,60,960,1320,48);c.fill();
  const font=(size,weight=500)=>{c.font=`${weight} ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif`;};
  const center=(text,y,size,weight=500,color='#202137',max=850)=>{font(size,weight);while(c.measureText(text).width>max&&size>16)font(--size,weight);c.fillStyle=color;c.textAlign='center';c.fillText(text,540,y);};
  font(38,750);const brandText='Apple Trivia',brandWidth=c.measureText(brandText).width,brandLeft=(1080-brandWidth-52)/2;
  c.save();c.translate(brandLeft-5,88);c.scale(2.2,2.2);const brandGradient=c.createLinearGradient(2,10,18,29);brandGradient.addColorStop(0,'#7b60d7');brandGradient.addColorStop(.5,'#a38add');brandGradient.addColorStop(1,'#e6a399');c.fillStyle=brandGradient;c.fill(new Path2D(APPLE_PATH));c.restore();
  c.fillStyle='#202137';c.textAlign='left';c.fillText(brandText,brandLeft+52,160);center('来 点 苹 果 冷 知 识',212,22,500,'#72758b');
  c.strokeStyle='#e8e8f1';c.lineWidth=2;c.beginPath();c.moveTo(128,255);c.lineTo(952,255);c.stroke();
  center(String(report.score),560,244,800,'#6455da');center('分',615,30,600,'#858497');
  center(title,750,58,750);center(line,822,28,500,'#73758b');
  center(`猜对 ${report.correct} / ${report.total} 题    ·    用时 ${report.duration} 秒`,925,29,600);
  c.fillStyle='#242438';c.beginPath();c.roundRect(280,1012,520,96,48);c.fill();center('不服来战',1076,38,700,'#ffffff');
  center('yunnre060214-sudo.github.io',1210,27,600,'#5e6176');center('/Apple-Product-Knowledge-Quiz/',1253,25,500,'#777b8d');center('5 题一局 · 无需登录 · 好奇心即刻开场',1320,22,500,'#8d8fa1');
  const blobResult=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('PNG encoding failed')),'image/png'));
  return blobResult;
}
export function downloadBlob(blob, filename) {
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
