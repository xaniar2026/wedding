const opening = document.querySelector('#opening');
const main = document.querySelector('#main');
const soundButton = document.querySelector('#sound');
let audioContext, musicTimer, musicPlaying = false;

opening.addEventListener('click', () => {
  opening.classList.add('opened');
  document.body.classList.add('invitation-open');
  document.body.classList.remove('locked');
  main.removeAttribute('aria-hidden');
  setTimeout(() => opening.setAttribute('hidden', ''), 1500);
});

// A gentle, generated ambient chime avoids external audio files and starts only after a tap.
function startMusic() {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  audioContext.resume();
  const master = audioContext.createGain();
  master.gain.value = 0.045;
  master.connect(audioContext.destination);
  const notes = [261.63, 329.63, 392, 493.88, 392, 329.63];
  let step = 0;
  const playNote = () => {
    if (!musicPlaying) return;
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.value = notes[step++ % notes.length];
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.55, now + .08);
    gain.gain.exponentialRampToValueAtTime(.001, now + 1.8);
    osc.connect(gain).connect(master);
    osc.start(now); osc.stop(now + 1.9);
  };
  playNote();
  musicTimer = setInterval(playNote, 900);
}

soundButton.addEventListener('click', () => {
  musicPlaying = !musicPlaying;
  soundButton.classList.toggle('playing', musicPlaying);
  soundButton.setAttribute('aria-pressed', String(musicPlaying));
  soundButton.setAttribute('aria-label', musicPlaying ? 'Mute background music' : 'Play background music');
  if (musicPlaying) startMusic(); else clearInterval(musicTimer);
});

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
