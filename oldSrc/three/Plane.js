import * as THREE from 'three';
import * as utils from './utils';

export default (scene, initialProps, eventBus) => {
  const { azimuth, dip, r1, r2 } = initialProps;

  const plane = new THREE.Group();
  const innerIntersection = getIntersection(r1, r2);
  const outerIntersection = getIntersection(r2, r2);
  let intersection = innerIntersection;
  plane.add(planeSurface());
  plane.add(intersection);
  scene.add(plane);

  plane.setRotationFromQuaternion(getOrientationQuaternion(azimuth, dip));

  const azIndicators = getAzimuthIndicators(r1, r2);
  scene.add(azIndicators);
  azIndicators.setRotationFromQuaternion(getOrientationQuaternion(azimuth));

  const dipIndicator = getDipIndicator(r1, r2);
  scene.add(dipIndicator);
  dipIndicator.setRotationFromQuaternion(
    getOrientationQuaternion(azimuth, dip)
  );

  eventBus.subscribe('propsUpdate', updateOrientation);
  eventBus.subscribe('toggleWireframe', toggleIntersectionLine);
  //0x448960

  function toggleIntersectionLine() {
    plane.remove(intersection);
    let newIntersection =
      intersection === innerIntersection
        ? outerIntersection
        : innerIntersection;
    intersection = newIntersection;
    plane.add(intersection);
  }

  function planeSurface() {
    const planeGeometry = new THREE.PlaneGeometry(3.5, 3.5, 16, 16);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const surface = new THREE.Mesh(planeGeometry, planeMaterial);
    surface.setRotationFromQuaternion(getInitialPlaneOrientation());
    return surface;
  }

  function getAzimuthIndicators(r1, r2) {
    const az = new THREE.Vector3(1, 0, 0);
    const azExt = new THREE.Vector3(-1, 0, 0);
    const dipDirection = new THREE.Vector3(0, 0, 1);

    const az1 = az.clone().multiplyScalar(0);
    const az2 = az.clone().multiplyScalar(r2 - 0.01);
    const azExt1 = azExt.clone().multiplyScalar(0);
    const azExt2 = azExt.clone().multiplyScalar(r2 - 0.01);
    const dipDirection1 = dipDirection.clone().multiplyScalar(0);
    const dipDirection2 = dipDirection.clone().multiplyScalar(r1 * 0.5);

    const azimuthLine = utils.getLine(az1, az2, new THREE.Color(0xff0000));
    const strikeLine = utils.getLine(azExt1, azExt2, new THREE.Color(0x0000ff));
    const dipDirectionLine = utils.getLine(
      dipDirection1,
      dipDirection2,
      new THREE.Color(0x00ff00)
    );

    const indicators = new THREE.Group();
    indicators.add(azimuthLine);
    indicators.add(strikeLine);
    indicators.add(dipDirectionLine);

    return indicators;
  }

  function getDipIndicator(r1, r2) {
    const dip = new THREE.Vector3(0, 0, 1);

    const dip1 = dip.clone().multiplyScalar(r1);
    const dip2 = dip.clone().multiplyScalar(0);

    const dipLine = utils.getLine(dip1, dip2, new THREE.Color(0xffff00));

    return dipLine;
  }

  function getIntersection(r1, r2) {
    const az = new THREE.Vector3(1, 0, 0);
    const azExt = new THREE.Vector3(-1, 0, 0);
    const az1 = az.clone().multiplyScalar(r1 - 0.01);
    const azExt1 = azExt.clone().multiplyScalar(r1 - 0.01);

    const planeNormal = new THREE.Vector3(0, 1, 0);
    const intersectionColor = new THREE.Color(0xffffff);
    const intersection = utils.getCurve(
      utils.createSphereArc(
        az1,
        azExt1.clone().applyAxisAngle(planeNormal, 0.01)
      ),
      { lineWidth: 0.05, color: intersectionColor }
    );
    return intersection;
  }

  function getInitialPlaneOrientation() {
    var initialQuaternion = new THREE.Quaternion();
    initialQuaternion.setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      utils.toRad(90)
    );
    return initialQuaternion;
  }

  function getOrientationQuaternion(az, dip) {
    //Plane orientation

    if (az !== undefined) {
      var azQuaternion = new THREE.Quaternion();
      azQuaternion.setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        utils.toRad(90 - az)
      );
    }
    if (dip !== undefined) {
      var dipQuaternion = new THREE.Quaternion();
      dipQuaternion.setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        utils.toRad(dip)
      );
    }

    if (az !== undefined && dip !== undefined) {
      var orientationQuaternion = new THREE.Quaternion();
      orientationQuaternion.multiplyQuaternions(azQuaternion, dipQuaternion);
    } else {
      orientationQuaternion = az !== undefined ? azQuaternion : dipQuaternion;
    }

    return orientationQuaternion;
  }

  function updateOrientation(updatedProps) {
    const { azimuth, dip } = updatedProps;
    plane.setRotationFromQuaternion(getOrientationQuaternion(azimuth, dip));
    azIndicators.setRotationFromQuaternion(getOrientationQuaternion(azimuth));
    dipIndicator.setRotationFromQuaternion(
      getOrientationQuaternion(azimuth, dip)
    );
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
