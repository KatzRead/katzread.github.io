// Tab sistemi
const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');
tabs.forEach(btn => btn.addEventListener('click', () => {
  tabs.forEach(b => b.classList.remove('active'));
  contents.forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(btn.dataset.tab).classList.add('active');
}));

// Crosshair
const crosshair = document.getElementById("crosshair");
document.addEventListener("mousemove", e => {
  crosshair.style.left = e.clientX + "px";
  crosshair.style.top = e.clientY + "px";
  document.body.style.cursor = "none";
});

// Settings bar
const settingsBar = document.getElementById("settings-bar");
settingsBar.addEventListener("mouseenter", () => settingsBar.classList.add("open"));
settingsBar.addEventListener("mouseleave", () => settingsBar.classList.remove("open"));

// Theme color
const themeInputs = document.querySelectorAll('#themeColor, #themeColorBar');
themeInputs.forEach(input => {
  const savedColor = localStorage.getItem("themeColor");
  if(savedColor) { input.value = savedColor; applyThemeColor(savedColor); }
  input.addEventListener("input", e => {
    localStorage.setItem("themeColor", e.target.value);
    applyThemeColor(e.target.value);
  });
});

function applyThemeColor(color){
  document.documentElement.style.setProperty("--theme-color", color);
  const r=parseInt(color.slice(1,3),16), g=parseInt(color.slice(3,5),16), b=parseInt(color.slice(5,7),16);
  document.documentElement.style.setProperty("--theme-rgb", `${r},${g},${b}`);
  document.querySelectorAll('.header-logo, .section-box, .about-section, .equip-card, .widget, .tab-menu button').forEach(el=>{
    el.style.background=`rgba(${r},${g},${b},0.2)`;
  });
}

// Particles
const canvas=document.getElementById('particle-canvas');
const ctx=canvas.getContext('2d');
let canvasWidth=window.innerWidth, canvasHeight=window.innerHeight;
canvas.width=canvasWidth; canvas.height=canvasHeight;
window.addEventListener('resize',()=>{ canvasWidth=window.innerWidth; canvasHeight=window.innerHeight; canvas.width=canvasWidth; canvas.height=canvasHeight; });
function getThemeRGB(){ return getComputedStyle(document.documentElement).getPropertyValue('--theme-rgb').trim(); }

class Particle {
  constructor(){ this.x=Math.random()*canvasWidth; this.y=Math.random()*canvasHeight; this.size=Math.random()*2+1; this.speedX=(Math.random()-0.5)*0.8; this.speedY=(Math.random()-0.5)*0.8; }
  update(){ this.x+=this.speedX; this.y+=this.speedY; if(this.x>canvasWidth)this.x=0;if(this.x<0)this.x=canvasWidth;if(this.y>canvasHeight)this.y=0;if(this.y<0)this.y=canvasHeight; }
  draw(){ ctx.fillStyle=`rgba(${getThemeRGB()},0.7)`; ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill(); }
}

const particlesArray=[];
function initParticles(num=100){ particlesArray.length=0; for(let i=0;i<num;i++) particlesArray.push(new Particle()); }
initParticles();

