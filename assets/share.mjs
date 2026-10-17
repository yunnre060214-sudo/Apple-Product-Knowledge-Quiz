import {APPLE_PATH} from './brand.mjs?v=2.2.3';
export const SITE_URL = 'https://yunnre060214-sudo.github.io/Apple-Product-Knowledge-Quiz/';
const PALETTES = {
  perfect: {title:['#9d4e20','#ad3563'],darkTitle:['#f5c57e','#f1a9ca'],wash:['#fff3da','#fbe5ee'],ink:'#9d4e20'},
  regular: {title:['#5c45b1','#416cb6'],darkTitle:['#c5b4ff','#a9c6ff'],wash:['#efecff','#e7efff'],ink:'#5c45b1'},
  curious: {title:['#ac4636','#a04479'],darkTitle:['#ffb9a5','#eab1d5'],wash:['#ffede6','#f7e8f2'],ink:'#ac4636'},
};
export function resultPalette(report) {
  return PALETTES[report.total>0&&report.correct===report.total?'perfect':report.score>=60?'regular':'curious'];
}
export function shareText(report, title) {
  return `Apple 冷知识 · ${report.correct}/${report.total} 题 · ${report.score} 分\n「${title}」\n不服来战！\n${SITE_URL}`;
}
export async function createShareCard(report, title) {
  await document.fonts?.ready;
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1440;
  const c=canvas.getContext('2d');if(!c)throw new Error('Canvas unavailable');
  const palette=resultPalette(report);
  const gradient=(colors,x=86,y=0,endX=994,endY=0)=>{
    const g=c.createLinearGradient(x,y,endX,endY);colors.forEach((color,i)=>g.addColorStop(i/(colors.length-1),color));return g;
  };
  // All content sits inside the same 8% safe area as the rounded panel.
  c.fillStyle=gradient(palette.wash,0,0,1080,1440);c.fillRect(0,0,1080,1440);
  c.fillStyle='#ffffff';c.beginPath();c.roundRect(86,86,908,1268,44);c.fill();
  c.save();c.beginPath();c.roundRect(86,86,908,1268,44);c.clip();
  const wash=c.createLinearGradient(0,86,0,680);wash.addColorStop(0,palette.wash[0]);wash.addColorStop(1,'#ffffff');c.fillStyle=wash;c.fillRect(86,86,908,594);c.restore();
  const font=(size,weight=400)=>{c.font=`${weight} ${size}px -apple-system, "SF Pro", "PingFang SC", BlinkMacSystemFont, "Segoe UI", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif`;};
  const center=(text,y,size,weight=400,color='#242735',max=800)=>{
    text=String(text);font(size,weight);while(c.measureText(text).width>max&&size>16)font(--size,weight);
    c.fillStyle=color;c.textAlign='center';c.fillText(text,540,y);
  };
  const apple=(x,y,scale,fill)=>{c.save();c.translate(x,y);c.scale(scale,scale);c.translate(0,-9);c.fillStyle=fill;c.fill(new Path2D(APPLE_PATH));c.restore();};
  font(32,600);const brandText='Apple Trivia',brandWidth=c.measureText(brandText).width,brandLeft=(1080-brandWidth-48)/2;
  apple(brandLeft,153,1.6,gradient(['#7b60d7','#d88c99'],0,9,20,31));
  c.fillStyle='#242735';c.textAlign='left';c.fillText(brandText,brandLeft+48,182);
  c.strokeStyle='#e1e4ec';c.lineWidth=2;c.beginPath();c.moveTo(166,246);c.lineTo(914,246);c.stroke();
  c.fillStyle=palette.wash[0];c.beginPath();c.roundRect(484,306,112,112,30);c.fill();apple(514,330,2.6,palette.ink);
  center(title,536,82,700,gradient(palette.title));
  center(report.score,740,128,600);center('分',788,28,400,'#616779');
  center(`猜对 ${report.correct} / ${report.total} 题`,898,34,500);
  const duration=`${Math.floor(report.duration/60)}:${String(report.duration%60).padStart(2,'0')}`;
  center(`用时 ${duration}`,954,28,400,'#616779');
  c.fillStyle='#6550c7';c.beginPath();c.roundRect(300,1040,480,96,24);c.fill();center('不服来战',1102,36,600,'#ffffff');
  center('yunnre060214-sudo.github.io',1230,26,500,'#616779');
  center('/Apple-Product-Knowledge-Quiz/',1274,24,400,'#616779');
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('PNG encoding failed')),'image/png'));
}
export function downloadBlob(blob, filename) {
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
