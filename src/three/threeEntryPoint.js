import SceneManager from './SceneManager';

export default (containerElement, initialProps, eventBus) => {
  const canvas = createCanvas(document, containerElement);
  const sceneManager = new SceneManager(canvas, initialProps, eventBus);

  bindEventListeners();
  render();

  function createCanvas(document, containerElement) {
    const canvas = document.createElement('canvas');
    canvas.style.cursor = 'grab';
    canvas.onmousedown = function() {
      this.style.cursor = 'grabbing';
    };
    containerElement.appendChild(canvas);
    canvas.onmouseup = function() {
      this.style.cursor = 'grab';
    };
    return canvas;
  }

  function bindEventListeners() {
    window.onresize = resizeCanvas;
    resizeCanvas();
  }

  function resizeCanvas() {
    //canvas.style.height = '100%';
    canvas.style.width = '100%';
    canvas.style.flex = 1;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    sceneManager.onWindowsResize();
  }

  function render(time) {
    requestAnimationFrame(render);
    sceneManager.update();
  }
};
