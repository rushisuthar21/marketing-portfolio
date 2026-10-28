const $=s=>document.querySelectorAll(s),
  menu=document.querySelector('.menu'),links=document.querySelector('.links'),
  still=matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile menu
menu?.addEventListener('click',()=>{
  const open=links.classList.toggle('open');
  menu.setAttribute('aria-expanded',open?'true':'false');
});
$('.links a').forEach(a=>a.addEventListener('click',()=>{
  links.classList.remove('open');
  menu?.setAttribute('aria-expanded','false');
}));

// Scroll progress bar + experience timeline fill
const bar=document.createElement('div');
bar.className='bar';
document.body.prepend(bar);
const list=document.querySelector('.experience-list');
const onScroll=()=>{
  const h=document.documentElement;
  bar.style.setProperty('--p',h.scrollTop/(h.scrollHeight-h.clientHeight||1));
  if(list){
    const r=list.getBoundingClientRect();
    list.style.setProperty('--lp',Math.min(1,Math.max(0,(innerHeight*.6-r.top)/r.height)));
  }
};
addEventListener('scroll',onScroll,{passive:true});
onScroll();

// Count-up numbers
const count=(el,delay=0,dur=1600)=>{
  const m=el.textContent.match(/^(\D*)(\d+)(.*)$/);
  if(!m||still)return;
  const [,pre,num,suf]=m,end=+num;
  el.textContent=pre+0+suf;
  setTimeout(()=>{
    const t0=performance.now();
    const tick=t=>{
      const k=Math.min(1,(t-t0)/dur);
      el.textContent=pre+Math.round(end*(1-Math.pow(1-k,3)))+suf;
      if(k<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },delay);
};
const heroNum=document.querySelector('.g-head b');
if(heroNum)count(heroNum,700,2200);

// Scroll reveals (staggered within each group)
$('.section-intro,.impact-process,.tool-list>div').forEach(x=>x.classList.add('reveal'));
$('.impact-process span').forEach((s,i)=>s.style.setProperty('--i',i));
$('.reveal').forEach(x=>{
  const i=[...x.parentElement.children].indexOf(x);
  x.style.animationDelay=(i%4*.09)+'s';
});
const obs=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('visible');
  e.target.querySelectorAll('.impact-card strong').forEach(s=>count(s,200));
  e.target.querySelectorAll('.study-metrics strong[data-count]').forEach(s=>count(s,200));
  obs.unobserve(e.target);
}),{threshold:.12});
$('.reveal').forEach(x=>obs.observe(x));
$('.impact-card strong').forEach(s=>{s.closest('.reveal')||obs.observe(s)});

// Cursor spotlight on cards
$('.experience-card,.study,.cert-card,.tool-list>div,.impact-card,.recommendation').forEach(c=>{
  c.classList.add('spot');
  c.addEventListener('pointermove',e=>{
    const r=c.getBoundingClientRect();
    c.style.setProperty('--x',e.clientX-r.left+'px');
    c.style.setProperty('--y',e.clientY-r.top+'px');
  });
});

// Hero glow follows the cursor
const hero=document.querySelector('.hero-wrap');
hero?.addEventListener('pointermove',e=>{
  const r=hero.getBoundingClientRect();
  hero.style.setProperty('--mx',e.clientX-r.left+'px');
  hero.style.setProperty('--my',e.clientY-r.top+'px');
});

// Seamless marquee
const track=document.querySelector('.ticker-track');
if(track)track.innerHTML+=track.innerHTML;

