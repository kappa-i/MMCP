function disableScroll() {
  document.body.style.overflow = 'hidden';
  document.addEventListener('touchmove', preventDefault, { passive: false });
  document.addEventListener('wheel', preventDefault, { passive: false });
}

function enableScroll() {
  document.body.style.overflow = '';
  document.removeEventListener('touchmove', preventDefault);
  document.removeEventListener('wheel', preventDefault);
}

function preventDefault(e) {
  e.preventDefault();
}
