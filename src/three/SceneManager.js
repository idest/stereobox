import * as THREE from 'three';
import GeneralLights from './GeneralLights';
import Semisphere from './Semisphere';
import Plane from './Plane';
import * as utils from './utils';
import * as dat from 'dat.gui';

export default (canvas, initialProps, eventBus) => {
  const clock = new THREE.Clock();

  const screenDimensions = {
    width: canvas.width,
    height: canvas.height
  };

  const scene = buildScene();
  const renderer = buildRenderer(screenDimensions);
  const camera = buildCamera(screenDimensions);
  const gui = buildGUI({ camera });
  const sceneSubjects = createSceneSubjects(scene, initialProps, eventBus);

  const origin = new THREE.Vector3(0, 0, 0);
  scene.add(utils.getPoints(origin, new THREE.Color(0xffffff)));

  function buildScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000');

    return scene;
  }

  function buildRenderer({ width, height }) {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);

    renderer.localClippingEnabled = true;

    //renderer.gammaInput = true;
    //renderer.gammaOutput = true;

    return renderer;
  }

  function buildCamera({ width, height }) {
    const aspectRatio = width / height;
    const fieldOfView = 45;
    const nearPlane = 1;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );
    camera.position.set(0, 5, 7.5);
    camera.lookAt(0, 0, 0);

    return camera;
  }

  function buildGUI(components) {
    const { camera } = components;
    let x = camera.position.x;
    let y = camera.position.y;
    let z = camera.position.z;
    const initialXRot = Math.asin(x / z) / Math.PI * 180;
    const initialYRot = Math.asin(y / z) / Math.PI * 180;
    const parameters = {
      cameraXRot: initialXRot,
      cameraYRot: initialYRot,
      resetCamera: () => {
        camera.position.set(x, y, z);
        parameters.cameraXRot = initialXRot;
        parameters.cameraYRot = initialYRot;
        camera.lookAt(0, 0, 0);
      }
    };
    const gui = new dat.GUI();
    gui.add(parameters, 'resetCamera');
    /*
    gui
      .add(parameters, 'cameraXRot', -180, 180)
      .name('H. Angle')
      .onChange(v => {
        const rotAngle = v / 180 * Math.PI;
        camera.position.x = 0 * Math.cos(rotAngle) + z * Math.sin(rotAngle);
        camera.position.z = z * Math.cos(rotAngle) - 0 * Math.sin(rotAngle);
        //missing y parameter when y != 0
        camera.lookAt(0, 0, 0);
      })
      .listen();
    */
    gui
      .add(parameters, 'cameraYRot', -90, 90)
      .name('V. Angle')
      .onChange(v => {
        const rotAngle = (v - initialYRot) / 180 * Math.PI;
        camera.position.y = y * Math.cos(rotAngle) + z * Math.sin(rotAngle);
        camera.position.z = z * Math.cos(rotAngle) - y * Math.sin(rotAngle);
        //missing z parameter when z != 0
        camera.lookAt(0, 0, 0);
      })
      .listen();
    return parameters;
  }

  function createSceneSubjects(scene, initialProps, eventBus) {
    const sceneSubjects = [
      new GeneralLights(scene, initialProps, eventBus),
      new Semisphere(scene, initialProps, eventBus),
      new Plane(scene, initialProps, eventBus)
    ]; //, new SceneSubject(scene)];

    return sceneSubjects;
  }

  function update() {
    const elapsedTime = clock.getElapsedTime();

    for (let i = 0; i < sceneSubjects.length; i++) {
      sceneSubjects[i].update(elapsedTime);
    }

    renderer.render(scene, camera);
  }

  function onWindowsResize() {
    const { width, height } = canvas;

    screenDimensions.width = width;
    screenDimensions.height = height;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  return {
    update,
    onWindowsResize
  };
};
