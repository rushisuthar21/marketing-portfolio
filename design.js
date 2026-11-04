(()=>{
const $1=s=>document.querySelector(s),
  P=n=>`assets/posters/${n}.webp`,          // full size (lightbox)
  S=n=>`assets/posters/sm/${n}.webp`,       // 560px thumbnail (page grid)
  V=n=>`assets/video/${n}`;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,
  lite=!!(navigator.connection&&navigator.connection.saveData),
  hoverable=matchMedia('(hover:hover) and (pointer:fine)').matches;

// Original poster sizes, used so thumbnails reserve their space before loading (no layout jump)
const DIM={'ama-may31':[1131,1600],'ama-oct7':[1131,1600],'dsa-array':[1080,1080],'dsa-linked':[1131,1600],'genai':[1080,1350],'guild':[1131,1600],'hacktober-oct25':[1200,1600],'retro-strawberry':[1080,1440],'retro-mango':[1080,1440],'retro-blueberry':[1080,1440],'vitacoco':[1080,1350]};
const dims=n=>{const [w,h]=DIM[n]||[1080,1440];return `width="560" height="${Math.round(560*h/w)}"`};

// ---- Hero poster fan (the one orchestrated entrance) ----
const FAN=[['dsa-linked',-26,-38,-6,10],['guild',22,-30,7,16],['hacktober-oct25',-10,6,-3,26],['genai',30,22,6,34],['ama-oct7',4,30,2,44]];
$1('.fan').innerHTML=FAN.map(([n,x,y,r,d],i)=>`<img src="${S(n)}" ${dims(n)} alt="" decoding="async" style="--x:${x};--y:${y};--r:${r};--d:${d};--n:${i}">`).join('');
if(hoverable)$1('.studio')?.addEventListener('pointermove',e=>{
  const f=$1('.fan'),b=f.getBoundingClientRect();
  f.style.setProperty('--px',((e.clientX-b.left)/b.width-.5).toFixed(2));
  f.style.setProperty('--py',((e.clientY-b.top)/b.height-.5).toFixed(2));
});

// ---- Poster campaigns ----
// Retro posters carry a third value: the flavour key that drives the interactive section.
const CAMPS=[
 ['Hacktober Fest 2024','Month-long coding event',
  'Neon green on a dark tunnel backdrop reads as “code” from across a hallway, and the cartoon coders keep it welcoming. This edition runs Oct 25 – Nov 22 in a warmer orange palette.',
  [['hacktober-oct25','Hacktober Fest poster, Oct 25 to Nov 22 edition']]],
 ['Ask Me Anything','Open Q&A sessions, May 31 and Oct 7',
  'A casual session gets a casual look: question marks, doodles and a sticky-note date card. The May edition carries Lambton and Cestar co-branding; the October edition uses a warm speckled paper background.',
  [['ama-may31','Ask Me Anything poster, May 31 edition'],['ama-oct7','Ask Me Anything poster, Oct 7 edition']]],
 ['GDG Guild','Community hub',
  'One poster, four ways in: Instagram, LinkedIn, Slack and Facebook, each with its own QR code and a one-line reason to join.',
  [['guild','GDG Guild poster with four QR codes']]],
 ['Speaker series','Arrays, Linked Lists and Generative AI',
  'Three speaker-led talks on one layout: the speaker’s name in the accent colour, then date, time and place with icons, and a QR code in the corner. The accent changes per event so the series is easy to tell apart.',
  [['dsa-array','Data Structures and Algorithms poster: arrays, June 25'],['dsa-linked','Data Structures and Algorithms poster: linked lists, July 15'],['genai','Generative AI talk poster, August 9']]],
 ['Retro Drinkable Yogurt','Product ad concepts, three flavours',
  'One layout, three flavours: the bottle sits at an angle in a milk splash, with fruit and leaves floating around it. The background and headline shadow change colour per flavour (strawberry pink, mango orange, blueberry purple), so the range is easy to tell apart. Designed in Canva. Hover a poster, or pick a flavour, to see the page take on its colour.',
  [['retro-strawberry','Retro Drinkable Yogurt strawberry ad, Thick, Creamy and Delicious','strawberry'],['retro-mango','Retro Drinkable Yogurt mango ad, Thick, Creamy and Delicious','mango'],['retro-blueberry','Retro Drinkable Yogurt blueberry ad, Thick, Creamy and Delicious','blueberry']]],
 ['Vita Coco','Product ad concept',
  'A bright tropical scene for coconut water: two cartons at the centre, palm fronds framing the corners and floating coconuts for movement. A single claim, 100% Pure Coconut, keeps the message quick to read. Designed in Canva.',
  [['vitacoco','Vita Coco coconut water ad, 100% Pure Coconut']]]
];
const FL={strawberry:'Strawberry',mango:'Mango',blueberry:'Blueberry'};
const shot=([n,a,f])=>`<button class="shot"${f?` data-f="${f}"`:''} data-lb="${P(n)}" data-alt="${a}" aria-label="View full size: ${a}"><img src="${S(n)}" ${dims(n)} alt="${a}" loading="lazy" decoding="async"></button>`;
const text=(t,c,p)=>`<span class="category">${c}</span><h3>${t}</h3><p>${p}</p>`;
const retroStage=()=>`
  <div class="flavors" role="group" aria-label="Preview a flavour">${Object.entries(FL).map(([k,v])=>`<button class="chip" data-f="${k}" aria-pressed="false"><i></i>${v}</button>`).join('')}</div>
  <div class="stage" aria-hidden="true">
    <img class="splash" src="assets/retro/splash.webp" width="420" height="302" alt="" loading="lazy" decoding="async">
    <img class="bt" data-f="strawberry" src="assets/retro/bottle-strawberry.webp" width="294" height="760" alt="" loading="lazy" decoding="async">
    <img class="bt" data-f="mango" src="assets/retro/bottle-mango.webp" width="294" height="760" alt="" loading="lazy" decoding="async">
    <img class="bt" data-f="blueberry" src="assets/retro/bottle-blueberry.webp" width="299" height="760" alt="" loading="lazy" decoding="async">
    <img class="fr" data-f="strawberry" src="assets/retro/leaf.webp" width="261" height="360" alt="" loading="lazy" decoding="async">
    <img class="fr" data-f="mango" src="assets/retro/mango-fruit.webp" width="192" height="268" alt="" loading="lazy" decoding="async">
    <img class="fr" data-f="blueberry" src="assets/retro/blueberries.webp" width="498" height="300" alt="" loading="lazy" decoding="async">
  </div>`;
$1('#campaigns').innerHTML=CAMPS.map(([t,c,p,i])=>{
  const retro=i.some(x=>x[2]);
  if(!retro)return `<article class="camp"><div class="camp-text">${text(t,c,p)}</div><div class="camp-art">${i.map(shot).join('')}</div></article>`;
  return `<article class="camp retro" id="retro" data-active=""><div class="retro-glow" aria-hidden="true">${Object.keys(FL).map(k=>`<i data-f="${k}"></i>`).join('')}</div><div class="camp-text">${text(t,c,p)}${retroStage()}</div><div class="camp-art">${i.map(shot).join('')}</div></article>`;
}).join('');

// ---- Flavour-reactive Retro section ----
(()=>{
  const sec=$1('.retro');if(!sec)return;
  const chips=[...sec.querySelectorAll('.chip')],stage=sec.querySelector('.stage');
  let pinned='',raf=0;
  const set=f=>{sec.dataset.active=f;chips.forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.f===f&&f===pinned)))};
  sec.querySelectorAll('.shot[data-f]').forEach(s=>{
    s.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')set(s.dataset.f)});
    s.addEventListener('pointerdown',()=>set(s.dataset.f));   // tap on phones
    s.addEventListener('focus',()=>set(s.dataset.f));         // keyboard
  });
  chips.forEach(c=>c.addEventListener('click',()=>{pinned=pinned===c.dataset.f?'':c.dataset.f;set(pinned)}));
  if(hoverable){
    sec.addEventListener('pointerleave',()=>set(pinned));
    sec.addEventListener('pointermove',e=>{
      if(raf)return;
      raf=requestAnimationFrame(()=>{
        raf=0;const r=sec.getBoundingClientRect();
        sec.style.setProperty('--gx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
        sec.style.setProperty('--gy',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
        if(stage){const b=stage.getBoundingClientRect();
          stage.style.setProperty('--px',Math.max(-1,Math.min(1,(e.clientX-b.left)/b.width-.5)*2).toFixed(2));
          stage.style.setProperty('--py',Math.max(-1,Math.min(1,(e.clientY-b.top)/b.height-.5)*2).toFixed(2));}
      });
    });
  }
})();

// ---- Motion reel ----
// Data Saver or reduced motion: no autoplay, show controls instead so the video can still be played.
const manual=reduce||lite;
const vid=(n,l,c)=>`<figure class="${c}"><video src="${V(n)}.mp4" poster="${V(n)}.jpg" muted loop playsinline preload="none" ${manual?'controls':''} aria-label="${l}"></video><figcaption>${l}</figcaption></figure>`;
$1('#reel').innerHTML=vid('hacktober','Hacktober Fest, Instagram cut','sq')+vid('ama','Ask Me Anything, Instagram cut','sq')+vid('guild','GDG Guild, Instagram cut','sq')+vid('redbull','Red Bull, product ad concept','wide');
// Only play what is on screen; start loading shortly before it arrives.
const io=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;e.isIntersecting?v.play().catch(()=>{}):v.pause()}),{threshold:.5,rootMargin:'120px 0px'});

