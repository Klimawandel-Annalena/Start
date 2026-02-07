// =========================
// Carousel Setup
// =========================
const carousel = document.querySelector('.carousel');
const carouselItems = document.querySelectorAll('.carousel-item');
const leftBtn = document.querySelector('.nav-btn.left');
const rightBtn = document.querySelector('.nav-btn.right');
const contentSections = document.querySelectorAll('.content section');

// CSS-Variablen auslesen
const rootStyles = getComputedStyle(document.documentElement);
const buttonWidth = parseInt(rootStyles.getPropertyValue('--button-width'));
const buttonMargin = parseInt(rootStyles.getPropertyValue('--button-margin'));
const visibleItems = 3; // Anzahl sichtbar
const totalItems = carouselItems.length;

// Maximaler Scroll
const maxShift = (totalItems - visibleItems) * (buttonWidth + buttonMargin);

let currentShift = 0;
let scrollDirection = 0;
let speed = 10;
let animating = false;

// =========================
// Initial Scroll / Einrückung
// =========================
const startOffset = 50; // leicht nach links eingerückt
currentShift = startOffset;
carousel.style.transform = `translateX(${-currentShift}px)`;
updateArrowVisibility();

// =========================
// Animation / Scroll
// =========================
function animateScroll() {
  if (scrollDirection !== 0) {
    currentShift += speed * scrollDirection;

    if (currentShift < 0) currentShift = 0;
    if (currentShift > maxShift) currentShift = maxShift;

    carousel.style.transform = `translateX(${-currentShift}px)`;
    updateArrowVisibility();

    requestAnimationFrame(animateScroll);
  } else {
    animating = false;
  }
}

function startScroll(direction) {
  scrollDirection = direction;
  if (!animating) {
    animating = true;
    requestAnimationFrame(animateScroll);
  }
}

function stopScroll() {
  scrollDirection = 0;
}

// Pfeil-Events
leftBtn.addEventListener('mouseover', () => startScroll(-1));
leftBtn.addEventListener('mouseout', stopScroll);
rightBtn.addEventListener('mouseover', () => startScroll(1));
rightBtn.addEventListener('mouseout', stopScroll);

// =========================
// Touch / Swipe Mobile
// =========================
let startX = 0;
let isDragging = false;

carousel.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

carousel.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const moveX = e.touches[0].clientX;
  const diff = startX - moveX;

  if (diff > 30 && currentShift < maxShift) { 
    currentShift += 5;
    if (currentShift > maxShift) currentShift = maxShift;
    carousel.style.transform = `translateX(${-currentShift}px)`;
    startX = moveX;
  } else if (diff < -30 && currentShift > 0) { 
    currentShift -= 5;
    if (currentShift < 0) currentShift = 0;
    carousel.style.transform = `translateX(${-currentShift}px)`;
    startX = moveX;
  }
});

carousel.addEventListener('touchend', () => {
  isDragging = false;
});

// =========================
// Pfeile sichtbar / hidden
// =========================
function updateArrowVisibility() {
  if (currentShift <= 0) {
    leftBtn.classList.add('hidden');
  } else {
    leftBtn.classList.remove('hidden');
  }

  if (currentShift >= maxShift) {
    rightBtn.classList.add('hidden');
  } else {
    rightBtn.classList.remove('hidden');
  }
}

// =========================
// Inhalte wechseln beim Klick
// =========================
carouselItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    // Aktive Buttons zurücksetzen
    carouselItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Alle Inhalte langsam ausblenden
    contentSections.forEach(section => {
      section.classList.remove('active');
    });

    // Aktive Section einblenden mit Fade
    if(contentSections[index]) {
      setTimeout(() => {
        contentSections[index].classList.add('active');
      }, 50); // kleines Delay, damit transition greift
    }
  });
});

// =========================
// Initial aktiver Button + Inhalt
// =========================
carouselItems[0].classList.add('active');
if(contentSections[0]) contentSections[0].classList.add('active');
