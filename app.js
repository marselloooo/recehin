'use strict';
const $=s=>document.querySelector(s),K='recehin_v1';
const EXP={makan:['🍚','Makan'],transport:['🛵','Transport'],kos:['🏠','Kos/Listrik/Air'],pulsa:['📱','Pulsa/Kuota'],kuliah:['📚','Kuliah/Fotokopi'],jajan:['🧋','Jajan'],hiburan:['🎮','Hiburan'],lain:['📦','Lainnya']};
const INC={kiriman:['👪','Kiriman ortu'],gaji:['💼','Part-time'],masuk:['💰','Lainnya']};
const COL=['#14b8a6','#f59e0b','#6366f1','#ec4899','#84cc16','#06b6d4','#f97316','#94a3b8'];
const MSG=[()=>'Udah jajan hari ini? Sisihin Rp2.000 yuk buat target tabunganmu!',()=>'Receh kecil hari ini = tenang di akhir bulan. Setor dikit yuk 🐷',()=>'Kembalian tadi jangan dibiarin hilang, masukin celengan yuk!',()=>'Nabung Rp1.000 pun tetap nabung. Yang penting jalan terus 💪',()=>'Hai! Waktunya cek dompet. Ada receh yang bisa ditabung hari ini?'];
const D=()=>({tx:[],goals:[],set:{budget:0,time:'19:00',remind:false,freq:'daily',theme:'auto'},last:{notif:'',idle:'',onb:false},banner:null});
let S=(()=>{try{const x=JSON.parse(localStorage[K]);return{...D(),...x,set:{...D().set,...x.set},last:{...D().last,...x.last}}}catch(e){return D()}})();
let tab='home';
const save=()=>{localStorage[K]=JSON.stringify(S)},uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const ds=d=>new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10),today=()=>ds(new Date());
const rp=n=>(n<0?'-':'')+'Rp'+Math.round(Math.abs(n)).toLocaleString('id-ID'),dots=n=>Math.round(n).toLocaleString('id-ID'),num=v=>+String(v).replace(/\D/g,'')||0;
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const saved=g=>g.dep.reduce((s,x)=>s+x.a,0);
const deps=()=>S.goals.flatMap(g=>g.dep);
function md(){const m=today().slice(0,7),tx=S.tx.filter(t=>t.d.startsWith(m)),by={};let inc=0,out=0;
 tx.forEach(t=>{if(t.type=='in')inc+=t.a;else{out+=t.a;by[t.cat]=(by[t.cat]||0)+t.a}});
 return{inc,out,by,sv:deps().filter(x=>x.d.startsWith(m)).reduce((s,x)=>s+x.a,0)}}
