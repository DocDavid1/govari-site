(function(){'use strict';
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const story=document.querySelector('.assembly-story'),stage=document.querySelector('.assembly-stage');
let ticking=false;
function update(){ticking=false;const heroKit=document.querySelector('.hero-kit');if(heroKit){const heroRect=heroKit.closest('.road-hero').getBoundingClientRect();const hp=motion.matches?0:Math.max(0,Math.min(1,-heroRect.top/heroRect.height));heroKit.style.setProperty('--kit-scroll',hp.toFixed(4));}if(story&&stage){const r=story.getBoundingClientRect();const p=Math.max(0,Math.min(1,-r.top/Math.max(1,r.height-innerHeight)));const spread=motion.matches?1:Math.min(1,p*3);stage.style.setProperty('--reveal',spread.toFixed(4));stage.style.setProperty('--pan',p.toFixed(4));stage.style.setProperty('--spread',spread.toFixed(4));story.style.setProperty('--progress',p.toFixed(4));}const bar=document.querySelector('.mobile-contact'),lead=document.getElementById('lead'),hero=document.querySelector('.road-hero');if(bar&&lead){const leadRect=lead.getBoundingClientRect();const heroLimit=hero?hero.offsetHeight*.92:innerHeight*.85;const beforeStory=scrollY<heroLimit;const onLead=leadRect.top<innerHeight&&leadRect.bottom>0;bar.hidden=beforeStory||onLead;}}
function schedule(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);motion.addEventListener('change',schedule);update();
})();

/* Supplied product reel: a short, one-time pause lets the story land before scrolling continues. */
(function(){'use strict';
const video=document.getElementById('materialFour'),frame=document.querySelector('.material-reel__frame'),sound=document.querySelector('[data-video-sound="materialFour"]');
if(!video||!frame)return;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let seen=false,unlocked=Boolean(navigator.userActivation&&navigator.userActivation.hasBeenActive);
function setSound(on){if(sound){sound.hidden=false;sound.textContent=on?'השתקת קול':'הפעלת קול';sound.setAttribute('aria-pressed',on?'true':'false');}}
function play(){
  video.muted=!unlocked;
  video.volume=.82;
  return video.play().then(function(){setSound(!video.muted);}).catch(function(){video.muted=true;return video.play().catch(function(){}).then(function(){setSound(false);});});
}
function release(){document.body.classList.remove('material-reel-lock');frame.classList.remove('is-featured');}
function feature(){
  if(seen||reduce.matches)return;
  seen=true;
  frame.classList.add('is-featured');

  play();
  setTimeout(release,2100);
}
['pointerdown','touchstart','keydown','wheel'].forEach(function(type){addEventListener(type,function(){unlocked=true;},{passive:true,once:true});});
if(sound)sound.addEventListener('click',function(){unlocked=true;video.muted=!video.muted;video.volume=.82;video.play().then(function(){setSound(!video.muted);}).catch(function(){video.muted=true;setSound(false);});});
if('IntersectionObserver' in window){new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting&&entry.intersectionRatio>.72)feature();});},{threshold:[.72]}).observe(frame);}else{feature();}
function inFocus(){var r=frame.getBoundingClientRect();return r.top<innerHeight*.28&&r.bottom>innerHeight*.72;}
addEventListener('scroll',function(){if(inFocus())feature();},{passive:true});
})();
