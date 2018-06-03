export default function webglAvailable() {
  try {
    var canvas = document.createElement('canvas');
    return (
      !!window.webGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}