function streak(){const set=new Set(deps().map(x=>x.d));let d=new Date(),n=0;if(!set.has(ds(d)))d.setDate(d.getDate()-1);
 while(set.has(ds(d))){n++;d.setDate(d.getDate()-1)}return n}
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.display='none',2600)}
function sheet(h){const s=$('#sh');s.innerHTML='<div class="sheet">'+h+'</div>';s.classList.add('show');s.onclick=e=>{if(e.target.id=='sh')closeSh()}}
function closeSh(){$('#sh').classList.remove('show');$('#sh').innerHTML=''}
function go(t){tab=t;render();scrollTo(0,0)}
function applyTheme(){const t=S.set.theme,d=t=='dark'||(t=='auto'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.dataset.t=d?'d':'l'}

/* ===== Views ===== */
function vHome(){const d=md(),sisa=d.inc-d.out-d.sv,now=new Date(),left=new Date(now.getFullYear(),now.getMonth()+1,0).getDate()-now.getDate()+1,b=S.set.budget,p=b?d.out/b:0;
 const cats=Object.entries(d.by).sort((a,b)=>b[1]-a[1]);let acc=0;
 const grad=cats.map(([k,v],i)=>{const s=acc;acc+=v/d.out*100;return COL[i%8]+' '+s+'% '+acc+'%'}).join(',');
 const days=[...Array(7)].map((_,i)=>{const x=new Date();x.setDate(x.getDate()-6+i);const k=ds(x);return[S.tx.filter(t=>t.type=='out'&&t.d==k).reduce((s,t)=>s+t.a,0),['Min','Sen','Sel','Rab','Kam','Jum','Sab'][x.getDay()]]});
 const mx=Math.max(1,...days.map(x=>x[0]));
 return `<div class="card hero"><small>Sisa uang bulan ini</small><div class="n">${rp(sisa)}</div>
 <div class="row"><div><small>Masuk</small><b>${rp(d.inc)}</b></div><div><small>Keluar</small><b>${rp(d.out)}</b></div><div><small>Ditabung</small><b>${rp(d.sv)}</b></div></div></div>
 <div class="card"><small>Uang harian aman (${left} hari lagi)</small><div style="font-size:26px;font-weight:800;color:var(--p)">${rp(Math.max(0,sisa/left))}</div>
 <small>${sisa<0?'Bulan ini keluar lebih besar dari masuk. Tenang, tetap catat ya — besok bisa diatur lagi.':'Selama jajanmu di bawah ini, aman sampai akhir bulan.'}</small></div>
 ${b?`<div class="card"><div class="row"><b>Anggaran bulan ini</b><small>${rp(d.out)} / ${rp(b)}</small></div><div class="bar ${p>=1?'r':p>=.8?'y':''}"><i style="width:${Math.min(100,p*100)}%"></i></div>
 <small>${p>=1?'Anggaran sudah habis. Yuk tahan dulu yang bukan kebutuhan pokok.':p>=.8?'Sudah '+Math.round(p*100)+'% nih. Pelan-pelan ya, masih ada sisa hari 🙂':'Masih aman, '+Math.round(p*100)+'% terpakai.'}</small></div>`:''}
 <div class="card"><h3>Pengeluaran per kategori</h3>${cats.length?`<div class="donut"><div class="ring" style="background:conic-gradient(${grad})"></div><div class="leg">${cats.map(([k,v],i)=>`<div><i style="background:${COL[i%8]}"></i>${EXP[k][1]}<span>${rp(v)}</span></div>`).join('')}</div></div>`:'<div class="empty">Belum ada pengeluaran bulan ini.</div>'}</div>
 <div class="card"><h3>7 hari terakhir</h3><div class="bars">${days.map(x=>`<div><i style="height:${x[0]/mx*80}px"></i>${x[1]}</div>`).join('')}</div></div>`}

function txRow(t){const c=(t.type=='in'?INC:EXP)[t.cat]||['📦','Lainnya'];
 return `<div class="tx" onclick="txSheet('${t.id}')"><div class="ic">${c[0]}</div><div><b>${esc(t.n)||c[1]}</b><small>${c[1]}</small></div><b class="${t.type}">${t.type=='in'?'+':'-'}${rp(t.a)}</b></div>`}
function vCatat(){if(!S.tx.length)return '<div class="empty card">Belum ada catatan.<br>Ketuk tombol + untuk mulai.</div>';
 const g={};[...S.tx].sort((a,b)=>b.d.localeCompare(a.d)).forEach(t=>(g[t.d]=g[t.d]||[]).push(t));
 return Object.entries(g).map(([d,l])=>`<div class="dh">${new Date(d+'T00:00').toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long'})}</div><div class="card">${l.map(txRow).join('')}</div>`).join('')}

function est(g){const sv=saved(g),rem=g.target-sv;if(rem<=0)return'Target tercapai! 🎉';
 if(g.due){const dl=Math.ceil((new Date(g.due+'T00:00')-new Date())/864e5);if(dl<=0)return'Tenggat sudah lewat. Atur ulang biar nyaman?';return`Setor ±${rp(rem/dl)}/hari biar tepat waktu`}
 const first=g.dep[0]?g.dep[0].d:null;if(first){const dd=Math.max(1,Math.ceil((new Date()-new Date(first+'T00:00'))/864e5)),pace=sv/dd,eta=new Date(Date.now()+rem/pace*864e5);
  return`Dengan ritme sekarang, tercapai ±${eta.toLocaleDateString('id-ID',{month:'long',year:'numeric'})}`}
 return`Mulai Rp2.000/hari → tercapai ±${Math.ceil(rem/2000)} hari`}
function vNabung(){const st=streak(),n=deps().length,done=S.goals.some(g=>saved(g)>=g.target),B=[[n>=1,'🌱 Setoran pertama'],[st>=3,'🔥 3 hari berturut'],[st>=7,'⭐ 7 hari nabung berturut-turut'],[st>=30,'👑 30 hari berturut'],[done,'🏆 Target tercapai']];
 const open=S.goals.find(g=>saved(g)<g.target),ch=open?Math.ceil((open.target-saved(open))/2000):0;
 return `<div class="card"><div class="row"><div><small>Streak nabung</small><div style="font-size:28px;font-weight:800">🔥 ${st} hari</div></div><button class="btn" style="align-self:center" onclick="goalSheet()">+ Target</button></div>
 <small>${st?'Mantap, lanjutkan!':'Tidak apa-apa putus, mulai lagi kapan saja.'}</small></div>
 ${S.goals.map(g=>{const sv=saved(g),p=Math.min(100,sv/g.target*100);return `<div class="card"><div class="row"><b>${esc(g.name)}</b><small>${Math.round(p)}%</small></div>
 <div class="bar t"><i style="width:${p}%"></i></div><small>${rp(sv)} dari ${rp(g.target)}${g.due?' · tenggat '+g.due:''}</small><small style="margin-top:4px">${est(g)}</small>
 <div class="row" style="margin-top:10px"><button class="btn" onclick="depSheet('${g.id}')">Setor receh</button><button class="del" style="width:auto;margin:0;padding:6px" onclick="delGoal('${g.id}')">Hapus</button></div></div>`}).join('')||'<div class="empty card">Belum ada target. Buat satu yuk, mulai dari yang kecil!</div>'}
 ${open?`<div class="card"><h3>🪙 Tantangan Nabung Receh</h3><small>Sisihkan Rp2.000/hari (atau kembalian belanja) → "${esc(open.name)}" tercapai dalam ±${ch} hari.</small><button class="ghost" onclick="depSheet('${open.id}',2000)">Ikut tantangan hari ini</button></div>`:''}
 <div class="card"><h3>Lencana</h3><div class="badges">${B.map(b=>`<span class="bd ${b[0]?'':'off'}">${b[1]}</span>`).join('')}</div></div>`}

function vAtur(){const s=S.set;return `<div class="card"><h3>Anggaran bulanan</h3><input id="bg" inputmode="numeric" placeholder="Batas pengeluaran sebulan" value="${s.budget?dots(s.budget):''}" oninput="this.value=dots(num(this.value)||'')||''" onchange="S.set.budget=num(this.value);save();toast('Anggaran disimpan')"></div>
 <div class="card"><h3>Pengingat menabung</h3><div class="sw"><span>Aktifkan pengingat</span><input type="checkbox" ${s.remind?'checked':''} onchange="setRemind(this.checked)"></div>
 <div class="row"><input type="time" value="${s.time}" onchange="S.set.time=this.value;save()"><select onchange="S.set.freq=this.value;save()"><option value="daily" ${s.freq=='daily'?'selected':''}>Setiap hari</option><option value="weekly" ${s.freq=='weekly'?'selected':''}>Mingguan (Minggu)</option></select></div>
 <small>Notifikasi muncul saat aplikasi terbuka atau masih jalan di latar belakang. Banner di dalam aplikasi selalu aktif.</small><button class="ghost" onclick="notify('Tes: sisihin Rp2.000 yuk buat tabungan!')">Tes notifikasi</button></div>
 <div class="card"><h3>Tampilan</h3><select onchange="S.set.theme=this.value;save();render()"><option value="auto" ${s.theme=='auto'?'selected':''}>Ikuti sistem</option><option value="light" ${s.theme=='light'?'selected':''}>Terang</option><option value="dark" ${s.theme=='dark'?'selected':''}>Gelap</option></select></div>
 <div class="card"><h3>Data</h3><button class="ghost" onclick="dl('recehin-backup.json',JSON.stringify(S),'application/json')">Backup (JSON)</button>
 <button class="ghost" onclick="$('#imp').click()">Restore dari file</button><input id="imp" type="file" accept=".json" hidden onchange="imp(this.files[0])">
 <button class="ghost" onclick="csv()">Ekspor transaksi (CSV)</button><button class="del" onclick="if(confirm('Hapus semua data? Ini tidak bisa dibatalkan.')){localStorage.removeItem(K);location.reload()}">Hapus semua data</button></div>`}

function render(){applyTheme();const b=S.banner;
 $('#bn').innerHTML=b?`<div class="ban"><span>${b.m}</span>${b.act?`<button onclick="${b.act}">Tabung</button>`:''}<button onclick="S.banner=null;save();render()" aria-label="Tutup">✕</button></div>`:'';
 $('#v').innerHTML=({home:vHome,catat:vCatat,nabung:vNabung,atur:vAtur})[tab]();
 document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('on',x.dataset.t==tab))}

