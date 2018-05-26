import * as THREE from 'three';
import * as utils from './utils';
import helvetikerFont from './static/helvetiker_regular.typeface.json';

export default (scene, initialProps, eventBus) => {
  const { r1, r2 } = initialProps;
  scene.add(semisphere(r1, r2));
  scene.add(axes(r2));
  //0x4d6691
  //0x486087
  function semisphere(r1, r2) {
    // Clipping Plane
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    // innerSphere
    const innerSphereGeometry = new THREE.SphereGeometry(r1, 32, 32);
    const innerSphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x474448,
      clippingPlanes: [clippingPlane],
      side: THREE.DoubleSide
    });
    const innerSphere = new THREE.Mesh(
      innerSphereGeometry,
      innerSphereMaterial
    );
    // outerSphere
    const outerSphereGeometry = new THREE.SphereGeometry(r2, 32, 32);
    const outerSphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x474448,
      clippingPlanes: [clippingPlane]
    });
    const outerSphere = new THREE.Mesh(
      outerSphereGeometry,
      outerSphereMaterial
    );
    // horizontalRing
    const ringGeometry = new THREE.RingGeometry(r1 - 0.01, r2 + 0.01, 64);
    const ringMaterial = new THREE.MeshLambertMaterial({
      color: 0x474448,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    // Meshes
    const semisphere = new THREE.Group();
    semisphere.add(innerSphere, ring, outerSphere);
    return semisphere;
  }
  function axes(r) {
    const axes = new THREE.Group();
    const N = new THREE.Vector3(0, 0, -1);
    const E = new THREE.Vector3(1, 0, 0);
    const S = new THREE.Vector3(0, 0, 1);
    const W = new THREE.Vector3(-1, 0, 0);
    const cardinalPoints = {
      text: ['N', 'E', 'S', 'W'],
      axes: [N, E, S, W]
    };
    const font = new THREE.Font(helvetikerFont);
    for (let i = 0; i < cardinalPoints.text.length; i++) {
      const labelGeometry = new THREE.TextGeometry(cardinalPoints.text[i], {
        font: font,
        size: 0.3,
        height: 0.01,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.005,
        bevelSegments: 5
      }).center();
      const labelMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff
      });
      const axisLabel = new THREE.Mesh(labelGeometry, labelMaterial);
      axisLabel.translateOnAxis(cardinalPoints.axes[i], r + 0.35);
      axisLabel.rotation.x = -Math.PI / 2;
      const axisLine = utils.getLine(
        cardinalPoints.axes[i].clone().multiplyScalar(r),
        cardinalPoints.axes[i].clone().multiplyScalar(r + 0.1),
        new THREE.Color(0xffffff)
      );
      axes.add(axisLabel, axisLine);
    }
    return axes;
  }
  function update() {}
  return {
    update
  };
};
