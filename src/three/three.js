import * as THREE from 'three';
console.log('Vecto3', THREE.Vector3(0, 0, 0));
global.THREE = THREE;

require('three/examples/js/controls/OrbitControls');
//require('three/examples/js/loaders/OBJLoader');
//
//require('three/examples/js/postprocessing/EffectComposer');
//require('three/examples/js/postprocessing/RenderPass');
//require('three/examples/js/postprocessing/ShaderPass');
//require('three/examples/js/postprocessing/BloomPass');
//
//require('three/examples/js/shaders/FXAAShader');
//require('three/examples/js/shaders/CopyShader');
//require('three/examples/js/shaders/ConvolutionShader');
//
//require('three.ar.js');
//require('./VRControls');

module.exports = global.THREE;