/* ===== Sheets ===== */
function txSheet(id){const old=S.tx.find(x=>x.id==id),t=old?{...old}:{type:'out',cat:'makan',a:0,d:today(),n:''};
 const sync=()=>{t.a=num($('#amt').value);t.n=$('#note').value;t.d=$('#dt').value||today()};
 const draw=()=>{const C=t.type=='out'?EXP:INC;
  sheet(`<h3>${old?'Ubah':'Catat'} transaksi</h3><div class="seg"><button data-ty="out" class="${t.type=='out'?'on':''}">Pengeluaran</button><button data-ty="in" class="${t.type=='in'?'on':''}">Pemasukan</button></div>
  <input id="amt" class="big" inputmode="numeric" placeholder="0" value="${t.a?dots(t.a):''}">
  <div class="chips">${[5,10,20,50].map(v=>`<button data-q="${v*1000}">+${v}rb</button>`).join('')}</div>
  <div class="cats">${Object.entries(C).map(([k,[i,n]])=>`<button data-c="${k}" class="${t.cat==k?'on':''}">${i}<span>${n}</span></button>`).join('')}</div>
  <input id="note" placeholder="Catatan (opsional)" value="${esc(t.n)}"><input id="dt" type="date" value="${t.d}">
  <button class="pri" id="ok">Simpan</button>${old?'<button class="del" id="rm">Hapus transaksi</button>':''}`);
  const am=$('#amt');am.oninput=()=>{am.value=dots(num(am.value))==='0'?'':dots(num(am.value))};if(!old)am.focus();
  document.querySelectorAll('[data-ty]').forEach(b=>b.onclick=()=>{sync();t.type=b.dataset.ty;t.cat=Object.keys(t.type=='out'?EXP:INC)[0];draw()});
  document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{sync();t.a+=+b.dataset.q;draw()});
  document.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{sync();t.cat=b.dataset.c;draw()});
  $('#ok').onclick=()=>{sync();if(!t.a)return toast('Isi nominalnya dulu ya');
   if(old)Object.assign(old,t);else{t.id=uid();S.tx.push(t);
    if(t.type=='in'&&S.goals.some(g=>saved(g)<g.target))S.banner={m:`Pemasukan masuk! Sisihin 10% (${rp(t.a/10)}) buat nabung dulu yuk?`,act:`depSheet('${S.goals.find(g=>saved(g)<g.target).id}',${Math.round(t.a/10)})`}}
   save();closeSh();render();toast('Tersimpan ✔')};
  if(old)$('#rm').onclick=()=>{if(confirm('Hapus transaksi ini?')){S.tx=S.tx.filter(x=>x.id!=id);save();closeSh();render()}}};
 draw()}
