/* ============================================================
   MAIN.JS — shared by every page
   ============================================================
   This file creates the floating background decorations
   (hearts, stars, sparkles) and a few small helper functions
   that other pages call into.

   You normally do NOT need to edit this file. If you want to
   change which emoji float around the page, see the EDIT ME
   sections below.
   ============================================================ */

/* ------------------------------------------------------------
   CONFIG — EDIT ME: change these emoji lists to whatever you like
   ------------------------------------------------------------ */
const FLOAT_EMOJIS = ["💖", "⭐", "✨", "🐱", "💫", "🩷"];
const SPARKLE_EMOJIS = ["✨", "⭐", "💫", "🌟"];

/* ------------------------------------------------------------
   Creates floating hearts/stars that drift up the screen forever.
   Called automatically on every page (see bottom of file).
   ------------------------------------------------------------ */
function startFloatingDecorations(count = 12) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "float-deco";
    el.textContent = FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.fontSize = (14 + Math.random() * 18) + "px";
    const duration = 6 + Math.random() * 8;
    el.style.animationDuration = duration + "s";
    el.style.animationDelay = (Math.random() * duration) + "s";
    document.body.appendChild(el);
  }
}

/* ------------------------------------------------------------
   Sparkle trail that follows taps/clicks anywhere on the page.
   Pure decoration — purely for that "glitter cursor" Y2K feel.
   ------------------------------------------------------------ */
function spawnSparkle(x, y) {
  const s = document.createElement("div");
  s.className = "sparkle";
  s.textContent = SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)];
  s.style.left = x + "px";
  s.style.top = y + "px";
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 850);
}

function initSparkleTrail() {
  window.addEventListener("pointerdown", (e) => spawnSparkle(e.clientX, e.clientY));
  // Occasional random ambient sparkle even without interaction
  setInterval(() => {
    spawnSparkle(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
  }, 1800);
}

/* ------------------------------------------------------------
   Simple localStorage helpers so the visitor's typed name
   carries over from Page 1 to later pages.
   ------------------------------------------------------------ */
function saveVisitorName(name) {
  localStorage.setItem("uncClubVisitorName", name);
}
function getVisitorName() {
  return localStorage.getItem("uncClubVisitorName") || "friend";
}

/* ------------------------------------------------------------
   Run shared setup on every page automatically.
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  startFloatingDecorations();
  initSparkleTrail();
});
