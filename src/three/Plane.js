import * as THREE from 'three';
import * as utils from './utils';

export default (scene, initialProps, eventBus) => {
  const { azimuth, dip, r1, r2 } = initialProps;
  const plane = new THREE.Group();
  plane.add(planeSurface());
  plane.add(intersection(r1, r2));
  scene.add(plane);
  plane.setRotationFromQuaternion(getOrientationQuaternion(azimuth, dip));
  eventBus.subscribe('propsUpdate', updateOrientation);
  //0x448960
  function planeSurface() {
    const planeGeometry = new THREE.PlaneGeometry(3.5, 3.5, 16, 16);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    const surface = new THREE.Mesh(planeGeometry, planeMaterial);
    return surface;
  }

  function intersection(r1, r2) {
    const az = new THREE.Vector3(1, 0, 0);
    const za = new THREE.Vector3(-1, 0, 0);
    const az1 = az.clone().multiplyScalar(r1 - 0.01);
    const az2 = az.clone().multiplyScalar(r2 - 0.01);
    const za1 = za.clone().multiplyScalar(r1 - 0.01);
    const za2 = za.clone().multiplyScalar(r2 - 0.01);

    const planeNormal = new THREE.Vector3(0, 0, 1);
    const azimuthLine = utils.getLine(az1, az2, new THREE.Color(0xff0000));
    const strikeLine = utils.getLine(za1, za2, new THREE.Color(0x0000ff));
    const curve = utils.getCurve(
      utils.createSphereArc(
        az1,
        za1.clone().applyAxisAngle(planeNormal, -0.01)
      ),
      new THREE.Color(0xffffff)
    );
    const intersection = new THREE.Group();
    intersection.add(azimuthLine);
    intersection.add(strikeLine);
    intersection.add(curve);
    return intersection;
  }

  function getOrientationQuaternion(az, dip) {
    //Plane orientation
    const toRad = degrees => degrees / 180 * Math.PI;

    var initialQuaternion = new THREE.Quaternion();
    initialQuaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), toRad(90));

    var azQuaternion = new THREE.Quaternion();
    azQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), toRad(90 - az));

    var dipQuaternion = new THREE.Quaternion();
    dipQuaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), toRad(dip));

    var orientationQuaternion = new THREE.Quaternion();
    orientationQuaternion.multiplyQuaternions(azQuaternion, dipQuaternion);

    var finalQuaternion = new THREE.Quaternion();
    finalQuaternion.multiplyQuaternions(
      orientationQuaternion,
      initialQuaternion
    );

    return finalQuaternion;
  }

  function updateOrientation(updatedProps) {
    const { azimuth, dip } = updatedProps;
    plane.setRotationFromQuaternion(getOrientationQuaternion(azimuth, dip));
  }

  function update(time) {
    /*
    parameters.az = Math.sin(time / 3) * 360;
    parameters.dip = Math.abs(Math.sin(time / 2)) * 90;
    plane.setRotationFromQuaternion(
      getOrientationQuaternion(parameters.az, parameters.dip)
    );
    */
  }
  return {
    update
  };
};
