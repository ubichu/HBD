# 💜 UNC CLUB — Y2K Scene Core Website 💜

A fully old-school, early-2000s-styled mini website with 6 pages.
No coding experience needed to customize it — just follow the guide below!

## 📁 Folder structure

```
unc-club/
├── index.html            ← Page 1: name entry
├── page2-video.html      ← Page 2: video page
├── page3-age.html        ← Page 3: age check
├── page4-favorite.html   ← Page 4: favorite thing (runaway button)
├── page5-aww.html        ← Page 5: aww reaction
├── page6-birthday.html   ← Final page: birthday message
├── css/
│   └── style.css         ← ALL styling lives here
├── js/
│   └── main.js           ← shared sparkle/floating effects
├── images/                ← put your pictures here
├── videos/                ← put your video here
└── audio/                 ← put music/sound files here (optional, not wired up yet)
```

## 🖼️ How to replace images

Just drop a new file into the **images/** folder using the SAME name as
the placeholder it's replacing:

- `deco1.png`, `deco2.png`, `deco3.png`, `deco4.png` → the floating decorations
  (sparkle, star, heart, cat) that appear on several pages
- `sparkle-corner.png` → the little corner sparkles on the dashed boxes
- `video-poster.jpg` → the thumbnail shown before the video plays

You can use `.png`, `.gif`, or `.jpg` — just update the filename inside the
matching HTML file's `<img src="images/...">` tag if you change the extension.

If a file is ever missing, a cute glittery placeholder box shows up instead
of a broken image icon — so nothing ever looks "broken" while you're working.

## 🎥 How to replace the video

Drop your video file into **videos/** and name it `main-video.mp4`.
That's it — Page 2 will play it automatically.

## ✏️ How to edit text

Every page has clearly labeled `<!-- EDIT ME -->` comments right above the
text you're allowed to change. Open any `.html` file in a text editor
(even Notepad works), find the comment, and edit the text right below it.

## 🎨 How to change colors

Open `css/style.css` and look at the very top — section 1, "COLOR PALETTE."
Each color is named (like `--hot-pink` or `--neon-blue`) and has a hex code.
Change the hex code and that color updates everywhere on the whole site.

## 🔗 How the pages connect

1. `index.html` → 2. `page2-video.html` → 3. `page3-age.html` →
4. `page4-favorite.html` → 5. `page5-aww.html` → 6. `page6-birthday.html`

On Page 3, if someone enters an age of 18 or older, the code calls a
function named `goToAdultPage()` — look for it inside `page3-age.html`,
clearly marked with an EDIT ME comment, if you want to send people
somewhere else.

## 📱 Mobile-friendly

This whole site is built mobile-first — it'll look right on phones,
tablets, and desktop browsers alike.

Enjoy! 🐱✨🎀
