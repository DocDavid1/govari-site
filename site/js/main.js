(function(){
  'use strict';
  document.querySelectorAll('#year').forEach(function(el){el.textContent=new Date().getFullYear();});
  var header=document.querySelector('.site-header');
  function updateHeader(){ if(header) header.classList.toggle('scrolled', window.scrollY>18); }
  updateHeader(); window.addEventListener('scroll', updateHeader, {passive:true});
  var burger=document.querySelector('.burger');
  if(burger&&header){burger.setAttribute('aria-expanded','false');burger.addEventListener('click',function(){var open=header.classList.toggle('mobile-open');burger.setAttribute('aria-expanded',open?'true':'false');});}
  document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href');if(id.length<2)return;var target=document.querySelector(id);if(!target)return;e.preventDefault();target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){entries.forEach(function(entry){var video=entry.target;var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;var save=navigator.connection&&navigator.connection.saveData;if(entry.isIntersecting&&!reduce&&!save&&video.dataset.userPaused!=='true') video.play().catch(function(){}); else video.pause();});},{threshold:.35});
    document.querySelectorAll('video[data-inview]').forEach(function(v){io.observe(v);});
  }

  function initTheme(){
    var root=document.documentElement;
    var saved=null; try{saved=localStorage.getItem('gav-theme');}catch(_){ }
    if(saved==='light'||saved==='dark') root.setAttribute('data-theme',saved);
    function isLight(){return root.getAttribute('data-theme')==='light'||(!root.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme: light)').matches);}
    function sync(){document.querySelectorAll('.theme-toggle').forEach(function(btn){var light=isLight();btn.setAttribute('aria-pressed',light?'true':'false');btn.setAttribute('aria-label',light?'מעבר למצב לילה':'מעבר למצב יום');});}
    document.querySelectorAll('.theme-toggle').forEach(function(btn){btn.addEventListener('click',function(){var next=isLight()?'dark':'light';root.setAttribute('data-theme',next);try{localStorage.setItem('gav-theme',next);}catch(_){ }sync();});});
    sync();
  }
  initTheme();
  function initLeadModal(){
    var modal=document.querySelector('[data-lead-modal]'); if(!modal) return;
    var card=modal.querySelector('.lead-orbit__card'); var closes=modal.querySelectorAll('[data-lead-modal-close]');
    var key='govari:lead-modal:v2'; var shown=0; try{shown=Number(sessionStorage.getItem(key)||0)||0;}catch(_){ }
    var opened=false; var max=1;
    function open(){ if(opened||shown>=max||location.hash==='#lead') return; opened=true; shown+=1; try{sessionStorage.setItem(key,String(shown));}catch(_){ } modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); setTimeout(function(){ if(card) card.focus(); },30); if(window.govariTrack) try{window.govariTrack('lead_modal_view',{count:shown});}catch(_){ }}
    function close(){ opened=false; modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); }
    closes.forEach(function(el){el.addEventListener('click',close);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&opened) close();});
    var scrollArmed=false;
    window.addEventListener('scroll',function(){ if(scrollArmed) return; if(window.scrollY>Math.max(760,innerHeight*.9)){scrollArmed=true; setTimeout(open,650);} },{passive:true});
    document.addEventListener('mouseleave',function(e){ if(e.clientY<=0) open(); });
    try{ if(new URLSearchParams(location.search).get('modaltest')==='1') setTimeout(open,300); }catch(_){ }
  }
  initLeadModal();

  document.querySelectorAll('[data-video-toggle]').forEach(function(button){var video=document.getElementById(button.dataset.videoToggle);if(!video)return;function label(){button.textContent=video.paused?'הפעלת הסרטון':'השהיית הסרטון';}button.addEventListener('click',function(){if(video.paused){video.dataset.userPaused='false';video.play().catch(function(){});}else{video.dataset.userPaused='true';video.pause();}label();});video.addEventListener('play',label);video.addEventListener('pause',label);label();});
})();
