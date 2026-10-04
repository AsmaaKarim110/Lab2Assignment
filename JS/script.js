/* ============================================================
   script.js
   Each function below is complete and self-contained.
   None of them run on their own — they are invoked from a
   <script> element in index.html after the DOM has loaded.
   ============================================================ */

/* ---------- TIME: live digital clock ---------- */
function initClock() {
  const clockEl = document.getElementById('clock');

  function tick() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    clockEl.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  tick();
  setInterval(tick, 1000);
}

/* ---------- TIME: greeting + mood set from the current hour ---------- */
function initGreeting() {
  const greetingEl = document.getElementById('greeting');
  const heroEl = document.getElementById('hero');
  const hour = new Date().getHours();

  let message;
  if (hour < 5) {
    message = 'Quiet hours at the station';
  } else if (hour < 12) {
    message = 'Good morning — signal is strong';
  } else if (hour < 18) {
    message = 'Good afternoon — all systems nominal';
  } else {
    message = 'Good evening — switching to low-light mode';
  }

  greetingEl.textContent = message;
  heroEl.dataset.timeOfDay = hour < 6 || hour >= 20 ? 'night' : 'day';
}

/* ---------- MOUSE: spotlight that follows the cursor ---------- */
function initSpotlight() {
  const hero = document.getElementById('hero');

  hero.addEventListener('mousemove', function (event) {
    const rect = hero.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    hero.style.setProperty('--spot-x', `${x}px`);
    hero.style.setProperty('--spot-y', `${y}px`);
  });

  hero.addEventListener('mouseleave', function () {
    hero.style.setProperty('--spot-x', '50%');
    hero.style.setProperty('--spot-y', '50%');
  });
}

/* ---------- MOUSE / TOUCH: click toggles the color theme ---------- */
function initThemeToggle() {
  const button = document.getElementById('theme-toggle');

  button.addEventListener('click', function () {
    document.body.classList.toggle('deep-mode');
    const isDeep = document.body.classList.contains('deep-mode');
    button.textContent = isDeep ? '☀ Surface Mode' : '🌙 Deep Mode';
  });
}

/* ---------- WINDOW (BOM): live viewport size + responsive class ---------- */
function initResizeReadout() {
  const readout = document.getElementById('size-readout');

  function update() {
    readout.textContent = `${window.innerWidth} × ${window.innerHeight}px`;
    document.body.classList.toggle('compact', window.innerWidth < 640);
  }

  update();
  window.addEventListener('resize', update);
}

/* ---------- WINDOW: header shrinks once the page is scrolled ---------- */
function initScrollHeader() {
  const header = document.getElementById('site-header');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }
  });
}

/* ---------- KEYBOARD + TOUCH: page through the station log ---------- */
function initLogNavigation() {
  const entries = Array.from(document.querySelectorAll('.log-entry'));
  const dotsWrap = document.getElementById('log-dots');
  let index = 0;

  // Build one indicator dot per log entry
  entries.forEach(function (_, i) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function showEntry(newIndex) {
    entries[index].classList.remove('active');
    dots[index].classList.remove('active');
    index = (newIndex + entries.length) % entries.length;
    entries[index].classList.add('active');
    dots[index].classList.add('active');
  }

  // Keyboard: left / right arrow keys
  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') showEntry(index + 1);
    if (event.key === 'ArrowLeft') showEntry(index - 1);
  });

  // Touch: swipe left / right across the carousel
  const carousel = document.getElementById('log-carousel');
  let touchStartX = 0;

  carousel.addEventListener('touchstart', function (event) {
    touchStartX = event.changedTouches[0].clientX;
  });

  carousel.addEventListener('touchend', function (event) {
    const touchEndX = event.changedTouches[0].clientX;
    const distance = touchEndX - touchStartX;
    const SWIPE_THRESHOLD = 40;

    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      distance < 0 ? showEntry(index + 1) : showEntry(index - 1);
    }
  });
}