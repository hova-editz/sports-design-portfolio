// HOVA EDITZ V3: no artwork files are inserted until the owner approves selections.
const menuButton=document.querySelector('.menu-button');const nav=document.querySelector('.nav');if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'CLOSE −':'MENU +'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='MENU +'}))}document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
// Continuous, measured marquee and artwork strips. The entire repeat width
// includes the gap; no CSS keyframe reset or hover-induced stop.
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
function continuousStrip(track,{direction=-1,speed=32,hoverRatio=1}={}) {
  if(!track || !track.children.length) return;
  const originals=[...track.children];
  const shell=track.parentElement;
  let span=0,position=0,last=0;
  function fill() {
    track.querySelectorAll('[data-loop-clone]').forEach(el=>el.remove());
    const first=originals[0];
    // Append a COMPLETE duplicate sequence before measuring its repeat distance.
    let firstClone;
    originals.forEach((el,i)=>{const clone=el.cloneNode(true);clone.dataset.loopClone='';clone.setAttribute('aria-hidden','true');clone.querySelectorAll('img').forEach(img=>img.alt='');track.appendChild(clone);if(i===0)firstClone=clone});
    span=firstClone.offsetLeft-first.offsetLeft;
    if(span<=0)return;
    const required=Math.ceil((shell.clientWidth+span)/span)+1;
    for(let i=1;i<required;i++){
      originals.forEach(el=>{const clone=el.cloneNode(true);clone.dataset.loopClone='';clone.setAttribute('aria-hidden','true');clone.querySelectorAll('img').forEach(img=>img.alt='');track.appendChild(clone)});
    }
    position=((position%span)+span)%span;
  }
  const observer=new ResizeObserver(fill);
  observer.observe(shell);originals.forEach(el=>observer.observe(el));
  window.addEventListener('load',fill,{once:true});

  function frame(now){
    const dt=last?Math.min((now-last)/1000,.12):0;last=now;
    if(!reducedMotion.matches && span>0){
      position=(position+speed*dt)%span;
      track.style.transform=`translate3d(${direction<0?-position:position-span}px,0,0)`;
    } else if(reducedMotion.matches)track.style.transform='translate3d(0,0,0)';
    requestAnimationFrame(frame);
  }
  fill();requestAnimationFrame(frame);
}
continuousStrip(document.querySelector('#hero-track'),{direction:-1,speed:32});
continuousStrip(document.querySelector('.marquee-track'),{direction:1,speed:25});

// V4.1: stable, geometry-independent hover selection for overlapping artwork.
// The active card cannot steal the pointer and cause another card to activate.
// Horizontal zones have hysteresis and a deliberate dwell before switching.
document.querySelectorAll('.stack-gallery').forEach(gallery=>{
  const cards=[...gallery.querySelectorAll('.collage-piece')];
  const link=gallery.closest('.collection-card')?.querySelector('.collection-title-link');
  let active=-1, pending=-1, timer=0;
  const cutoffs=[.19,.36,.64,.81];
  const zone=x=>cutoffs.findIndex(v=>x<v)===-1?4:cutoffs.findIndex(v=>x<v);
  function schedule(index){
    if(index===active||index===pending)return;
    clearTimeout(timer);pending=index;
    timer=setTimeout(()=>{active=index;pending=-1;gallery.dataset.active=String(index+1)},230);
  }
  gallery.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch')return;
    const r=gallery.getBoundingClientRect();
    const x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
    let next=zone(x);
    // Keep the current selection around zone boundaries to prevent chatter.
    if(active>=0){const low=active===0?0:cutoffs[active-1],high=active===4?1:cutoffs[active];
      if(x>=low-.025&&x<=high+.025)next=active;}
    schedule(next);
  });
  gallery.addEventListener('pointerleave',()=>{clearTimeout(timer);pending=-1;active=-1;delete gallery.dataset.active});
  gallery.addEventListener('click',()=>link?.click());
  cards.forEach(card=>{card.removeAttribute('role');card.removeAttribute('tabindex');card.removeAttribute('aria-label')});
});
// Intentional non-submitting preview until a real contact destination is configured.
const form=document.querySelector('#inquiry-form');if(form){form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;document.querySelector('#form-status').textContent='Your inquiry has not been sent. Contact submissions will be enabled before public launch.'})}

// Portfolio image viewer: all images are sourced from the user's supplied exports.
const artworks=[...document.querySelectorAll('.gallery-art')];const lb=document.querySelector('#lightbox');if(lb&&artworks.length){let current=0;const image=lb.querySelector('img');const label=lb.querySelector('.lightbox-label');const show=i=>{current=(i+artworks.length)%artworks.length;image.src=artworks[current].dataset.full;image.alt=artworks[current].dataset.name;label.textContent=`${artworks[current].dataset.name} — ${current+1} / ${artworks.length}`};artworks.forEach((el,i)=>el.addEventListener('click',()=>{show(i);lb.hidden=false;document.body.style.overflow='hidden'}));const close=()=>{lb.hidden=true;document.body.style.overflow='';image.removeAttribute('src')};lb.querySelector('.lightbox-close').addEventListener('click',close);lb.querySelector('.lightbox-prev').addEventListener('click',()=>show(current-1));lb.querySelector('.lightbox-next').addEventListener('click',()=>show(current+1));lb.addEventListener('click',e=>{if(e.target===lb)close()});document.addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(current-1);if(e.key==='ArrowRight')show(current+1)})}

// V3.9 — individual glyph fitting, rather than loosening the entire heading.
// Each letter is positioned relative to the preceding glyph. Original text remains
// available to screen readers through the accessible heading label.
(function fitDisplayType(){
  const pair={
    'DE':-.064,'ES':-.055,'SI':-.044,'IG':-.052,'GN':-.071,
    'FO':-.058,'OR':-.066,'TH':-.052,'HE':-.085,'MO':-.060,
    'OM':-.057,'ME':-.061,'EN':-.058,'NT':-.052,
    'BU':-.047,'UI':-.052,'IL':-.047,'LT':-.052,
    'GA':-.072,'AM':-.069,'WO':-.075,'RK':-.057,
    'CL':-.045,'LI':-.052,'IE':-.052,'EW':-.076,
    'PE':-.052,'ER':-.060,'RS':-.049,'SO':-.054,
    'ON':-.056,'NA':-.066,'AL':-.060,'PR':-.065,
    'RO':-.061,'OJ':-.044,'JE':-.050,'EC':-.057,'CT':-.050,'TS':-.035,
    'ID':-.053,'DA':-.070,'AN':-.055
  };
  document.querySelectorAll('.hero h1,.section-heading h2,.contact h2,.collection-title-link h3').forEach(heading=>{
    if(heading.dataset.opticalFitted)return;
    heading.dataset.opticalFitted='true';
    const full=heading.textContent.trim();
    heading.setAttribute('aria-label',full);
    const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      if(node.parentElement?.classList.contains('dot'))return;
      const frag=document.createDocumentFragment();let prev='';
      for(const ch of node.nodeValue){
        if(/\s/.test(ch)){const sp=document.createElement('span');sp.className='optical-space';sp.textContent=ch;sp.setAttribute('aria-hidden','true');frag.appendChild(sp);prev='';continue;}
        const el=document.createElement('span');el.className='optical-glyph'+(!prev?' first':'');
        el.textContent=ch;el.setAttribute('aria-hidden','true');
        if(prev)el.style.setProperty('--kern',(pair[prev+ch]??-.052)+'em');
        frag.appendChild(el);prev=ch;
      }
      node.replaceWith(frag);
    });
  });
})();
