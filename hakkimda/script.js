
// Crosshair hareketi
const crosshair=document.getElementById("crosshair");
document.addEventListener("mousemove",e=>{crosshair.style.left=e.clientX+"px"; crosshair.style.top=e.clientY+"px";});
["mousemove","mousedown","mouseup"].forEach(evt=>{document.addEventListener(evt,()=>{document.body.style.cursor="none";});});

// Tema değiştirme
const colorPicker = document.getElementById("themeColor");
if(colorPicker){
  colorPicker.addEventListener("input",(e)=>{
    const color=e.target.value;
    document.documentElement.style.setProperty("--theme-color", color);
    const r=parseInt(color.slice(1,3),16), g=parseInt(color.slice(3,5),16), b=parseInt(color.slice(5,7),16);
    document.documentElement.style.setProperty("--theme-rgb", `${r},${g},${b}`);
  });
}
