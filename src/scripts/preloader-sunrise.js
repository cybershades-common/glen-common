// Figma Preloader Sunrise Animation JS
window.addEventListener('DOMContentLoaded', function() {
  var preloader = document.getElementById('preloader');
  if (!preloader) return;
  // Hide preloader after 2.8s (animation duration)
  setTimeout(function() {
    preloader.style.opacity = '0';
    preloader.style.pointerEvents = 'none';
    setTimeout(function() {
      preloader.style.display = 'none';
    }, 400);
  }, 2800);
});
