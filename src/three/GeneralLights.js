import * as THREE from 'three';

export default (scene, initialProps, eventBus) => {
  //const light = new THREE.PointLight('#2222ff', 1);
  //scene.add(light);
  scene.add(new THREE.AmbientLight(0x505050));
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.angle = Math.PI / 5;
  spotLight.penumbra = 0.2;
  spotLight.position.set(3, 3, 3);
  scene.add(spotLight);
  var dirLight = new THREE.DirectionalLight(0x55505a, 1);
  dirLight.position.set(0, 2, 0);
  scene.add(dirLight);

  function update(time) {
    //light.intensity = (Math.sin(time) + 1.5) / 1.5;
    //light.color.setHSL(Math.sin(time), 0.5, 0.5);
  }
  return {
    update
  };
};
