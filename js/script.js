(() => {
  "use strict";

  /*
    Shared JavaScript for all six pages.
    Beginner edit guide:
    - Change file paths in AUDIO_FILES if you rename the audio placeholders.
    - Change page URLs in the page-specific functions if you rename HTML files.
    - Change ADULT_REDIRECT_URL below when you are ready to send 18+ visitors somewhere real.
  */

  const STORAGE_KEYS = {
    visitorName: "uncClubVisitorName",
    musicWanted: "uncClubMusicWanted"
  };

  const AUDIO_FILES = {
    bgm: "audio/bgm.wav",
    click: "audio/click.wav",
    envelope: "audio/envelope-open.wav",
    sparkle: "audio/sparkle.wav"
  };

  // ==============================
  // REPLACE THIS URL WITH YOUR OWN
  // ==============================
  const ADULT_REDIRECT_URL = "https://pornhub.com/";

  const REDIRECT_DELAY_MS = 260;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const audio = {
    bgm: makeAudio(AUDIO_FILES.bgm, { loop: true, volume: 0.22 }),
    click: makeAudio(AUDIO_FILES.click, { volume: 0.42 }),
    envelope: makeAudio(AUDIO_FILES.envelope, { volume: 0.58 }),
    sparkle: makeAudio(AUDIO_FILES.sparkle, { volume: 0.35 })
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("is-loaded");

    fillSavedVisitorName();
    setupAudioUnlocking();
    setupSoundToggle();
    setupInternalPageTransitions();
    setupCursorSparkles();
    setupPageBehavior();
  });

  /*
    Creates an Audio object once and applies friendly defaults.
    Replace the files in audio/ with real MP3/WAV files later; the code can stay the same.
  */
  function makeAudio(src, options = {}) {
    const sound = new Audio(src);
    sound.preload = "auto";
    sound.loop = Boolean(options.loop);
    sound.volume = typeof options.volume === "number" ? options.volume : 0.5;
    return sound;
  }

  /*
    Starts background music only after a user gesture.
    Browser autoplay rules require a click, tap, key press, or similar interaction first.
  */
  function startBackgroundMusic() {
    sessionStorage.setItem(STORAGE_KEYS.musicWanted, "true");
    audio.bgm.play().then(updateSoundToggle).catch(() => {
      updateSoundToggle();
    });
  }

  /*
    Stops the looping music and remembers that choice for this tab.
  */
  function stopBackgroundMusic() {
    audio.bgm.pause();
    sessionStorage.setItem(STORAGE_KEYS.musicWanted, "false");
    updateSoundToggle();
  }

  /*
    Plays a short sound effect from the beginning.
    If the file is missing while you customize, the page still continues normally.
  */
  function playSoundEffect(sound) {
    if (!sound) {
      return;
    }

    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  /*
    If the visitor already started music on a previous page, the next user interaction
    tries to resume it after navigation.
  */
  function setupAudioUnlocking() {
    const unlock = () => {
      if (sessionStorage.getItem(STORAGE_KEYS.musicWanted) === "true") {
        startBackgroundMusic();
      }
    };

    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });

    document.addEventListener(
      "click",
      (event) => {
        const clickedThing = event.target.closest("a, button, input[type='submit']");
        if (clickedThing) {
          playSoundEffect(audio.click);
        }
      },
      true
    );
  }

  /*
    The small music button lets the user restart or pause the loop on any page.
  */
  function setupSoundToggle() {
    const button = document.querySelector("[data-sound-toggle]");
    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      if (audio.bgm.paused) {
        startBackgroundMusic();
      } else {
        stopBackgroundMusic();
      }
    });

    updateSoundToggle();
  }

  /*
    Keeps the music button label and animation in sync with the audio state.
  */
  function updateSoundToggle() {
    const button = document.querySelector("[data-sound-toggle]");
    if (!button) {
      return;
    }

    const isPlaying = !audio.bgm.paused;
    button.classList.toggle("is-playing", isPlaying);
    button.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
  }

  /*
    Adds a soft fade before moving between local HTML pages.
  */
  function setupInternalPageTransitions() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const url = new URL(link.href, window.location.href);
      const isLocalHtml = url.origin === window.location.origin && url.pathname.endsWith(".html");

      if (isLocalHtml) {
        event.preventDefault();
        goToPage(url.href);
      }
    });
  }

  /*
    Navigates to another page after applying the leaving class.
    Change REDIRECT_DELAY_MS near the top if you want a faster/slower fade.
  */
  function goToPage(url) {
    document.body.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.href = url;
    }, prefersReducedMotion ? 0 : REDIRECT_DELAY_MS);
  }

  /*
    Saved visitor names appear in any element with data-visitor-name.
  */
  function fillSavedVisitorName() {
    const savedName = sessionStorage.getItem(STORAGE_KEYS.visitorName) || "cutie";
    document.querySelectorAll("[data-visitor-name]").forEach((element) => {
      element.textContent = savedName;
    });
  }

  /*
    Page router. Each HTML file sets body[data-page], so one script can stay shared.
  */
  function setupPageBehavior() {
    const page = document.body.dataset.page;

    if (page === "intro") {
      setupIntroPage();
    }

    if (page === "video") {
      setupVideoPage();
    }

    if (page === "age") {
      setupAgePage();
    }

    if (page === "trick") {
      setupTrickPage();
    }

    if (page === "reaction") {
      setupReactionPage();
    }

    if (page === "envelope") {
      setupEnvelopePage();
    }
  }

  /*
    Page 1: saves the typed name, starts the BGM from the submit click,
    then sends the visitor to page 2.
  */
  function setupIntroPage() {
    const form = document.querySelector("#intro-form");
    const input = document.querySelector("#visitor-name");
    const status = document.querySelector("#intro-status");

    if (!form || !input) {
      return;
    }

    const oldName = sessionStorage.getItem(STORAGE_KEYS.visitorName);
    if (oldName) {
      input.value = oldName;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const visitorName = input.value.trim() || "cutie";
      sessionStorage.setItem(STORAGE_KEYS.visitorName, visitorName);

      if (status) {
        status.textContent = `welcome ${visitorName} ♡ loading page 2...`;
      }

      startBackgroundMusic();
      goToPage("page2.html");
    });
  }

  /*
    Page 2: the continue button always works, and the video ending also advances.
  */
  function setupVideoPage() {
    const video = document.querySelector("#memory-video");
    const continueButton = document.querySelector("#video-continue");

    if (continueButton) {
      continueButton.addEventListener("click", () => goToPage("page3.html"));
    }

    if (video) {
      video.addEventListener("ended", () => goToPage("page3.html"));
    }
  }

  /*
    Page 3: checks the typed age.
    Age 18 or higher redirects outside the site; under 18 shows the playful message.
  */
  function setupAgePage() {
    const form = document.querySelector("#age-form");
    const input = document.querySelector("#age-input");
    const message = document.querySelector("#age-message");
    const kidPanel = document.querySelector("#kid-panel");
    const kidContinue = document.querySelector("#kid-continue");

    if (!form || !input || !message || !kidPanel) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      checkAge();
    });

    input.addEventListener("input", () => {
      const age = Number(input.value);
      if (Number.isFinite(age) && age >= 18) {
        checkAge();
      }
    });

    if (kidContinue) {
      kidContinue.addEventListener("click", () => goToPage("page4.html"));
    }

    /*
      Reads the number input and chooses either the external redirect
      or the under-18 joke panel.
    */
    function checkAge() {
      const age = Number(input.value);

      if (!Number.isFinite(age) || input.value.trim() === "") {
        message.textContent = "type a number first ♡";
        kidPanel.hidden = true;
        return;
      }

      if (age >= 18) {
        message.textContent = "redirecting...";
        window.setTimeout(() => {
          window.location.href = ADULT_REDIRECT_URL;
        }, prefersReducedMotion ? 0 : 450);
        return;
      }

      message.textContent = "";
      kidPanel.hidden = false;
    }
  }

  /*
    Page 4: "القيمه" escapes before hover/click can land.
    Customize SAFE_MARGIN to keep the button farther from the screen edges.
  */
  function setupTrickPage() {
    const ubichu = document.querySelector("#ubichu-choice");
    const runaway = document.querySelector("#game-choice");
    const SAFE_MARGIN = 18;

    if (ubichu) {
      ubichu.addEventListener("click", () => goToPage("page5.html"));
    }

    if (!runaway) {
      return;
    }

    /*
      Stops the click and moves the wrong answer before the pointer can settle.
    */
    const dodge = (event) => {
      event.preventDefault();
      moveRunawayButton(runaway, SAFE_MARGIN);
    };

    runaway.addEventListener("pointerenter", dodge);
    runaway.addEventListener("mouseenter", dodge);
    runaway.addEventListener("focus", dodge);
    runaway.addEventListener("pointerdown", dodge);
    runaway.addEventListener("touchstart", dodge, { passive: false });
    runaway.addEventListener("click", dodge);
  }

  /*
    Calculates a random fixed screen position while keeping the button visible.
  */
  function moveRunawayButton(button, margin) {
    const rect = button.getBoundingClientRect();
    const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
    const maxY = Math.max(margin, window.innerHeight - rect.height - margin);
    const x = randomBetween(margin, maxX);
    const y = randomBetween(margin, maxY);

    button.classList.add("is-running-away");
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
  }

  /*
    Returns a whole number between two values.
    Used for runaway button positions and heart burst distances.
  */
  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /*
    Page 5: moves to the final envelope.
  */
  function setupReactionPage() {
    const continueButton = document.querySelector("#reaction-continue");
    if (continueButton) {
      continueButton.addEventListener("click", () => goToPage("page6.html"));
    }
  }

  /*
    Page 6: opens the envelope, plays the special sound, and reveals the letter.
  */
  function setupEnvelopePage() {
    const envelope = document.querySelector("#pink-envelope");
    const letter = document.querySelector("#birthday-letter");

    if (!envelope || !letter) {
      return;
    }

    envelope.addEventListener("click", () => {
      if (envelope.classList.contains("is-open")) {
        return;
      }

      startBackgroundMusic();
      playSoundEffect(audio.envelope);
      window.setTimeout(() => playSoundEffect(audio.sparkle), 180);

      envelope.classList.add("is-open");
      envelope.setAttribute("aria-expanded", "true");
      createHeartBurst(envelope);

      window.setTimeout(() => {
        letter.hidden = false;
        letter.focus({ preventScroll: true });
      }, prefersReducedMotion ? 0 : 420);
    });
  }

  /*
    Lightweight cursor sparkles for desktop/pointer users.
    They are disabled for reduced motion users.
  */
  function setupCursorSparkles() {
    if (prefersReducedMotion) {
      return;
    }

    let lastSparkle = 0;

    document.addEventListener("pointermove", (event) => {
      const now = Date.now();
      if (now - lastSparkle < 95 || event.pointerType === "touch") {
        return;
      }

      lastSparkle = now;
      const sparkle = document.createElement("span");
      sparkle.className = "cursor-sparkle";
      sparkle.textContent = Math.random() > 0.5 ? "✦" : "♡";
      sparkle.style.left = `${event.clientX}px`;
      sparkle.style.top = `${event.clientY}px`;
      document.body.appendChild(sparkle);
      sparkle.addEventListener("animationend", () => sparkle.remove());
    });
  }

  /*
    Final-page celebration burst. Edit the symbols array to change the shapes.
  */
  function createHeartBurst(anchor) {
    if (prefersReducedMotion) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const symbols = ["♡", "♥", "✦", "☆"];

    for (let index = 0; index < 18; index += 1) {
      const heart = document.createElement("span");
      const angle = (Math.PI * 2 * index) / 18;
      const distance = randomBetween(58, 150);

      heart.className = "burst-heart";
      heart.textContent = symbols[index % symbols.length];
      heart.style.left = `${centerX}px`;
      heart.style.top = `${centerY}px`;
      heart.style.setProperty("--burst-x", `${Math.cos(angle) * distance}px`);
      heart.style.setProperty("--burst-y", `${Math.sin(angle) * distance}px`);

      document.body.appendChild(heart);
      heart.addEventListener("animationend", () => heart.remove());
    }
  }
})();
