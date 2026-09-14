(function(){'use strict';
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const story=document.querySelector('.assembly-story'),stage=document.querySelector('.assembly-stage');
let ticking=false;
function update(){ticking=false;if(story&&stage){const r=story.getBoundingClientRect();const p=Math.max(0,Math.min(1,-r.top/Math.max(1,r.height-innerHeight)));const spread=motion.matches?0:Math.sin(p*Math.PI);stage.style.setProperty('--spread',spread.toFixed(4));story.style.setProperty('--progress',p.toFixed(4));}const bar=document.querySelector('.mobile-contact'),lead=document.getElementById('lead'),hero=document.querySelector('.road-hero');if(bar&&lead){const leadRect=lead.getBoundingClientRect();const heroLimit=hero?hero.offsetHeight*.92:innerHeight*.85;const beforeStory=scrollY<heroLimit;const onLead=leadRect.top<innerHeight&&leadRect.bottom>0;bar.hidden=beforeStory||onLead;}}
function schedule(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);motion.addEventListener('change',schedule);update();
document.querySelectorAll('[data-video-toggle]').forEach(button=>{const video=document.getElementById(button.dataset.videoToggle);if(!video)return;function label(){button.textContent=video.paused?'הפעלת הסרטון':'השהיית הסרטון';button.setAttribute('aria-label',button.textContent);}button.addEventListener('click',()=>{if(video.paused){video.dataset.userPaused='false';video.play().catch(()=>{});}else{video.dataset.userPaused='true';video.pause();}label();});video.addEventListener('play',label);video.addEventListener('pause',label);label();});
})();