function goalSheet(pre){sheet(`<h3>Target tabungan baru</h3><input id="gn" placeholder="Nama (mis. Dana darurat)" value="${esc(pre&&pre.n)}"><input id="gt" inputmode="numeric" placeholder="Nominal target" value="${pre&&pre.t?dots(pre.t):''}"><small>Tenggat (opsional)</small><input id="gd" type="date">
 <button class="pri" id="ok">Buat target</button>`);const gt=$('#gt');gt.oninput=()=>gt.value=num(gt.value)?dots(num(gt.value)):'';
 $('#ok').onclick=()=>{const n=$('#gn').value.trim(),t=num(gt.value);if(!n||!t)return toast('Isi nama dan nominal ya');S.goals.push({id:uid(),name:n,target:t,due:$('#gd').value||'',dep:[]});save();closeSh();render();toast('Target dibuat 🎯')}}
function depSheet(id,pre){const g=S.goals.find(x=>x.id==id);if(!g)return;sheet(`<h3>Setor ke "${esc(g.name)}"</h3><input id="amt" class="big" inputmode="numeric" placeholder="0" value="${pre?dots(pre):''}">
 <div class="chips">${[1,2,5,10].map(v=>`<button data-q="${v*1000}">+${v}rb</button>`).join('')}</div><button class="pri" id="ok">Setor</button>`);
 const am=$('#amt');am.oninput=()=>am.value=num(am.value)?dots(num(am.value)):'';
 document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>am.value=dots(num(am.value)+ +b.dataset.q));
 $('#ok').onclick=()=>{const a=num(am.value);if(!a)return toast('Isi nominalnya dulu ya');g.dep.push({d:today(),a});S.banner=null;save();closeSh();tab='nabung';render();
  toast(pick(['Mantap! Receh jadi bukit 💪','Keren, '+rp(a)+' masuk celengan!','Satu langkah lebih dekat 🎯']))}}
