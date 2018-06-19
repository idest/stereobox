import * as THREE from 'three';
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

require('three/examples/js/lines/LineSegmentsGeometry');
require('three/examples/js/lines/LineGeometry');
require('three/examples/js/lines/WireframeGeometry2');
require('three/examples/js/lines/LineMaterial');
require('three/examples/js/lines/LineSegments2');
require('three/examples/js/lines/Line2');
require('three/examples/js/lines/Wireframe');

export default global.THREE;
