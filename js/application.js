// Wait till the browser is ready to render the game (avoids glitches)
let jx06_GameManager
window.requestAnimationFrame(function () {
  jx06_GameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});
