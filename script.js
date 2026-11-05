// HOVA EDITZ V3: no artwork files are inserted until the owner approves selections.
const menuButton=document.querySelector('.menu-button');const nav=document.querySelector('.nav');if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'CLOSE −':'MENU +'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='MENU +'}))}document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
// One measured, continuous loop per strip. Both use the same physical speed.
// Hover eases the artwork to a stop, then eases back to its cruising speed.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function continuousStrip(track, {direction=-1, hoverPause=false, speed=32}={}) {
  if (!track) return;
  const original=[...track.children];
  if (!original.length) return;
  original.forEach(item=>{
    const clone=item.cloneNode(true);
    clone.setAttribute('aria-hidden','true');
    clone.querySelectorAll('img').forEach(img=>img.alt='');
    track.appendChild(clone);
  });
  let span=0, position=0, velocity=speed, target=speed, last=0, raf=0;
  function measure() {
    // The distance to the first clone includes the flex gap, avoiding a seam.
    span=track.children[original.length].offsetLeft-track.children[0].offsetLeft;
    if (span) position=((position%span)+span)%span;
  }
  const observer=new ResizeObserver(measure);
  observer.observe(track);
  original.forEach(item=>observer.observe(item));
  window.addEventListener('load',measure,{once:true});
  if (hoverPause) {
    const shell=track.closest('.carousel-shell');
    shell.addEventListener('pointerenter',()=>{target=0});
    shell.addEventListener('pointerleave',()=>{target=speed});
  }
  function frame(now) {
    const dt=last?Math.min((now-last)/1000,.05):0;
    last=now;
    if (!reducedMotion.matches && span>0) {
      velocity+=(target-velocity)*(1-Math.exp(-dt*3.4));
      position=(position+velocity*dt)%span;
      const offset=direction<0?-position:position-span;
      track.style.transform=`translate3d(${offset}px,0,0)`;
    } else if(reducedMotion.matches) {
      track.style.transform='translate3d(0,0,0)';
    }
    raf=requestAnimationFrame(frame);
  }
  measure();
  raf=requestAnimationFrame(frame);
  return ()=>{cancelAnimationFrame(raf);observer.disconnect()};
}
continuousStrip(document.querySelector('#hero-track'),{direction:-1,hoverPause:true,speed:32});
continuousStrip(document.querySelector('.marquee-track'),{direction:1,speed:32});
// Intentional non-submitting preview until a real contact destination is configured.
const form=document.querySelector('#inquiry-form');if(form){form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;document.querySelector('#form-status').textContent='Your inquiry has not been sent. Contact submissions will be enabled before public launch.'})}

// Portfolio image viewer: all images are sourced from the user's supplied exports.
const artworks=[...document.querySelectorAll('.gallery-art')];const lb=document.querySelector('#lightbox');if(lb&&artworks.length){let current=0;const image=lb.querySelector('img');const label=lb.querySelector('.lightbox-label');const show=i=>{current=(i+artworks.length)%artworks.length;image.src=artworks[current].dataset.full;image.alt=artworks[current].dataset.name;label.textContent=`${artworks[current].dataset.name} — ${current+1} / ${artworks.length}`};artworks.forEach((el,i)=>el.addEventListener('click',()=>{show(i);lb.hidden=false;document.body.style.overflow='hidden'}));const close=()=>{lb.hidden=true;document.body.style.overflow='';image.removeAttribute('src')};lb.querySelector('.lightbox-close').addEventListener('click',close);lb.querySelector('.lightbox-prev').addEventListener('click',()=>show(current-1));lb.querySelector('.lightbox-next').addEventListener('click',()=>show(current+1));lb.addEventListener('click',e=>{if(e.target===lb)close()});document.addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(current-1);if(e.key==='ArrowRight')show(current+1)})}
