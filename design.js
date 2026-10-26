const $1=s=>document.querySelector(s),P=n=>`assets/posters/${n}.webp`,V=n=>`assets/video/${n}`;

// ---- Hero poster fan (the one orchestrated entrance) ----
const FAN=[['dsa-linked',-26,-38,-6,10],['guild',22,-30,7,16],['hacktober-oct8',-10,6,-3,26],['genai',30,22,6,34],['ama-oct7',4,30,2,44]];
$1('.fan').innerHTML=FAN.map(([n,x,y,r,d],i)=>`<img src="${P(n)}" alt="" style="--x:${x};--y:${y};--r:${r};--d:${d};--n:${i}">`).join('');
$1('.studio')?.addEventListener('pointermove',e=>{
  const f=$1('.fan'),b=f.getBoundingClientRect();
  f.style.setProperty('--px',((e.clientX-b.left)/b.width-.5).toFixed(2));
  f.style.setProperty('--py',((e.clientY-b.top)/b.height-.5).toFixed(2));
});

// ---- Poster campaigns ----
const CAMPS=[
 ['Hacktober Fest 2024','Month-long coding event',
  'Neon green on a dark tunnel backdrop reads as “code” from across a hallway, and the cartoon coders keep it welcoming. Re-issued with new dates (Oct 25 – Nov 22) in a warmer orange palette.',
  [['hacktober-oct8','Hacktober Fest poster, Oct 8 to 31 edition'],['hacktober-oct25','Hacktober Fest poster, Oct 25 to Nov 22 edition']]],
 ['Ask Me Anything','Open Q&A sessions, May 31 and Oct 7',
  'A casual session gets a casual look: question marks, doodles and a sticky-note date card. The May edition carries Lambton and Cestar co-branding; the October edition uses a warm speckled paper background.',
  [['ama-may31','Ask Me Anything poster, May 31 edition'],['ama-oct7','Ask Me Anything poster, Oct 7 edition']]],
 ['GDG Guild','Community hub',
  'One poster, four ways in: Instagram, LinkedIn, Slack and Facebook, each with its own QR code and a one-line reason to join.',
  [['guild','GDG Guild poster with four QR codes']]],
 ['Speaker series','Arrays, Linked Lists and Generative AI',
  'Three speaker-led talks on one layout: the speaker’s name in the accent colour, then date, time and place with icons, and a QR code in the corner. The accent changes per event so the series is easy to tell apart.',
  [['dsa-array','Data Structures and Algorithms poster: arrays, June 25'],['dsa-linked','Data Structures and Algorithms poster: linked lists, July 15'],['genai','Generative AI talk poster, August 9']]]
];
$1('#campaigns').innerHTML=CAMPS.map(([t,c,p,i])=>`<article class="camp"><div class="camp-text"><span class="category">${c}</span><h3>${t}</h3><p>${p}</p></div><div class="camp-art">${i.map(([n,a])=>`<button class="shot" data-lb="${P(n)}" data-alt="${a}" aria-label="View full size: ${a}"><img src="${P(n)}" alt="${a}" loading="lazy"></button>`).join('')}</div></article>`).join('');

// ---- Motion reel ----
const vid=(n,l,c,x='')=>`<figure class="${c}"><video src="${V(n)}.mp4" poster="${V(n)}.jpg" muted loop playsinline preload="none" ${x} aria-label="${l}"></video><figcaption>${l}</figcaption></figure>`;
$1('#reel').innerHTML=vid('hacktober','Hacktober Fest, Instagram cut','sq')+vid('ama','Ask Me Anything, Instagram cut','sq')+vid('guild','GDG Guild, Instagram cut','sq')+vid('redbull','Red Bull, product ad concept','wide');
const io=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;e.isIntersecting?v.play().catch(()=>{}):v.pause()}),{threshold:.5});
document.querySelectorAll('#reel video').forEach(v=>io.observe(v));

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
 .map(([n,t,c])=>`<figure><video src="${V(n)}.mp4" poster="${V(n)}.jpg" controls playsinline preload="none" aria-label="${t} prototype walkthrough"></video><figcaption><b>${t}</b>${c}</figcaption></figure>`).join('');

// ---- Lightbox ----
const lb=$1('#lb'),lbImg=lb.querySelector('img'),lbCap=lb.querySelector('figcaption');
let list=[],idx=0,opener=null;
function show(){const o=list[idx];lbImg.src=o.src;lbImg.alt=o.alt;lbCap.textContent=o.alt;lb.classList.toggle('single',list.length<2)}
function openLB(l,i){list=l;idx=i;opener=document.activeElement;show();lb.hidden=false;lb.classList.add('open');lb.querySelector('.lb-x').focus()}
function closeLB(){lb.hidden=true;lb.classList.remove('open');opener?.focus()}
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
