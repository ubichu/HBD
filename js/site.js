
/* =========================================================
   Main helper functions for the whole website.
   This file keeps navigation, decorations, and interactions
   in one place so the pages stay easy to edit.
   ========================================================= */

/* ---------- CONFIG ----------
   Change page file names here if you rename anything later.
*/
const SITE = {
  pages: {
    page1: 'index.html',
    page2: 'page2.html',
    page3: 'page3.html',
    page4: 'page4.html',
    final: 'final.html',

    /* FUTURE PAGE PLACEHOLDER:
       Replace 'future-page.html' with your real page when you make it.
       Then update the `ageGateTarget` value below if needed.
    */
    ageGateTarget: 'future-page.html'
  },
  assets: {
    video: '../assets/video/replace-me.mp4',
    poster: '../assets/images/video-poster.png',
    stickers: [
      '../assets/images/star.svg',
      '../assets/images/heart.svg',
      '../assets/images/pixel-bow.svg',
      '../assets/images/pixel-sparkle.svg',
      '../assets/images/smiley.svg',
      '../assets/images/sparkle.gif',
      '../assets/images/heart.gif'
    ]
  }
};

/* ---------- TRANSITION HELPERS ----------
   A tiny fade-out before changing page.
*/
function goTo(url){
  document.body.classList.add('fade-out');
  setTimeout(() => { window.location.href = url; }, 180);
}

function hookLinks(){
  document.querySelectorAll('[data-go]').forEach(el => {
    el.addEventListener('click', () => goTo(el.getAttribute('data-go')));
  });
}

/* ---------- RANDOM DECORATIONS ----------
   Each page gets different random placements so it feels playful.
*/
function addDecorations(count = 8){
  const layer = document.querySelector('.sticker-layer');
  if(!layer) return;

  const stickerPool = SITE.assets.stickers;
  const w = window.innerWidth;
  const h = window.innerHeight;

  for(let i = 0; i < count; i++){
    const img = document.createElement('img');
    img.src = stickerPool[i % stickerPool.length];
    img.alt = '';
    img.className = 'sticker ' + (i % 3 === 0 ? 'big' : (i % 3 === 1 ? 'small' : ''));
    img.style.left = Math.max(2, Math.random() * 86) + '%';
    img.style.top = Math.max(2, Math.random() * 78) + '%';
    img.style.animationDelay = (Math.random() * 2.5) + 's';
    img.style.transform = `rotate(${Math.random() * 18 - 9}deg)`;
    layer.appendChild(img);
  }

  for(let i = 0; i < 6; i++){
    const sparkle = document.createElement('img');
    sparkle.src = '../assets/images/pixel-sparkle.svg';
    sparkle.alt = '';
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 92 + '%';
    sparkle.style.top = Math.random() * 84 + '%';
    sparkle.style.animationDelay = (Math.random() * 2.5) + 's';
    layer.appendChild(sparkle);
  }
}

/* ---------- AGE GATE ----------
   Page 3 logic:
   - 18 or older -> redirect to your future page.
   - under 18 -> show the underage message.
*/
function initAgeGate(){
  const select = document.querySelector('#ageSelect');
  const btn = document.querySelector('#ageContinue');
  const msg = document.querySelector('#ageMessage');
  if(!select || !btn || !msg) return;

  btn.addEventListener('click', () => {
    const age = Number(select.value);
    if(Number.isNaN(age)){
      msg.textContent = 'pick a number first';
      return;
    }

    if(age >= 18){
      /* =====================================================
         CONNECT YOUR FUTURE PAGE HERE:
         1) Create your page file.
         2) Put its file name into SITE.pages.ageGateTarget.
         3) Or replace the line below with any URL you want.
         ===================================================== */
      goTo(SITE.pages.ageGateTarget);
    } else {
      msg.textContent = 'هه بعدك قاصر 😹😹😹';
      msg.classList.add('page-enter');
    }
  });
}

/* ---------- "UBICHU" PAGE ----------
   The tricky button moves away whenever someone tries to click
   the other button.
*/
function initChoicePage(){
  const escapeBtn = document.querySelector('#escapeBtn');
  const safeBtn = document.querySelector('#safeBtn');
  const area = document.querySelector('.choice-area');
  if(!escapeBtn || !safeBtn || !area) return;

  function moveEscape(){
    const areaRect = area.getBoundingClientRect();
    const btnRect = escapeBtn.getBoundingClientRect();

    const maxX = Math.max(0, areaRect.width - btnRect.width - 12);
    const maxY = Math.max(0, areaRect.height - btnRect.height - 12);

    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);

    escapeBtn.style.left = x + 'px';
    escapeBtn.style.top = y + 'px';
    escapeBtn.style.right = 'auto';
    escapeBtn.style.bottom = 'auto';
  }

  ['mouseenter', 'touchstart', 'pointerdown', 'focus'].forEach(evt => {
    escapeBtn.addEventListener(evt, moveEscape, { passive: true });
  });

  safeBtn.addEventListener('click', () => goTo(SITE.pages.final));

  // Give the button a random starting location each time.
  window.addEventListener('load', moveEscape, { once: true });
  setTimeout(moveEscape, 100);
}

/* ---------- VIDEO PAGE ----------
   Keeps the video file easy to replace.
*/
function initVideoPage(){
  const video = document.querySelector('video');
  if(!video) return;
  video.poster = SITE.assets.poster;
  const source = video.querySelector('source');
  if(source) source.src = SITE.assets.video;
  video.load();
}

/* ---------- BOOT ----------
   Runs on every page.
*/
document.addEventListener('DOMContentLoaded', () => {
  hookLinks();
  addDecorations(9);
  initAgeGate();
  initChoicePage();
  initVideoPage();
});
