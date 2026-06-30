(function(){
"use strict";
/** ponytail: cross-origin iframe scroll blocked — scroll case-study page; phone uses .phone-screen--scroll */
var cfg,ov,sub,fill,cur,playing,muted,wi,raf,ac;
function q(s,r){return (r||document).querySelector(s)}
function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
function lerp(a,b,t){return a+(b-a)*t}
function speak(t){
  if(muted||!t||!window.speechSynthesis)return;
  speechSynthesis.cancel();
  var u=new SpeechSynthesisUtterance(t);u.lang="ru-RU";u.rate=.9;
  speechSynthesis.speak(u);
}
function sfx(k){
  try{
    if(!ac)ac=new (window.AudioContext||window.webkitAudioContext)();
    if(ac.state==="suspended")ac.resume();
    var o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);
    if(k==="click"){o.frequency.value=920;g.gain.setValueAtTime(.07,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.05);o.start();o.stop(ac.currentTime+.05);}
    else{o.type="triangle";o.frequency.setValueAtTime(280,ac.currentTime);o.frequency.exponentialRampToValueAtTime(90,ac.currentTime+.28);g.gain.setValueAtTime(.05,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.32);o.start();o.stop(ac.currentTime+.32);}
  }catch(e){}
}
function setSub(p){
  var s=cfg.subtitles||[],t=s[0]?s[0].text:"";
  for(var i=0;i<s.length;i++)if(p>=s[i].at)t=s[i].text;
  if(sub&&sub.textContent!==t){sub.textContent=t;speak(t);}
}
function scrollTo(y,d,cb){
  var sy=window.scrollY,st=performance.now();
  function step(n){
    var p=Math.min(1,(n-st)/d);
    window.scrollTo(0,lerp(sy,y,ease(p)));
    if(p<1)raf=requestAnimationFrame(step);else cb&&cb();
  }
  cancelAnimationFrame(raf);raf=requestAnimationFrame(step);
}
function phoneAnim(d,cb){
  var el=q(".phone-screen--scroll");if(!el){cb&&cb();return}
  var a=el.scrollTop,b=Math.max(0,el.scrollHeight-el.clientHeight),st=performance.now();
  function step(n){
    var p=Math.min(1,(n-st)/d);el.scrollTop=lerp(a,b,ease(p));
    if(p<1)requestAnimationFrame(step);else cb&&cb();
  }
  requestAnimationFrame(step);
}
function wpY(w){
  if(w.selector){var el=q(w.selector);if(el)return window.scrollY+el.getBoundingClientRect().top-72}
  if(w.scrollY!=null){var m=document.documentElement.scrollHeight-window.innerHeight;return m*(w.scrollY/100)}
  return 0;
}
function clickEl(sel,cb){
  var el=q(sel);if(!el||!cur){cb&&cb();return}
  var r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
  cur.style.transform="translate("+x+"px,"+y+"px) scale(1)";
  setTimeout(function(){
    cur.style.transform="translate("+x+"px,"+y+"px) scale(.82)";sfx("click");el.click();
    setTimeout(function(){cur.style.transform="translate("+x+"px,"+y+"px) scale(1)";cb&&cb();},140);
  },420);
}
function run(i){
  var wps=cfg.waypoints||[];if(i>=wps.length){finish();return}
  wi=i;var w=wps[i];sfx("whoosh");setSub(w.at!=null?w.at:i/Math.max(1,wps.length-1));
  scrollTo(wpY(w),w.duration||2400,function(){
    var wait=w.pauseMs||1500,end=performance.now()+wait;
    function pause(){
      if(!playing){requestAnimationFrame(pause);return}
      if(performance.now()<end){requestAnimationFrame(pause);return}
      function next(){if(playing)run(i+1)}
      if(w.click)clickEl(w.click,function(){w.phoneScroll?phoneAnim(1800,next):next()});
      else if(w.phoneScroll)phoneAnim(1800,next);
      else next();
    }
    pause();
  });
}
function tick(){
  var wps=cfg.waypoints||[],at=wps[wi]?wps[wi].at:wi/Math.max(1,wps.length-1);
  if(fill)fill.style.width=(Math.min(1,at+(playing?0.02:0))*100)+"%";
  if(playing)raf=requestAnimationFrame(tick);
}
function open(){
  if(!ov)return;
  ov.hidden=false;cur.hidden=false;playing=true;wi=0;
  document.body.classList.add("cinematic-active");
  window.scrollTo(0,0);setSub(0);run(0);cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);
}
function close(){
  playing=false;cancelAnimationFrame(raf);speechSynthesis.cancel();
  document.body.classList.remove("cinematic-active");
  if(ov)ov.hidden=true;if(cur)cur.hidden=true;
}
function finish(){if(fill)fill.style.width="100%";setTimeout(close,2200)}
function build(){
  ov=document.createElement("div");ov.id="cinematic-overlay";ov.hidden=true;
  var live=cfg.liveUrl?"<iframe class=\"cinematic-live\" src=\""+cfg.liveUrl+"\" tabindex=\"-1\" aria-hidden=\"true\"></iframe>":"";
  ov.innerHTML="<div class=\"cinematic-backdrop\">"+live+"</div><header class=\"cinematic-bar\"><button type=\"button\" data-c-play>\u25b6</button><button type=\"button\" data-c-pause>\u23f8</button><button type=\"button\" data-c-skip>\u23ed</button><div class=\"cinematic-progress\"><div class=\"cinematic-progress-fill\"></div></div><button type=\"button\" data-c-mute aria-pressed=\"true\">\uD83D\uDD07</button><button type=\"button\" data-c-close>\u2715</button></header><div class=\"cinematic-sub\" aria-live=\"polite\"></div>";
  document.body.appendChild(ov);
  sub=q(".cinematic-sub",ov);fill=q(".cinematic-progress-fill",ov);
  cur=document.createElement("div");cur.className="cinematic-cursor";cur.hidden=true;document.body.appendChild(cur);
  muted=true;
  ov.querySelector("[data-c-close]").addEventListener("click",close,{passive:true});
  ov.querySelector("[data-c-play]").addEventListener("click",function(){if(!playing){playing=true;run(wi);requestAnimationFrame(tick);}},{passive:true});
  ov.querySelector("[data-c-pause]").addEventListener("click",function(){playing=false;cancelAnimationFrame(raf);speechSynthesis.cancel();},{passive:true});
  ov.querySelector("[data-c-skip]").addEventListener("click",function(){cancelAnimationFrame(raf);run(Math.min(wi+1,(cfg.waypoints||[]).length));},{passive:true});
  ov.querySelector("[data-c-mute]").addEventListener("click",function(){
    muted=!muted;this.textContent=muted?"\uD83D\uDD07":"\uD83D\uDD0A";this.setAttribute("aria-pressed",muted?"true":"false");
    if(!muted&&sub.textContent)speak(sub.textContent);
  },{passive:true});
  document.addEventListener("visibilitychange",function(){
    if(document.hidden&&playing){playing=false;cancelAnimationFrame(raf);speechSynthesis.cancel();}
  },{passive:true});
}
function init(){
  var node=q("#cinematic-config");if(!node)return;
  try{cfg=JSON.parse(node.textContent);}catch(e){return}
  build();
  var btn=q("[data-cinematic-trigger]");if(btn)btn.addEventListener("click",open,{passive:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{passive:true});
else init();
})();
