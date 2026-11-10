const $=s=>document.querySelector(s);
const services=[['IGD 24 Jam','Penanganan gawat darurat tanpa jeda.'],['Poliklinik','Konsultasi spesialis dengan jadwal jelas.'],['Rawat Inap','Kamar nyaman dengan pemantauan perawat.'],['Laboratorium','Hasil akurat, bisa dilihat digital.'],['Radiologi','CT scan, MRI, dan USG terkini.'],['Farmasi','Obat lengkap dengan konseling apoteker.'],['Operasi','Kamar operasi steril untuk bedah kompleks.'],['Medical Check Up','Pemeriksaan menyeluruh untuk deteksi dini.']];
const facs=[['Ruang tunggu pendaftaran','var(--p1)','cover','center'],['Ruang rawat inap','var(--p2)','cover','center'],['Kamar operasi','var(--p3)','cover','center'],['Fasad berornamen','var(--ph)','280% auto','33% 22%'],['Pintu utama & drop-off','var(--ph)','320% auto','70% 70%'],['Taman penyembuhan','var(--ph)','260% auto','30% 95%']];
const polis=['Penyakit Dalam','Jantung','Anak','Bedah','Saraf'];
const docs=[['dr. Anindya Prameswari, Sp.PD','Penyakit Dalam','Senin–Rabu, 09.00–14.00'],['dr. Raka Mahendra, Sp.JP','Jantung','Selasa & Kamis, 10.00–16.00'],['dr. Salsabila Nur, Sp.A','Anak','Senin–Jumat, 08.00–12.00'],['dr. Bagas Wicaksono, Sp.B','Bedah','Rabu & Sabtu, 13.00–18.00'],['dr. Laras Setyaningrum, Sp.N','Saraf','Kamis–Sabtu, 09.00–15.00']];
$('#svc').innerHTML=services.map(s=>`<div class="panel card"><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('');
$('#fac').innerHTML=facs.map(f=>`<div class="ph" style="background-image:${f[1]};background-size:${f[2]};background-position:${f[3]}"><span>${f[0]}</span></div>`).join('');
$('#doc').innerHTML=docs.map(d=>`<div class="panel card"><div class="av">${d[0].replace('dr. ','').split(' ').slice(0,2).map(w=>w[0]).join('')}</div><h3>${d[0]}</h3><p>${d[1]}</p><p style="font-size:.85rem;margin:6px 0 12px">${d[2]}</p><a class="btn sec" style="padding:8px 18px" href="#daftar">Lihat profil</a></div>`).join('');
$('#poli').innerHTML='<option value="">Pilih poli</option>'+polis.map(p=>`<option>${p}</option>`).join('');
const fillDok=()=>{$('#dok').innerHTML='<option value="">Pilih dokter</option>'+docs.filter(d=>d[1]===$('#poli').value).map(d=>`<option>${d[0]}</option>`).join('')};fillDok();$('#poli').onchange=fillDok;
$('#fm').onsubmit=e=>{e.preventDefault();const v=id=>$('#'+id).value.trim(),er={};
 if(v('nama').length<3)er.nama='Isi nama lengkap minimal 3 huruf.';
 if(!/^(08|\+62)\d{8,12}$/.test(v('hp')))er.hp='Gunakan nomor HP, contoh 081234567890.';
 if(!v('poli'))er.poli='Pilih poli.';if(!v('dok'))er.dok='Pilih dokter.';
 if(!v('tgl')||v('tgl')<new Date().toISOString().slice(0,10))er.tgl='Pilih tanggal hari ini atau setelahnya.';
 ['nama','hp','poli','dok','tgl'].forEach(k=>$('#'+k).parentElement.querySelector('.err').textContent=er[k]||'');
 if(Object.keys(er).length)return;
 const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent='Pendaftaran berhasil. Sampai jumpa, '+v('nama')+'!';document.body.append(t);setTimeout(()=>t.remove(),4000);e.target.reset();fillDok()};

// ===== Kamera foto: dikendalikan scroll =====
const lay=[...document.querySelectorAll('.lay')],ov=$('#ov');
const D=[[1024,632],[1600,1200],[678,452],[450,250]],TR=[[0,.8],[.78,.9],[.88,.96],[.94,1]];
const KS=[[[0,.5,.5,1],[.167,.28,.4,1.9],[.333,.62,.3,2],[.5,.35,.82,2.2],[.667,.88,.72,2],[.76,.66,.66,3.4],[.8,.665,.68,4.2]],
[[.78,.5,.55,1.05],[.9,.68,.6,1.6]],[[.88,.3,.55,1.05],[.96,.65,.5,1.5]],[[.94,.3,.55,1.05],[1,.6,.5,1.35]]];
let tp=0,cur=0,mx=0,run=true,dirty=true;const intro={v:1},ss=t=>t*t*(3-2*t),cl=t=>Math.min(1,Math.max(0,t));
function pose(ks,p){p=Math.min(ks[ks.length-1][0],Math.max(ks[0][0],p));let i=0;while(i<ks.length-2&&p>ks[i+1][0])i++;const a=ks[i],b=ks[i+1],t=ss(cl((p-a[0])/(b[0]-a[0])));return[1,2,3].map(j=>a[j]+(b[j]-a[j])*t)}
function draw(){const vw=innerWidth,vh=innerHeight;
 lay.forEach((el,i)=>{const[W,H]=D[i],q=pose(KS[i],cur),k=Math.max(vw/W,vh/H)*q[2]*(i?1:1+.45*intro.v);
  let x=vw/2-q[0]*W*k-mx*14,y=vh/2-q[1]*H*k;x=Math.min(0,Math.max(vw-W*k,x));y=Math.min(0,Math.max(vh-H*k,y));
  el.style.width=W+'px';el.style.height=H+'px';el.style.transform=`translate3d(${x}px,${y}px,0) scale(${k})`;
  el.style.opacity=i?ss(cl((cur-TR[i][0])/.04)):1});
 ov.style.opacity=.7*Math.max(0,1-Math.abs(cur-.8)/.04)}
(function loop(){requestAnimationFrame(loop);if(!run)return;const d=tp-cur;if(Math.abs(d)>1e-5){cur+=d*.07;dirty=true}if(dirty||intro.v>.001){dirty=false;draw()}})();
addEventListener('resize',()=>dirty=true);addEventListener('mousemove',e=>{mx=e.clientX/innerWidth-.5;dirty=true},{passive:true});
document.addEventListener('visibilitychange',()=>run=!document.hidden);
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.create({trigger:'#main',start:'top top',end:'bottom bottom',onUpdate:s=>{tp=s.progress;gsap.set('#bar',{scaleX:s.progress})}});
document.querySelectorAll('.panel,.hero-copy,.ph,.sh').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',toggleActions:'play none none reverse'}}));
document.querySelectorAll('[data-n]').forEach(el=>{const n=+el.dataset.n,o={v:0};gsap.to(o,{v:n,duration:1.8,scrollTrigger:{trigger:el,start:'top 90%'},onUpdate:()=>el.textContent=Math.round(o.v)})});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const t=$(a.getAttribute('href'));t&&window.scrollTo({top:t.offsetTop,behavior:'smooth'})}));
gsap.to('#ld',{opacity:0,delay:1.6,duration:.8,onComplete:()=>{$('#ld').style.display='none';gsap.to(intro,{v:0,duration:3.6,ease:'power3.out',onUpdate:()=>dirty=true})}});
