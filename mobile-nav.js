/* V6.41 - Mobile footer avoidance for Safari and embedded iOS browsers. */
(() => {
  function init() {
    const nav = document.querySelector('.nav-bubble');
    const footer = document.querySelector('footer.footer');
    if (!nav || !footer) return;
    const mq = matchMedia('(max-width: 700px)');
    let scheduled = false;
    function update() {
      scheduled = false;
      if (!mq.matches) {
        nav.style.removeProperty('bottom');
        nav.style.removeProperty('transform');
        return;
      }
      // Both rectangles use layout viewport coordinates, avoiding mixed
      // visualViewport/layout viewport measurements in embedded browsers.
      const footerTop = footer.getBoundingClientRect().top;
      const viewportBottom = document.documentElement.clientHeight;
      const baseBottom = 17;
      const gap = 14;
      const lift = Math.max(0, viewportBottom - footerTop - baseBottom + gap);
      nav.style.bottom = baseBottom + 'px';
      nav.style.transform = `translate3d(-50%, ${-Math.round(lift)}px, 0)`;
    }
    function schedule() {
      if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
    }
    ['scroll','resize','pageshow','orientationchange'].forEach(type => window.addEventListener(type, schedule, {passive:true}));
    document.addEventListener('touchmove', schedule, {passive:true});
    document.addEventListener('touchend', schedule, {passive:true});
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', schedule, {passive:true});
      window.visualViewport.addEventListener('scroll', schedule, {passive:true});
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(schedule, {threshold:[0,.01,.25,.5,1]}).observe(footer);
    // Embedded browsers may animate their chrome without dispatching page
    // scroll events; refresh geometry while the footer is near the viewport.
    let previousTop = Infinity;
    function monitor() {
      if (!mq.matches) { previousTop = Infinity; requestAnimationFrame(monitor); return; }
      const top = footer.getBoundingClientRect().top;
      if (top !== previousTop || top < document.documentElement.clientHeight + 180) schedule();
      previousTop = top;
      requestAnimationFrame(monitor);
    }
    monitor();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
