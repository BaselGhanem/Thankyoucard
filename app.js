'use strict';
const $=id=>document.getElementById(id);
const W=2400,H=1350, SX=W/13439775, SY=H/7559675;
let names=[],selected=0,ready=false,busy=false;
const bg=new Image();
const ctx=$(`card`).getContext(`2d`);
const encode=new TextEncoder();
function tell(text){$(`message`).textContent=text;}
function persist(){try{localStorage.setItem(`shraideh-names-v1`,JSON.stringify(names));}catch{tell(`تعذر حفظ القائمة على هذا المتصفح`);}}
function controls(){for(const id of [`all`,`single`,`zip`])$(id).disabled=!ready||!names.length||busy;$(`prev`).disabled=selected<=0||busy;$(`next`).disabled=selected>=names.length-1||busy;}
function draw(name=`Ibraheem Huseen Rfefah Alsawaeer`,canvas=$(`card`)){
 const c=canvas.getContext(`2d`);c.clearRect(0,0,W,H);c.drawImage(bg,0,0,W,H);c.fillStyle=`#000`;c.textBaseline=`top`;c.direction=`ltr`;
 function text(value,x,y,size,font,maxWidth,align=`left`){let px=size/100*12700*SX;c.font=`${px}px ${font}`;while(c.measureText(value).width>maxWidth&&px>8){px-=.5;c.font=`${px}px ${font}`;}c.textAlign=align;c.fillText(value,x,y);}
 const prefix=`Dear : `;const content=`${prefix}${name}`;
 text(content,(2179370+91440)*SX,(3199517+45720)*SY,3017,/\p{Script=Arabic}/u.test(name)?`Arabic`:`CardName`,(10871274-182880)*SX);
 text(`Thank You For Bringing Your Best to work`,(2179370+91440)*SX,(3894822+45720)*SY,3017,`CardName`,(8583117-182880)*SX);
 const center=(2681968+7577921/2)*SX;const y=(4587078+45720)*SY;const line=2263/100*12700*SY*1.18;
 [`We sincerely appreciate all your hard work & dedication,`,`your excellence performance is an inspiration to all.`,`Keep up the great work`].forEach((s,i)=>text(s,center,y+i*line,2263,`CardBody`,(7577921-182880)*SX,`center`));
 text(`Employee Department`,(2391671+91440)*SX,(5740175+45720)*SY,2011,`CardBody`,(2683555-182880)*SX);
 text(`HR Department`,(8747335+91440)*SX,(5740175+45720)*SY,2011,`CardBody`,(1920719-182880)*SX);
 return canvas;
}
function preview(){if(ready)draw(names[selected]);$(`position`).textContent=names.length?`${selected+1} / ${names.length} — ${names[selected]}`:`بطاقة تجريبية`;controls();}
function render(){selected=Math.max(0,Math.min(selected,names.length-1));$(`count`).textContent=names.length;$(`list`).replaceChildren();if(!names.length){const el=document.createElement(`p`);el.className=`empty`;el.textContent=`اضف الاسم الاول ليبدا التقدير`;$(`list`).append(el);}
 names.forEach((name,i)=>{const row=document.createElement(`div`);row.className=`name-row${i===selected?` active`:``}`;const pick=document.createElement(`button`);pick.textContent=`${i+1}`;pick.setAttribute(`aria-label`,`معاينة ${name}`);pick.onclick=()=>{selected=i;render();};const input=document.createElement(`input`);input.value=name;input.dir=`auto`;input.maxLength=200;input.setAttribute(`aria-label`,`تعديل الاسم ${i+1}`);input.onfocus=()=>{selected=i;preview();};input.oninput=()=>{const value=input.value.trim();if(value){names[i]=value;selected=i;persist();preview();}};input.onblur=()=>{input.value=names[i];};const del=document.createElement(`button`);del.textContent=`×`;del.setAttribute(`aria-label`,`حذف ${name}`);del.onclick=()=>{names.splice(i,1);persist();render();};row.append(pick,input,del);$(`list`).append(row);});preview();}
