// Tab geçişleri
const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');
tabs.forEach(btn => btn.addEventListener('click', () => {
  tabs.forEach(b => b.classList.remove('active'));
  contents.forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(btn.dataset.tab).classList.add('active');
}));
421321
// Crosshair
const crosshair = document.getElementById("crosshair");

// Mouse hareketi
document.addEventListener("mousemove", e => {
  crosshair.style.left = e.clientX + "px";
  crosshair.style.top = e.clientY + "px";

  // Her mousemove’de cursor gizle
  document.body.style.cursor = "none";

  // Tüm interaktif elementlerde de cursor gizle
  document.querySelectorAll("button, input, select, textarea, a").forEach(el => {
    el.style.cursor = "none";
  });
});

// Tüm interaktif elementlerde hover sırasında cursor gizleme
document.querySelectorAll("button, input, select, textarea, a").forEach(el => {
  el.addEventListener("mouseenter", () => { el.style.cursor = "none"; });
  el.addEventListener("mouseleave", () => { el.style.cursor = "none"; });
});

// Settings bar
const settingsBar = document.getElementById("settings-bar");
settingsBar.addEventListener("mouseenter", () => { settingsBar.classList.add("open"); });
settingsBar.addEventListener("mouseleave", () => { settingsBar.classList.remove("open"); });

// Tema rengi input
const themeInput = document.getElementById("themeColor");

// Sayfa yüklenirken localStorage’dan renk al
const savedColor = localStorage.getItem("themeColor");
if(savedColor){
  themeInput.value = savedColor;
  applyThemeColor(savedColor);
}

// Renk değiştiğinde uygula ve kaydet
themeInput.addEventListener("input", (e) => {
  const color = e.target.value;
  localStorage.setItem("themeColor", color);
  applyThemeColor(color);
});

// Renk uygulama fonksiyonu
function applyThemeColor(color){
  document.documentElement.style.setProperty("--theme-color", color);
  const r = parseInt(color.slice(1,3),16);
  const g = parseInt(color.slice(3,5),16);
  const b = parseInt(color.slice(5,7),16);
  document.documentElement.style.setProperty("--theme-rgb", `${r},${g},${b}`);
  
  const logo = document.querySelector(".header-logo");
  if(logo) logo.style.boxShadow = `0 0 5px ${color}, 0 0 15px ${color}, 0 0 25px ${color}`;
}

// Canvas setup
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
canvas.style.pointerEvents = 'none'; // UI elementleri etkilenmez

// Window resize
window.addEventListener('resize', () => {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
});

// Theme helper
function getThemeRGB() {
  return getComputedStyle(document.documentElement).getPropertyValue('--theme-rgb').trim();
}

// Particle class
class Particle {
  constructor() {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.speedY = (Math.random() - 0.5) * 0.8;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.x > canvasWidth) this.x = 0;
    if(this.x < 0) this.x = canvasWidth;
    if(this.y > canvasHeight) this.y = 0;
    if(this.y < 0) this.y = canvasHeight;
  }
  draw() {
    ctx.fillStyle = `rgba(${getThemeRGB()},0.7)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
  }
}

// Particles array
const particlesArray = [];
function initParticles(num = 100) {
  particlesArray.length = 0;
  for(let i = 0; i < num; i++) particlesArray.push(new Particle());
}
initParticles();

// Animate particles
function animateParticles() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  particlesArray.forEach(p => { p.update(); p.draw(); });

  const themeRGB = getThemeRGB();
  for(let i = 0; i < particlesArray.length; i++) {
    for(let j = i + 1; j < particlesArray.length; j++) {
      const p1 = particlesArray[i];
      const p2 = particlesArray[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 120) {
        ctx.strokeStyle = `rgba(${themeRGB},${(1 - dist/120) * 0.2})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();