function delGoal(id){if(confirm('Hapus target ini beserta riwayat setorannya?')){S.goals=S.goals.filter(g=>g.id!=id);save();render()}}

/* ===== Onboarding ===== */
function onb(step,v={}){const sk='<button class="ghost" onclick="S.last.onb=true;save();closeSh()">Lewati dulu</button>';
 if(step==1){sheet(`<h3>Halo! 👋 Uang bulananmu berapa?</h3><small>Bisa dari kiriman ortu atau part-time. Tenang, bisa diubah kapan saja.</small><input id="o" class="big" inputmode="numeric" placeholder="1.000.000"><button class="pri" id="ok">Lanjut</button>${sk}`);
  const o=$('#o');o.oninput=()=>o.value=num(o.value)?dots(num(o.value)):'';$('#ok').onclick=()=>{const a=num(o.value);if(!a)return toast('Isi dulu ya');S.tx.push({id:uid(),type:'in',cat:'kiriman',a,d:today(),n:'Uang bulanan'});save();onb(2,{a})}}
 if(step==2){sheet(`<h3>Batas jajan sebulan?</h3><small>Kami sarankan sisakan sekitar 10% buat tabungan.</small><input id="o" class="big" inputmode="numeric" value="${dots(v.a*.9)}"><button class="pri" id="ok">Lanjut</button>`);
  const o=$('#o');o.oninput=()=>o.value=num(o.value)?dots(num(o.value)):'';$('#ok').onclick=()=>{S.set.budget=num(o.value);save();onb(3)}}
 if(step==3){S.last.onb=true;save();render();goalSheet({n:'Dana darurat',t:300000})}}

/* ===== Pengingat ===== */
async function setRemind(on){S.set.remind=on;if(on&&'Notification' in window&&Notification.permission=='default'){const p=await Notification.requestPermission();if(p!='granted')toast('Notifikasi diblokir browser. Banner dalam aplikasi tetap muncul.')}save();render()}
function notify(m){if('Notification' in window&&Notification.permission=='granted'){const o={body:m,icon:'icon.svg',badge:'icon.svg'};
  (navigator.serviceWorker?navigator.serviceWorker.getRegistration():Promise.resolve()).then(r=>r?r.showNotification('RECEHIN',o):new Notification('RECEHIN',o))}else toast(m)}
function tick(){const s=S.set,n=new Date(),t=today(),hm=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0');
 if(s.remind&&S.last.notif!=t&&hm>=s.time&&(s.freq=='daily'||n.getDay()==0)){S.last.notif=t;const m=pick(MSG)();S.banner={m};save();notify(m);render()}}
function idleCheck(){const t=today();if(S.banner||S.last.idle==t||!S.last.onb)return;const ago=a=>a.length?(new Date(t)-new Date(a.sort().pop()))/864e5:99;
 if(S.goals.length&&ago(deps().map(x=>x.d))>=3)S.banner={m:'Udah beberapa hari nggak nabung nih. Nggak apa-apa, Rp1.000 aja boleh kok 🙂'};
 else if(ago(S.tx.map(x=>x.d))>=2)S.banner={m:'Udah 2 hari belum nyatat. Yuk catat sebentar biar nggak lupa uangnya ke mana.'};
 if(S.banner){S.last.idle=t;save()}}

/* ===== Data ===== */
function dl(n,c,t){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([c],{type:t}));a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),999)}
function csv(){const r=[['Tanggal','Jenis','Kategori','Nominal','Catatan'],...S.tx.map(t=>[t.d,t.type=='in'?'Masuk':'Keluar',(t.type=='in'?INC:EXP)[t.cat]?.[1]||t.cat,t.a,t.n])];
 dl('recehin.csv',r.map(x=>x.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n'),'text/csv')}
function imp(f){if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!Array.isArray(x.tx)||!Array.isArray(x.goals))throw 0;S={...D(),...x};save();render();toast('Data berhasil dipulihkan')}catch(e){toast('File backup tidak valid')}};r.readAsText(f)}

/* ===== Start ===== */
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
render();if(!S.last.onb&&!S.tx.length)onb(1);else idleCheck();render();tick();setInterval(tick,3e4);
