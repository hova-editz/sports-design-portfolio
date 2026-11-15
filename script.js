
(async function(){
  const track=document.querySelector('.feature-track');
  if(!track)return;
  // Randomize the ten featured works once per page load, keeping the
  // large slides, pagination dots and thumbnail buttons in the same order.
  const initialSlides=[...track.querySelectorAll('.feature-slide')];
  const initialDots=[...document.querySelectorAll('[data-dot]')];
  const initialThumbs=[...document.querySelectorAll('[data-feature]')];
  const order=initialSlides.map((_,i)=>i);
  for(let i=order.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [order[i],order[j]]=[order[j],order[i]];
  }
  // Avoid repeating the original authored sequence in the unlikely event
  // the random shuffle happens to return it unchanged.
  if(order.length>1 && order.every((value,i)=>value===i)){
    [order[0],order[1]]=[order[1],order[0]];
  }
  const dotContainer=document.querySelector('.feature-dots');
  const thumbContainer=document.querySelector('.featured-thumbnails');
  order.forEach((oldIndex,newIndex)=>{
    const slide=initialSlides[oldIndex],dot=initialDots[oldIndex],thumb=initialThumbs[oldIndex];
    slide.dataset.slide=String(newIndex);
    dot.dataset.dot=String(newIndex);
    thumb.dataset.feature=String(newIndex);
    track.append(slide);
    dotContainer.append(dot);
    thumbContainer.append(thumb);
  });
  const slides=[...track.querySelectorAll('.feature-slide')];
  let active=0, art=[],lightIndex=0;
  const $=id=>document.getElementById(id);
  // Seamless directional carousel: clones permit continued forward/backward motion.
  const count=slides.length;
  const before=slides[count-1].cloneNode(true),after=slides[0].cloneNode(true);
  before.removeAttribute('data-slide');after.removeAttribute('data-slide');
  track.prepend(before);track.append(after);
  let position=1, transitioning=false;
  function renderSelection(){
    slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===active);slide.setAttribute('aria-hidden',String(i!==active))});
    $('slide-number').textContent=String(active+1).padStart(2,'0');
    document.querySelectorAll('[data-dot]').forEach(b=>{const yes=Number(b.dataset.dot)===active;b.classList.toggle('active',yes);b.setAttribute('aria-current',String(yes))});
    document.querySelectorAll('[data-feature]').forEach(b=>{const yes=Number(b.dataset.feature)===active;b.classList.toggle('selected',yes);if(yes){const shelf=b.parentElement;shelf.scrollTo({left:Math.max(0,b.offsetLeft-shelf.offsetLeft-shelf.clientWidth/2+b.clientWidth/2),behavior:'smooth'})}});
  }
  function setPosition(animate=true){
    track.style.transition=animate?'transform .8s cubic-bezier(.22,1,.36,1)':'none';
    track.style.transform=`translateX(${-position*100}%)`;
    if(!animate){void track.offsetWidth;track.style.transition='transform .8s cubic-bezier(.22,1,.36,1)'}
  }
  function step(direction){if(transitioning)return;transitioning=true;active=(active+direction+count)%count;position+=direction;renderSelection();setPosition()}
  track.addEventListener('transitionend',e=>{
    if(e.target!==track||e.propertyName!=='transform')return;
    if(position===count+1){position=1;setPosition(false)}
    else if(position===0){position=count;setPosition(false)}
    transitioning=false;
  });
  function jump(index){if(transitioning||index===active)return;const forward=(index-active+count)%count;const backward=(active-index+count)%count;
    if(Math.min(forward,backward)===1){step(forward===1?1:-1);return}
    active=index;position=index+1;renderSelection();setPosition(false);
  }
  $('next').addEventListener('click',()=>step(1));
  $('prev').addEventListener('click',()=>step(-1));
  document.querySelectorAll('[data-dot]').forEach(b=>b.addEventListener('click',()=>jump(Number(b.dataset.dot))));
  document.querySelectorAll('[data-feature]').forEach(b=>b.addEventListener('click',()=>{jump(Number(b.dataset.feature));document.getElementById('featured-work')?.scrollIntoView({behavior:'smooth',block:'start'})}));
  renderSelection();setPosition(false);
  const data={"collections":{"client-2026":[["assets/art/new-visit-copy.jpg","new visit copy"],["assets/art/concordia-gameday-2026.jpg","Concordia Gameday 2026"],["assets/art/captain-spotlight-2026.jpg","Captain Spotlight 2026"],["assets/art/halloween-gameweek-2026.png","Halloween Gameweek 2026"],["assets/art/sju-gameday-2026.jpg","SJU Gameday 2026"],["assets/art/good-luck-2026.jpg","Good Luck 2026"],["assets/art/bethel-gameday-graphic-copy.jpg","bethel gameday graphic copy"],["assets/art/bucket-history-2026.jpg","Bucket History 2026"],["assets/art/bethel-gameweek-copy.jpg","bethel gameweek copy"],["assets/art/homecoming-gameweek-2026.jpg","homecoming gameweek 2026"],["assets/art/crown-gameweek-2026.jpg","Crown Gameweek 2026"],["assets/art/olaf-gameweek-2026.png","Olaf Gameweek 2026"],["assets/art/crown-gameday-2026.jpg","Crown Gameday 2026"],["assets/art/bethel-gameday-copy.jpg","bethel gameday copy"],["assets/art/carleton-gameday-2026.png","Carleton Gameday 2026"],["assets/art/winter-visit-copy.jpg","winter visit copy"],["assets/art/concordia-gameweek-2026.jpg","Concordia Gameweek 2026"],["assets/art/halloween-gameday-2026.jpg","halloween gameday 2026"],["assets/art/carleton-gameweek-2026.jpg","Carleton Gameweek 2026"],["assets/art/sju-gameweek-2026.jpg","SJU Gameweek 2026"],["assets/art/committed-graphic-2026.jpg","Committed Graphic 2026"],["assets/art/homecoming-gameday-2026.jpg","homecoming gameday 2026"],["assets/art/gustavus-gameweek-2026.png","Gustavus Gameweek 2026"],["assets/art/gustavus-gameday-2026.png","gustavus gameday 2026"],["assets/art/hammer week.png","Hammer Week 2026"],["assets/art/st olaf gameday 2026.png","St. Olaf Gameday 2026"],["assets/art/hammer-week-v6.png","Hammer Week"],["assets/art/augsburg-gameday-v6.jpg","Augsburg Gameday"]],"client-2025":[["assets/art/gustavus-gameweek-2025.jpg","Gustavus Gameweek 2025"],["assets/art/augsburg-gameday-2025.jpg","Augsburg Gameday 2025"],["assets/art/halloween-gameweek-2025.jpg","Halloween Gameweek 2025"],["assets/art/carleton-gameday-2025.jpg","Carleton Gameday 2025"],["assets/art/augsburg-gameweek-2025.jpg","Augsburg Gameweek 2025"],["assets/art/halloween-gameday-2025.jpg","Halloween Gameday 2025"],["assets/art/carleton-gameweek-2025.jpg","Carleton Gameweek 2025"],["assets/art/olaf-gameday-2025.jpg","Olaf Gameday 2025"],["assets/art/gustavus-gameday-2025.jpg","gustavus gameday 2025"]],"sport-basketball":[["assets/art/kyrie-irving.png","Kyrie Irving"],["assets/art/brunson-copy-2.jpg","brunson copy 2"],["assets/art/final-decision-lebron.jpg","Final Decision Lebron"],["assets/art/kobe-bryant.jpg","Kobe Bryant"],["assets/art/jordan-poster.jpg","Jordan Poster"],["assets/art/allen-iverson.jpg","Allen Iverson"]],"sport-football":[["assets/art/ps2.jpg","PS2"],["assets/art/jeremiah-smith.jpg","Jeremiah Smith"],["assets/art/lamar-jackson.jpg","Lamar Jackson"],["assets/art/jsn.jpg","JSN"],["assets/art/ceedee-v6.png","CeeDee"],["assets/art/jamarr-v6.png","Ja'Marr"]],"sport-baseball":[["assets/art/shohei-ohtani.jpg","Shohei Ohtani"]],"sport-motorsport":[["assets/art/hamilton-1-copy.jpg","hamilton 1 copy"]],"sport-soccer":[["assets/art/wc-final.jpg","WC Final"],["assets/art/jose-quinones.jpg","Jose Quinones"]]},"covers":{"client-2026":["Hamline Football","2026","assets/art/hammer-week-v6.png"],"client-2025":["Hamline Football","2025","assets/art/gustavus-gameweek-2025.jpg"],"sport-basketball":["Basketball","Personal projects","assets/art/kyrie-irving.png"],"sport-football":["Football","Personal projects","assets/art/ceedee-v6.png"],"sport-baseball":["Baseball","Personal projects","assets/art/shohei-ohtani.jpg"],"sport-motorsport":["Motorsport","Personal projects","assets/art/hamilton-1-copy.jpg"],"sport-soccer":["Soccer","Personal projects","assets/art/wc-final.jpg"]},"featured":["assets/art/final-decision-lebron.jpg", "assets/art/jamarr-v6.png", "assets/art/kyrie-irving.png", "assets/art/ceedee-v6.png", "assets/art/jordan-poster.jpg", "assets/art/halloween-gameweek-2026.png", "assets/art/bucket-history-2026.jpg", "assets/art/homecoming-gameweek-2026.jpg", "assets/art/sju-gameday-2026.jpg", "assets/art/st olaf gameday 2026.png"]};
  const collections=$('collections'),detail=$('collection-view'),feature=document.querySelector('.feature-section');
  function openCollection(key){
    const items=data.collections[key];if(!items)return;
    art=items;const meta=data.covers[key];
    $('collection-title').textContent=meta[0];
    $('collection-subtitle').textContent=key.startsWith('client-')?`${meta[1]} · Graphic design internship`:'';
    $('art-grid').replaceChildren();
    items.forEach(([src,label],i)=>{
      const btn=document.createElement('button');btn.className='art-tile';btn.type='button';btn.setAttribute('aria-label',`View ${label}`);
      const img=document.createElement('img');img.src=src;img.alt=label;img.loading='lazy';btn.append(img);btn.addEventListener('click',()=>showLightbox(i));$('art-grid').append(btn);
    });
    collections.hidden=true;feature.hidden=true;detail.hidden=false;
    history.replaceState(null,'','#'+key);requestAnimationFrame(()=>{detail.scrollIntoView({behavior:'instant',block:'start'});updatePortfolioActive()});
  }
  function back(){detail.hidden=true;collections.hidden=false;feature.hidden=false;history.replaceState(null,'',location.pathname);requestAnimationFrame(()=>{document.getElementById('collections')?.scrollIntoView({behavior:'instant',block:'start'});updatePortfolioActive()});renderSelection()}
  document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openCollection(b.dataset.open)));
  $('back-to-collections').addEventListener('click',back);
  const portfolioLink=document.querySelector('.nav-portfolio');
  const featuredTarget=document.getElementById('featured-work');
  // Portfolio navigation always leads to the actual artwork, never the intro.
  portfolioLink?.addEventListener('click',e=>{
    e.preventDefault();
    if(!detail.hidden){detail.hidden=true;collections.hidden=false;feature.hidden=false;renderSelection()}
    history.replaceState(null,'',location.pathname+'#featured-work');
    requestAnimationFrame(()=>featuredTarget?.scrollIntoView({behavior:'smooth',block:'start'}));
  });
  // Highlight Portfolio only when its content is in view; never on initial intro.
  function updatePortfolioActive(){
    if(!portfolioLink || !featuredTarget)return;
    const viewportHeight=window.innerHeight;
    const rect=featuredTarget.getBoundingClientRect();
    const collectionRect=collections.getBoundingClientRect();
    const visiblePortfolio=!detail.hidden || (rect.top < viewportHeight*.65 && collectionRect.bottom > viewportHeight*.3);
    portfolioLink.classList.toggle('is-current',visiblePortfolio);
    if(visiblePortfolio)portfolioLink.setAttribute('aria-current','page');
    else portfolioLink.removeAttribute('aria-current');
  }
  window.addEventListener('scroll',updatePortfolioActive,{passive:true});
  window.addEventListener('resize',updatePortfolioActive);
  requestAnimationFrame(updatePortfolioActive);
  function showLightbox(i){lightIndex=(i+art.length)%art.length;$('lightbox-image').src=art[lightIndex][0];$('lightbox-image').alt=art[lightIndex][1];$('lightbox').hidden=false;document.body.style.overflow='hidden'}
  function closeLightbox(){$('lightbox').hidden=true;document.body.style.overflow=''}
  $('lightbox-close').addEventListener('click',closeLightbox);
  $('lightbox-prev').addEventListener('click',()=>showLightbox(lightIndex-1));
  $('lightbox-next').addEventListener('click',()=>showLightbox(lightIndex+1));
  $('lightbox').addEventListener('click',e=>{if(e.target===$('lightbox'))closeLightbox()});
  document.addEventListener('keydown',e=>{if(!$('lightbox').hidden){if(e.key==='Escape')closeLightbox();if(e.key==='ArrowRight')showLightbox(lightIndex+1);if(e.key==='ArrowLeft')showLightbox(lightIndex-1)}else if(!detail.hidden&&e.key==='Escape')back();else if(e.key==='ArrowRight')$('next').click();else if(e.key==='ArrowLeft')$('prev').click()});
  if(location.hash&&data.collections[location.hash.slice(1)])openCollection(location.hash.slice(1));
  else if(location.hash==='#featured-work')requestAnimationFrame(()=>document.getElementById('featured-work')?.scrollIntoView({behavior:'instant'}));
})();

(function(){
  const cursor=document.querySelector('.custom-cursor');
  if(!cursor || !window.matchMedia('(hover:hover) and (pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.documentElement.classList.add('has-custom-cursor');
  let x=-100,y=-100,cx=-100,cy=-100;
  function animate(){cx+=(x-cx)*.36;cy+=(y-cy)*.36;cursor.style.transform=`translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`;requestAnimationFrame(animate)}
  document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;x=e.clientX;y=e.clientY;cursor.classList.add('visible');const target=e.target.closest('button,a');cursor.classList.toggle('on-control',!!target);cursor.classList.toggle('on-project',!!e.target.closest('.project-card,.art-tile,.featured-thumb,.hero-arrow,.feature-dot,.nav-bubble a'))});
  document.addEventListener('pointerleave',()=>cursor.classList.remove('visible'));
  document.addEventListener('pointerdown',()=>cursor.classList.add('pressed'));
  document.addEventListener('pointerup',()=>cursor.classList.remove('pressed'));
  requestAnimationFrame(animate);
})();
