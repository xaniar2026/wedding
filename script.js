const opening = document.querySelector('#opening');
const main = document.querySelector('#main');
const soundButton = document.querySelector('#sound');
const backgroundMusic = document.getElementById('background-music');

function updateMusicButton() {
  const isPlaying = !backgroundMusic.paused;
  soundButton.classList.toggle('playing', isPlaying);
  soundButton.setAttribute('aria-pressed', String(isPlaying));
  soundButton.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
}

opening.addEventListener('click', () => {
  opening.classList.add('opened');
  document.body.classList.add('invitation-open');
  document.body.classList.remove('locked');
  main.removeAttribute('aria-hidden');
  backgroundMusic.play().catch(error => {
    console.log('Audio playback requires user interaction:', error);
    updateMusicButton();
  });
  setTimeout(() => opening.setAttribute('hidden', ''), 1500);
});

soundButton.addEventListener('click', () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play().catch(error => {
      console.log('Audio playback requires user interaction:', error);
      updateMusicButton();
    });
  } else {
    backgroundMusic.pause();
  }
});

backgroundMusic.addEventListener('play', updateMusicButton);
backgroundMusic.addEventListener('pause', updateMusicButton);

const targetDate = new Date('2026-09-30T16:30:00Z');
const countEls = ['days', 'hours', 'minutes', 'seconds'].map(id => document.getElementById(id));
const countGrid = document.querySelector('.count-grid');
let countdownTimer;
function updateCountdown() {
  const distance = Math.max(0, targetDate.getTime() - new Date().getTime());
  const values = [Math.floor(distance / 86400000), Math.floor(distance / 3600000) % 24, Math.floor(distance / 60000) % 60, Math.floor(distance / 1000) % 60];
  values.forEach((value, i) => countEls[i].textContent = String(value).padStart(i ? 2 : 3, '0'));
  if (distance === 0) {
    clearInterval(countdownTimer);
    countGrid.innerHTML = '<p class="section-subtitle" style="grid-column:1/-1;margin:0">The special day has arrived!</p>';
  }
}
updateCountdown();
if (targetDate.getTime() > new Date().getTime()) countdownTimer = setInterval(updateCountdown, 1000);

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('.faq-item button').forEach(button => button.addEventListener('click', () => {
  const item = button.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(open => { open.classList.remove('open'); open.querySelector('button').setAttribute('aria-expanded', 'false'); });
  if (!wasOpen) { item.classList.add('open'); button.setAttribute('aria-expanded', 'true'); }
}));

const toTop = document.querySelector('#to-top');
window.addEventListener('scroll', () => toTop.classList.toggle('visible', scrollY > innerHeight), { passive: true });
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