// Magnetic buttons
if(matchMedia('(hover:hover)').matches&&!still){
  $('.btn,.contact-actions a').forEach(b=>{
    b.addEventListener('pointermove',e=>{
      const r=b.getBoundingClientRect();
      b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.3}px)`;
    });
    b.addEventListener('pointerleave',()=>b.style.transform='');
  });
}

// 3D card tilt with moving highlight
if(matchMedia('(hover:hover)').matches&&!still){
  $('.tilt,.impact-card,.recommendation,.cert-card').forEach(c=>{
    c.classList.add('tilt');
    c.addEventListener('pointermove',e=>{
      const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      c.classList.add('on');
      c.style.transform=`perspective(900px) rotateX(${(.5-y)*9}deg) rotateY(${(x-.5)*11}deg) translateY(-6px)`;
      c.style.setProperty('--gx',x*100+'%');c.style.setProperty('--gy',y*100+'%');
    });
    c.addEventListener('pointerleave',()=>{c.classList.remove('on');c.style.transform=''});
  });

  // Custom cursor: dot follows instantly, ring trails behind
  const dot=document.createElement('div'),ring=document.createElement('div');
  dot.className='cur-dot';ring.className='cur-ring';
  document.body.append(dot,ring);
  document.body.classList.add('has-cursor');
  let mx=0,my=0,rx=0,ry=0;
  addEventListener('pointermove',e=>{
    mx=e.clientX;my=e.clientY;
    document.body.classList.add('cur-on');
    dot.style.transform=`translate(${mx}px,${my}px)`;
    document.body.classList.toggle('cur-hover',!!e.target.closest('a,button,.tilt'));
  });
  addEventListener('pointerdown',()=>document.body.classList.add('cur-down'));
  addEventListener('pointerup',()=>document.body.classList.remove('cur-down'));
  document.documentElement.addEventListener('pointerleave',()=>document.body.classList.remove('cur-on'));
  (function loop(){
    rx+=(mx-rx)*.16;ry+=(my-ry)*.16;
    ring.style.transform=`translate(${rx}px,${ry}px)`;
    requestAnimationFrame(loop);
  })();
}

// ===== Ad to lead (hero) =====
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const adf=document.querySelector('.adflow');
if(adf){
  const q=s=>adf.querySelector(s),list=q('.crm-list'),cl=q('[data-k=clicks]'),ld=q('[data-k=leads]'),cp=q('[data-k=cpa]'),
    ADS=[['Google Ads','bestbistro.example.com','Best Italian Dinner Near You: Book Tonight','Fresh pasta, open late. Reserve in 30 seconds.','Table request'],
      ['Meta Ads','northreno.example.com','Kitchen Renovation: Free On-site Quote','See before and after projects from your area.','Quote request']],
    NM=['Sara M.','Jon T.','Priya K.','Alex R.','Maya L.','Chris D.'];
  let clicks=0,leads=0;
  const cpa=()=>cp.textContent='$'+Math.max(11,19-leads*.7).toFixed(2);
  const add=(src,what)=>{
    const li=document.createElement('li');
    li.innerHTML=`<span class="av">${NM[leads%6][0]}</span><div><b>${NM[leads%6]}</b><small>${what} · ${src}</small></div><em>New</em>`;
    list.prepend(li);while(list.children.length>3)list.lastChild.remove();
    ld.textContent=leads;cpa();
  };
  (async()=>{
    let round=0;
    do{
      if(round%4===0){clicks=0;leads=0;list.innerHTML='';cl.textContent=0;ld.textContent=0;cp.textContent='$0'}
      const [src,url,t,d,what]=ADS[round++%2];
      q('.ad-src').textContent=src;q('.ad-url').textContent=url;q('.ad-title').textContent=t;q('.ad-desc').textContent=d;
      adf.classList.remove('click');
      if(still){clicks=41;leads=3;cl.textContent=clicks;for(let i=0;i<3;i++){leads=i+1;add(src,what)}break}
      await sleep(900);adf.classList.add('click');
      await sleep(1100);clicks+=7+round;cl.textContent=clicks;
      await sleep(500);leads++;add(src,what);
      await sleep(3600);
    }while(true);
  })();
}

// ===== Sample campaign dashboard (Impact) =====
const dash=document.querySelector('.dash');
if(dash){
  const FMT={pct:v=>v.toFixed(1)+'%',usd:v=>'$'+v.toFixed(2),x:v=>v.toFixed(1)+'x'},
    kpis=[...dash.querySelectorAll('.kpi')].map(k=>({el:k.querySelector('strong'),to:+k.dataset.to,j:+k.dataset.j,f:FMT[k.dataset.fmt],v:0})),
    feed=dash.querySelector('.feed'),
    EV=[['New lead','Google Ads · restaurant campaign'],['Keyword hit page 1','Local SEO · home renovation'],
      ['Budget pacing on track','Meta Ads · retargeting'],['ROAS up 0.4x','This week vs last week'],
      ['12 citations built','Google Business Profile'],['CTR above benchmark','Display campaign']];
  const tween=(k,to,dur)=>{
    const from=k.v,t0=performance.now();
    const step=t=>{const p=Math.min(1,(t-t0)/dur);k.v=from+(to-from)*(1-Math.pow(1-p,3));k.el.textContent=k.f(k.v);if(p<1)requestAnimationFrame(step)};
    requestAnimationFrame(step);
  };
  const add=i=>{
    const [t,s]=EV[i%EV.length],li=document.createElement('li');
    li.innerHTML=`<span class="dot"></span><div><b>${t}</b><small>${s}</small></div>`;
    feed.prepend(li);while(feed.children.length>5)feed.lastChild.remove();
  };
  let started=false;
  new IntersectionObserver((es,o)=>{
    if(!es[0].isIntersecting||started)return;started=true;o.disconnect();
    if(still){kpis.forEach(k=>{k.v=k.to;k.el.textContent=k.f(k.to)});for(let i=3;i>=0;i--)add(i);return}
    kpis.forEach(k=>tween(k,k.to,1800));
    let n=0;add(n++);
    setInterval(()=>add(n++),2400);
    setInterval(()=>kpis.forEach(k=>tween(k,Math.max(0,k.to+(Math.random()*2-1)*k.j),1400)),3200);
  },{threshold:.3}).observe(dash);
}
