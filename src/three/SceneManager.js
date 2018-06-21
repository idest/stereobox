import * as THREE from 'three';
//import { default as THREE } from './lib/three';
import OrbitControls from './lib/examples/OrbitControls';
import * as utils from './utils';
import GeneralLights from './scene_subjects/GeneralLights';
import Semisphere from './scene_subjects/Semisphere';
import Plane from './scene_subjects/Plane';
//import webglAvailable from './helpers/detector';

//THREE.OrbitControls = OrbitControls;

export default (canvas, initialProps, eventBus) => {
  const clock = new THREE.Clock();

  const screenDimensions = {
    width: canvas.width,
    height: canvas.height
  };

  const scene = buildScene();
  const renderer = buildRenderer(screenDimensions);
  const camera = buildCamera(screenDimensions);
  const controls = new OrbitControls(camera, renderer.domElement);
  const sceneSubjects = createSceneSubjects(scene, initialProps, eventBus);

  const origin = new THREE.Vector3(0, 0, 0);
  scene.add(utils.getPoints(origin, new THREE.Color(0xffffff)));

  eventBus.subscribe('resetCamera', resetControls(controls));

  function buildScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(initialProps.theme.bgColor);

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
    const fieldOfView = 50;
    const nearPlane = 1;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    camera.position.set(0, 6, 6);
    camera.lookAt(0, 0, 0);

    return camera;
  }

  function resetControls(controls) {
    return () => controls.reset();
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
    //const { width, height } = canvas;
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
