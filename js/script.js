/* #ortak-js */

/* #crosshair-js */
const crosshair=document.getElementById("crosshair");
document.addEventListener("mousemove",e=>{crosshair.style.left=e.clientX+"px"; crosshair.style.top=e.clientY+"px";});
["mousemove","mousedown","mouseup"].forEach(evt=>{document.addEventListener(evt,()=>{document.body.style.cursor="none";});});

/* #theme-js */
const themeInput = document.getElementById("themeColor");
if(themeInput){
  themeInput.addEventListener("input", (e) => {
    const color = e.target.value;
    document.documentElement.style.setProperty("--theme-color", color);
    const r = parseInt(color.slice(1,3),16);
    const g = parseInt(color.slice(3,5),16);
    const b = parseInt(color.slice(5,7),16);
    document.documentElement.style.setProperty("--theme-rgb", `${r},${g},${b}`);
    const logo = document.querySelector(".header-logo");
    if(logo) logo.style.boxShadow = `0 0 5px ${color}, 0 0 15px ${color}, 0 0 25px ${color}`;
  });
}

/* #settings-bar-js */
const settingsBar = document.getElementById("settings-bar");
if(settingsBar){
  settingsBar.addEventListener("mouseenter", () => { settingsBar.classList.add("open"); });
  settingsBar.addEventListener("mouseleave", () => { settingsBar.classList.remove("open"); });
}

/* #faceit-widget-js */
const toggleBtn = document.getElementById("toggleBtn");
const widgetDiv = document.getElementById("katzWidget");
const apiKey = "dc63f5ce-1360-4c87-882a-c3c988115063";
const nickname = "KatzRead";
const MATCH_LIMIT = 30;

if(toggleBtn){
  toggleBtn.addEventListener("click", () => {
    if(widgetDiv.style.display === "none" || widgetDiv.style.display === ""){
      widgetDiv.style.display = "block"; loadWidget();
    } else { widgetDiv.style.display = "none"; }
  });
  setInterval(()=>{ if(widgetDiv.style.display==="block"){ loadWidget(); } },30000);
}

async function fetchJSON(url){
  const res = await fetch(url,{ headers:{ Authorization: "Bearer "+apiKey } });
  return await res.json();
}

async function loadWidget(){
  if(!widgetDiv) return;
  try{
    const playerData = await fetchJSON(`https://open.faceit.com/data/v4/players?nickname=${nickname}&game=cs2`);
    document.getElementById("elo").innerText = "ELO: "+(playerData.games?.cs2?.faceit_elo || "N/A");
    const playerId = playerData.player_id;
    const stats = await fetchJSON(`https://open.faceit.com/data/v4/players/${playerId}/stats/cs2`);
    document.getElementById("matches").innerText = "Toplam Maç: "+(stats.lifetime?.Matches || "N/A");
    // History ve tablo işlemleri...
  }catch{
    document.getElementById("elo").innerText="ELO alınamadı";
    document.getElementById("matches").innerText="Toplam Maç: N/A";
    document.querySelector("#stats-table tbody").innerHTML=`<tr><td colspan="5">Veri alınamadı</td></tr>`;
  }
}