// ---- IKEA viewer ----
const IK=[['Home','Hero carousel with category captions, then a welcome message and a contact button.'],
 ['Discover','Intro copy, then the shop section with a search box, category dropdown and filter button.'],
 ['Shop','Product grid with name, price, room tag and an Add to Cart button on every card.'],
 ['Log in','Split screen: brand message on the left, email and password form on the right.'],
 ['Register','Sign-up form with name, email, password and address fields.'],
 ['Contact','Contact details beside a message form.'],
 ['Footer','Shop and company links, contact info, social icons and an embedded video.']];
const ikImg=$1('#ikMain img'),ikCap=$1('#ikCap');
const ikSet=i=>{ikImg.src=`assets/ikea/${i+1}.webp`;ikImg.alt=`IKEA clone: ${IK[i][0]} screen`;ikCap.textContent=IK[i][1];
  document.querySelectorAll('#ikTabs button').forEach((b,j)=>b.setAttribute('aria-pressed',j===i))};
$1('#ikTabs').innerHTML=IK.map(([t],i)=>`<button class="tab" data-i="${i}">${t}</button>`).join('');
$1('#ikTabs').addEventListener('click',e=>{const b=e.target.closest('button');if(b)ikSet(+b.dataset.i)});
ikSet(0);
$1('#ikMain').addEventListener('click',()=>openLB([{src:ikImg.src,alt:ikImg.alt}],0));