function animateParticles(){
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
  particlesArray.forEach(p=>{ p.update(); p.draw(); });
  const themeRGB=getThemeRGB();
  for(let i=0;i<particlesArray.length;i++){
    for(let j=i+1;j<particlesArray.length;j++){
      const p1=particlesArray[i], p2=particlesArray[j];
      const dx=p1.x-p2.x, dy=p1.y-p2.y, dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<120){ ctx.strokeStyle=`rgba(${themeRGB},${(1-dist/120)*0.2})`; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.stroke(); }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Faceit Widget
const apiKey="dc63f5ce-1360-4c87-882a-c3c988115063", nickname="KatzRead", MATCH_LIMIT=30;
const toggleBtn=document.getElementById("toggleBtn"), widgetDiv=document.getElementById("katzWidget");
toggleBtn.addEventListener("click",()=>{ if(widgetDiv.style.display==="block"){ widgetDiv.style.display="none"; }else{ widgetDiv.style.display="block"; loadWidget(); }});
setInterval(()=>{ if(widgetDiv.style.display==="block"){ loadWidget(); }},30000);
async function fetchJSON(url){ const res=await fetch(url,{ headers:{ Authorization:"Bearer "+apiKey } }); return await res.json(); }
async function loadWidget(){ 
  try{ 
    const playerData=await fetchJSON(`https://open.faceit.com/data/v4/players?nickname=${nickname}&game=cs2`);
    const elo=playerData.games?.cs2?.faceit_elo||"N/A"; document.getElementById("elo").innerText="ELO: "+elo;
    const playerId=playerData.player_id; 
    const stats=await fetchJSON(`https://open.faceit.com/data/v4/players/${playerId}/stats/cs2`); 
    const matches=stats.lifetime?.Matches||"N/A"; document.getElementById("matches").innerText="Toplam Maç: "+matches;
    const history=await fetchJSON(`https://open.faceit.com/data/v4/players/${playerId}/history?game=cs2&limit=${MATCH_LIMIT}`);
    const tbody=document.querySelector("#stats-table tbody"); tbody.innerHTML=""; 
    let totalKills=0,totalDeaths=0,totalADR=0,totalHS=0,totalRounds=0,matchCount=0;
    for(let i=0;i<history.items.length;i++){
      const match=history.items[i];
      try{
        const matchData=await fetchJSON(`https://open.faceit.com/data/v4/matches/${match.match_id}/stats`);
        let kills=0,deaths=0,adrSum=0,hsSum=0,roundsPlayed=0;
        matchData.rounds?.forEach(r=>{ r.teams.forEach(t=>{ t.players.forEach(p=>{ if(p.nickname===nickname){ kills+=Number(p.player_stats.Kills||0); deaths+=Number(p.player_stats.Deaths||0); adrSum+=Number(p.player_stats.ADR||0); hsSum+=Number(p.player_stats.Headshots||0); roundsPlayed++; } }); }); });
        if(roundsPlayed>0){ const KD=deaths>0?(kills/deaths).toFixed(2):kills; const hsPercent=kills>0?((hsSum/kills)*100).toFixed(1)+"%":"-"; const tr=document.createElement("tr"); tr.innerHTML=`<td>${kills}</td><td>${deaths}</td><td>${KD}</td><td>${(adrSum/roundsPlayed).toFixed(1)}</td><td>${hsPercent}</td>`; tbody.appendChild(tr); totalKills+=kills; totalDeaths+=deaths; totalADR+=(adrSum/roundsPlayed); totalHS+=kills>0?(hsSum/kills)*100:0; totalRounds+=roundsPlayed; matchCount++; } 
      }catch{ const tr=document.createElement("tr"); tr.innerHTML=`<td colspan="5">Veri yok</td>`; tbody.appendChild(tr); }
    }
    if(matchCount>0){ const avgKills=(totalKills/matchCount).toFixed(1), avgDeaths=(totalDeaths/matchCount).toFixed(1), avgKD=(totalKills/totalDeaths).toFixed(2), avgADR=(totalADR/matchCount).toFixed(1), avgHS=(totalHS/matchCount).toFixed(1)+"%"; const avgRow=document.createElement("tr"); avgRow.classList.add("avg-row"); avgRow.innerHTML=`<td colspan="5" style="text-align:center;font-weight:bold;color:#00ffff;text-shadow:0 0 1px #00ffff;border-top:1px solid #00ffff;padding-top:6px;">AVG — ${avgKills} / ${avgDeaths} / ${avgKD} / ${avgADR} / ${avgHS}</td>`; tbody.appendChild(avgRow); }
  }catch{ document.getElementById("elo").innerText="ELO alınamadı"; document.getElementById("matches").innerText="Toplam Maç: N/A"; document.querySelector("#stats-table tbody").innerHTML=`<tr><td colspan="5">Veri alınamadı</td></tr>`; }
}
