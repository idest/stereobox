import * as THREE from 'three';
import * as utils from '../utils';

export default (scene, initialProps, eventBus) => {
  let currentProps = initialProps;
  const { azimuth, dip, r1, r2, planeOpacity } = initialProps;
  const plane = new THREE.Group();
  const innerIntersection = getIntersection(r1, r2);
  const outerIntersection = getIntersection(r2, r2);
  const rectangularPlaneSurface = planeSurfaceRectangular(planeOpacity);
  const circularPlaneSurface = planeSurfaceCircular(r2, planeOpacity);
  let intersection = initialProps.sphereWireframe
    ? outerIntersection
    : innerIntersection;
  let planeSurface = initialProps.planeTrim
    ? circularPlaneSurface
    : rectangularPlaneSurface;
  plane.add(planeSurface);
  plane.add(intersection);
  scene.add(plane);

  plane.setRotationFromQuaternion(getOrientationQuaternion(azimuth, dip));

  const azIndicators = getAzimuthIndicators(r1, r2);
  azIndicators.setRotationFromQuaternion(getOrientationQuaternion(azimuth));
  const dipIndicator = getDipIndicator(r1, r2);
  dipIndicator.setRotationFromQuaternion(
    getOrientationQuaternion(azimuth, dip)
  );
  const poleIndicator = getPoleIndicator(r1, r2);
  poleIndicator.setRotationFromQuaternion(
    getOrientationQuaternion(azimuth + 180, 90 - dip)
  );
  if (initialProps.showIndicators === true) {
    scene.add(azIndicators);
    scene.add(dipIndicator);
    scene.add(poleIndicator);
  }

  eventBus.subscribe('propsUpdate', propsUpdateHandler);
  //0x448960

  function propsUpdateHandler(updatedProps) {
    if (
      currentProps.dip !== updatedProps.dip ||
      currentProps.azimuth !== updatedProps.azimuth
    ) {
      updateOrientation(updatedProps.azimuth, updatedProps.dip);
    }
    if (currentProps.planeTrim !== updatedProps.planeTrim) {
      trimPlane(updatedProps.planeTrim);
    }
    if (currentProps.planeOpacity !== updatedProps.planeOpacity) {
      changePlaneOpacity(updatedProps.planeOpacity);
    }
    if (currentProps.sphereWireframe !== updatedProps.sphereWireframe) {
      toggleIntersectionLine(updatedProps.sphereWireframe);
    }
    if (currentProps.showIndicators !== updatedProps.showIndicators) {
      toggleIndicators(updatedProps.showIndicators);
    }
    currentProps = updatedProps;
  }

  function updateOrientation(azimuth, dip) {
    plane.setRotationFromQuaternion(getOrientationQuaternion(azimuth, dip));
    azIndicators.setRotationFromQuaternion(getOrientationQuaternion(azimuth));
    dipIndicator.setRotationFromQuaternion(
      getOrientationQuaternion(azimuth, dip)
    );
    poleIndicator.setRotationFromQuaternion(
      getOrientationQuaternion(azimuth + 180, 90 - dip)
    );
  }

  function trimPlane(boolean) {
    plane.remove(planeSurface);
    let newPlaneSurface =
      boolean === true ? circularPlaneSurface : rectangularPlaneSurface;
    planeSurface = newPlaneSurface;
    plane.add(planeSurface);
  }

  function changePlaneOpacity(planeOpacity) {
    circularPlaneSurface.children[0].material.opacity = planeOpacity;
    rectangularPlaneSurface.children[0].material.opacity = planeOpacity;
  }

  function toggleIntersectionLine(boolean) {
    plane.remove(intersection);
    let newIntersection =
      boolean === true ? outerIntersection : innerIntersection;
    intersection = newIntersection;
    plane.add(intersection);
  }

  function toggleIndicators(boolean) {
    if (boolean === true) {
      scene.add(azIndicators);
      scene.add(dipIndicator);
      scene.add(poleIndicator);
    } else {
      scene.remove(azIndicators);
      scene.remove(dipIndicator);
      scene.remove(poleIndicator);
    }
  }

  function planeSurfaceRectangular(planeOpacity) {
    const planeGeometry = new THREE.PlaneGeometry(3.5, 3.5, 16, 16);
    const planeMaterial = new THREE.MeshDepthMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      opacity: planeOpacity
    });
    const planeSurface = new THREE.Mesh(planeGeometry, planeMaterial);
    const vertex1 = new THREE.Vector3(1.75, 1.75, 0);
    const vertex2 = new THREE.Vector3(1.75, -1.75, 0);
    const vertex3 = new THREE.Vector3(-1.75, -1.75, 0);
    const vertex4 = new THREE.Vector3(-1.75, 1.75, 0);
    const planeOutline = utils.getLine(
      [vertex1, vertex2, vertex3, vertex4],
      {
        color: initialProps.theme.fgColorD20,
        linewidth: 1.5
      },
      true
    );
    const surface = new THREE.Group();
    surface.add(planeSurface);
    surface.add(planeOutline);
    surface.setRotationFromQuaternion(getInitialPlaneOrientation());
    return surface;
  }

  function planeSurfaceCircular(r2, planeOpacity) {
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    const planeGeometry = new THREE.CircleGeometry(r2 - 0.01, 128);
    const planeMaterial = new THREE.MeshDepthMaterial({
      side: THREE.DoubleSide,
      clippingPlanes: [clippingPlane],
      transparent: true,
      opacity: planeOpacity
    });
    const surface = new THREE.Group();
    const planeSurface = new THREE.Mesh(planeGeometry, planeMaterial);
    const az = new THREE.Vector3(1, 0, 0);
    const azExt = new THREE.Vector3(-1, 0, 0);
    const p1 = az.clone().multiplyScalar(r2 - 0.01);
    const p2 = azExt.clone().multiplyScalar(r2 - 0.01);
    const topOutline = utils.getLine([p1, p2], {
      color: new THREE.Color(initialProps.theme.fgColorD20),
      linewidth: 2,
      dashed: false
    });
    surface.add(planeSurface);
    surface.add(topOutline);
    surface.setRotationFromQuaternion(getInitialPlaneOrientation());
    return surface;
  }

  function getAzimuthIndicators(r1, r2) {
    const az = new THREE.Vector3(1, 0, 0);
    const azExt = new THREE.Vector3(-1, 0, 0);
    const dipDirection = new THREE.Vector3(0, 0, 1);

    const az1 = az.clone().multiplyScalar(0);
    //const az2 = az.clone().multiplyScalar(r2 - 0.01);
    const az2 = az.clone().multiplyScalar(r1 - 0.01);
    //
    const az3 = az.clone().multiplyScalar(r2 - 0.01);
    const azExt1 = azExt.clone().multiplyScalar(0);
    //const azExt2 = azExt.clone().multiplyScalar(r2 - 0.01);
    const azExt2 = azExt.clone().multiplyScalar(r1 - 0.01);
    //
    const azExt3 = azExt.clone().multiplyScalar(r2 - 0.01);
    const dipDirection1 = dipDirection.clone().multiplyScalar(0);
    const dipDirection2 = dipDirection.clone().multiplyScalar(r1 * 0.5);
    //
    const dipDirection3 = dipDirection.clone().multiplyScalar(r2 - 0.01);

    const azimuthLine = utils.getLine([az1, az2], {
      color: new THREE.Color(initialProps.theme.azColorD5),
      linewidth: 4,
      dashed: false
    });
    const strikeLine = utils.getLine([azExt1, azExt2], {
      color: new THREE.Color(initialProps.theme.azExtColorD5),
      linewidth: 4,
      dashed: false
    });
    const dipDirectionLine = utils.getLine([dipDirection1, dipDirection2], {
      color: new THREE.Color(initialProps.theme.dipDirectionColorD5),
      linewidth: 4,
      dashed: false
    });
    const azimuthPoint = utils.getSpheres([az3], {
      r: 0.06,
      color: new THREE.Color(initialProps.theme.azColor)
    });
    const strikePoint = utils.getSpheres([azExt3], {
      r: 0.06,
      color: new THREE.Color(initialProps.theme.azExtColor)
    });
    const dipDirectionPoint = utils.getSpheres([dipDirection3], {
      r: 0.06,
      color: new THREE.Color(initialProps.theme.dipDirectionColor)
    });

    const indicators = new THREE.Group();
    indicators.add(azimuthLine);
    indicators.add(strikeLine);
    indicators.add(dipDirectionLine);
    indicators.add(azimuthPoint);
    indicators.add(strikePoint);
    indicators.add(dipDirectionPoint);
    indicators.position.y += 0.02;
    return indicators;
  }

  function getDipIndicator(r1, r2) {
    const dip = new THREE.Vector3(0, 0, 1);

    const dip1 = dip.clone().multiplyScalar(r1);
    const dip2 = dip.clone().multiplyScalar(0);
    //
    const dip3 = dip.clone().multiplyScalar(r2 + 0.01);

    const dipLine = utils.getLine([dip1, dip2], {
      color: new THREE.Color(initialProps.theme.dipColorD5),
      linewidth: 4,
      dashed: false
    });
    const dipPoint = utils.getSpheres([dip3], {
      r: 0.06,
      color: new THREE.Color(initialProps.theme.dipColor)
    });
    const dipIndicators = new THREE.Group();
    dipIndicators.add(dipLine);
    dipIndicators.add(dipPoint);

    return dipIndicators;
  }

  function getPoleIndicator(r1, r2) {
    const pole = new THREE.Vector3(0, 0, 1);

    const pole1 = pole.clone().multiplyScalar(r1);
    const pole2 = pole.clone().multiplyScalar(0);
    //
    const pole3 = pole.clone().multiplyScalar(r2 + 0.01);

    const poleLine = utils.getLine([pole1, pole2], {
      color: new THREE.Color(initialProps.theme.fgColorD20),
      linewidth: 1.5,
      dashed: true
    });
    const polePoint = utils.getSpheres([pole3], {
      r: 0.06,
      color: new THREE.Color(initialProps.theme.fgColor)
    });
    const poleIndicators = new THREE.Group();
    poleIndicators.add(poleLine);
    poleIndicators.add(polePoint);

    return poleIndicators;
  }

  function getIntersection(r1, r2) {
    const az = new THREE.Vector3(1, 0, 0);
    const azExt = new THREE.Vector3(-1, 0, 0);
    const az1 = az.clone().multiplyScalar(r1 - 0.01);
    const azExt1 = azExt.clone().multiplyScalar(r1 - 0.01);

    const planeNormal = new THREE.Vector3(0, 1, 0);
    const intersectionColor = new THREE.Color(initialProps.theme.fgColorD20);
    const intersection = utils.getCurve(
      utils.createSphereArc(
        az1.clone().applyAxisAngle(planeNormal, -0.02),
        azExt1.clone().applyAxisAngle(planeNormal, 0.02)
      ),
      { linewidth: 3, color: intersectionColor }
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

  function update(time) {
    //azIndicators.children[0].material.resolution.set(width, height);
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