// ---- Prototypes ----
$1('#protos').innerHTML=[['travel','Travel website','Prototype walkthrough: Tours and Treks tabs, a search bar for destination, dates, members and pick-up, and an International destinations carousel.'],
 ['donut','Donut brand site','Interactive prototype shown in a laptop mockup, with flavour-led screens on matching colour backgrounds (Green Apple shown).']]
 .map(([n,t,c])=>`<figure><video src="${V(n)}.mp4" poster="${V(n)}.jpg" controls muted loop playsinline preload="none" aria-label="${t} prototype walkthrough"></video><figcaption><b>${t}</b>${c}</figcaption></figure>`).join('');

document.querySelectorAll('#protos video').forEach(v=>io.observe(v));
if(!manual)document.querySelectorAll('#reel video').forEach(v=>io.observe(v));

// ---- Lightbox ----
const lb=$1('#lb'),lbImg=lb.querySelector('img'),lbCap=lb.querySelector('figcaption');
let list=[],idx=0,opener=null;
function show(){const o=list[idx];lbImg.src=o.src;lbImg.alt=o.alt;lbCap.textContent=o.alt;lb.classList.toggle('single',list.length<2)}
function openLB(l,i){list=l;idx=i;opener=document.activeElement;show();lb.hidden=false;lb.classList.add('open');document.documentElement.classList.add('lb-open');lb.querySelector('.lb-x').focus()}
function closeLB(){lb.hidden=true;lb.classList.remove('open');document.documentElement.classList.remove('lb-open');opener?.focus()}
const step=d=>{idx=(idx+d+list.length)%list.length;show()};
document.addEventListener('click',e=>{
  const s=e.target.closest('.camp .shot');
  if(s){const all=[...document.querySelectorAll('.camp .shot')];openLB(all.map(b=>({src:b.dataset.lb,alt:b.dataset.alt})),all.indexOf(s));return}
  if(e.target.closest('.lb-x')||e.target===lb)closeLB();
  else if(e.target.closest('.lb-p'))step(-1);
  else if(e.target.closest('.lb-n'))step(1);
});
document.addEventListener('keydown',e=>{
  if(lb.hidden)return;
  if(e.key==='Escape')closeLB();
  else if(e.key==='ArrowLeft'&&list.length>1)step(-1);
  else if(e.key==='ArrowRight'&&list.length>1)step(1);
  else if(e.key==='Tab'){const f=[...lb.querySelectorAll('button')].filter(b=>b.offsetParent);if(!f.length)return;const a=f.indexOf(document.activeElement);e.preventDefault();f[(a+(e.shiftKey?-1:1)+f.length)%f.length].focus()}
});
// Swipe left/right on phones
let tx=0;
lb.addEventListener('touchstart',e=>{tx=e.changedTouches[0].clientX},{passive:true});
lb.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50&&list.length>1)step(dx<0?1:-1)},{passive:true});
})();
