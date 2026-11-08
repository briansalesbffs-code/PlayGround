(function(){
  const continueButton = document.getElementById('btnContinue');
  try {
    continueButton.classList.toggle('hidden', !localStorage.getItem('nevoa-save'));
  } catch (error) {
    continueButton.classList.add('hidden');
  }
  window.NevSprites.draw(document.getElementById('logoCreature'), 'lumito', 1.14);
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
})();