function parseNames(value){return value.replace(/^\uFEFF/,``).split(/\r?\n|\r|\t/).map(s=>s.trim().replace(/^"(.*)"$/s,`$1`).replace(/""/g,`"`).trim()).filter(Boolean);}
$(`add`).onclick=()=>{const entries=parseNames($(`names`).value);if(!entries.length){tell(`الصق الاسماء اولا`);return;}if(entries.some(n=>n.length>200)){tell(`الحد الاقصى للاسم 200 حرف، يرجى تقصير الاسماء الاطول`);return;}if(names.length+entries.length>1000){tell(`الحد الاقصى 1000 اسم في القائمة`);return;}names.push(...entries);$(`names`).value=``;selected=names.length-entries.length;persist();render();tell(`تمت اضافة ${entries.length} اسم`);};
$(`dedupe`).onclick=()=>{const before=names.length;const seen=new Set();names=names.filter(n=>{const key=n.normalize(`NFKC`).toLocaleLowerCase().replace(/\s+/g,` `);if(seen.has(key))return false;seen.add(key);return true;});persist();render();tell(`تم حذف ${before-names.length} اسم مكرر`);};
$(`clear`).onclick=()=>{if(names.length&&confirm(`مسح جميع الاسماء من القائمة؟`)){names=[];persist();render();tell(`تم مسح القائمة`);}};
$(`prev`).onclick=()=>{selected--;render();};$(`next`).onclick=()=>{selected++;render();};
function bytes(s){return encode.encode(s);}
function join(chunks){const out=new Uint8Array(chunks.reduce((n,a)=>n+a.length,0));let offset=0;for(const c of chunks){out.set(c,offset);offset+=c.length;}return out;}
function jpeg(canvas){return Uint8Array.from(atob(canvas.toDataURL(`image/jpeg`,.97).split(`,`)[1]),c=>c.charCodeAt(0));}
async function pdfFor(items,progress){const chunks=[bytes(`%PDF-1.4\n%card\n`)];let length=chunks[0].length;const offsets=[0];function push(data){chunks.push(data);length+=data.length;}function obj(id,data){offsets[id]=length;push(bytes(`${id} 0 obj\n`));push(typeof data===`string`?bytes(data):data);push(bytes(`\nendobj\n`));}
 const pageWidth=13439775/12700,pageHeight=7559675/12700;
 obj(1,`<< /Type /Catalog /Pages 2 0 R >>`);obj(2,`<< /Type /Pages /Count ${items.length} /Kids [${items.map((_,i)=>`${3+i*3} 0 R`).join(` `)}] >>`);
 const canvas=document.createElement(`canvas`);canvas.width=W;canvas.height=H;
 for(let i=0;i<items.length;i++){const id=3+i*3;const jpg=jpeg(draw(items[i],canvas));obj(id,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 ${id+1} 0 R >> >> /Contents ${id+2} 0 R >>`);obj(id+1,join([bytes(`<< /Type /XObject /Subtype /Image /Width ${W} /Height ${H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`),jpg,bytes(`\nendstream`)]));const stream=`q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im0 Do\nQ\n`;obj(id+2,`<< /Length ${bytes(stream).length} >>\nstream\n${stream}endstream`);progress?.(i+1,items.length);await new Promise(resolve=>setTimeout(resolve,0));}
 const start=length;push(bytes(`xref\n0 ${offsets.length}\n0000000000 65535 f \n${offsets.slice(1).map(o=>`${String(o).padStart(10,`0`)} 00000 n \n`).join(``)}trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`));canvas.width=canvas.height=1;return join(chunks);}
function download(data,name,type){const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement(`a`);a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
function safeName(name){return name.replace(/[<>:"/\\|?*\x00-\x1F]/g,`_`).slice(0,100)||`card`;}
const crcTable=Uint32Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=(n&1)?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc32(data){let n=0xffffffff;for(const b of data)n=crcTable[(n^b)&255]^(n>>>8);return(n^0xffffffff)>>>0;}
function header(size,values){const b=new Uint8Array(size),d=new DataView(b.buffer);for(const [at,value,width]of values)width===2?d.setUint16(at,value,true):d.setUint32(at,value,true);return b;}
function zipFiles(files){const parts=[],central=[];let offset=0,total=0;for(const file of files){const name=bytes(file.name),data=file.data,crc=crc32(data);const local=header(30,[[0,0x04034b50,4],[4,20,2],[6,0x800,2],[14,crc,4],[18,data.length,4],[22,data.length,4],[26,name.length,2]]);parts.push(local,name,data);const c=header(46,[[0,0x02014b50,4],[4,20,2],[6,20,2],[8,0x800,2],[16,crc,4],[20,data.length,4],[24,data.length,4],[28,name.length,2],[42,offset,4]]);central.push(c,name);total+=46+name.length;offset+=30+name.length+data.length;}return join([...parts,...central,header(22,[[0,0x06054b50,4],[8,files.length,2],[10,files.length,2],[12,total,4],[16,offset,4]])]);}
async function exportCards(mode){if(!ready||busy||!names.length)return;busy=true;controls();$(`loader`).hidden=false;$(`loadText`).textContent=`نجهز بطاقات التقدير`;try{const items=[...names];const progress=(i,n)=>{$(`loadText`).textContent=`جاري تجهيز البطاقة ${i} من ${n}`;};if(mode===`zip`){const files=[];for(let i=0;i<items.length;i++){progress(i+1,items.length);files.push({name:`${String(i+1).padStart(3,`0`)}-${safeName(items[i])}.pdf`,data:await pdfFor([items[i]])});}download(zipFiles(files),`Thank-you-cards.zip`,`application/zip`);}else{const selectedName=items[selected];download(await pdfFor(mode===`single`?[selectedName]:items,progress),mode===`single`?`${safeName(selectedName)}.pdf`:`Thank-you-cards.pdf`,`application/pdf`);}tell(`تم تجهيز الملف للتحميل`);}catch(error){console.error(error);tell(`تعذر التصدير، جرب عددا اقل من الاسماء او اعد المحاولة`);}finally{busy=false;$(`loader`).hidden=true;controls();}}
$(`all`).onclick=()=>exportCards(`all`);$(`single`).onclick=()=>exportCards(`single`);$(`zip`).onclick=()=>exportCards(`zip`);
async function init(){const introDelay=new Promise(resolve=>setTimeout(resolve,2500));try{const loaded=JSON.parse(localStorage.getItem(`shraideh-names-v1`)||`[]`);if(Array.isArray(loaded))names=loaded.filter(n=>typeof n===`string`&&n.trim()&&n.length<=200).slice(0,1000);}catch{}render();try{const imageReady=new Promise((resolve,reject)=>{bg.onload=resolve;bg.onerror=()=>reject(new Error(`Background unavailable`));bg.src=`assets/card-background.webp`;});await Promise.all([introDelay,document.fonts.load(`14px Almarai`),document.fonts.load(`700 20px Almarai`),imageReady,document.fonts.load(`800 60px CardName`),document.fonts.load(`50px CardBody`),document.fonts.load(`50px Arabic`)]);ready=true;render();$(`loader`).hidden=true;}catch(error){console.error(error);$(`loadText`).textContent=`تعذر تحميل البطاقة، تحقق من الاتصال ثم اعد المحاولة`;$(`retry`).hidden=false;}}
init();
