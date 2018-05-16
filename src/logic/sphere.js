import nj from 'numjs';
//var nj = require('numjs');

const toRadians = angle => angle * (Math.PI / 180);

const toDegrees = angle => angle * (180 / Math.PI);

const sph2cart = sphVector => {
  const lat = toRadians(sphVector[0]);
  const lon = toRadians(sphVector[1]);
  const x = Math.cos(lat) * Math.cos(lon);
  const y = Math.cos(lat) * Math.sin(lon);
  const z = Math.sin(lat);
  return nj.array([x, y, z]);
};

const cart2sph = cartVector => {
  const x = cartVector.get(0),
    y = cartVector.get(1),
    z = cartVector.get(2);
  const lat = Math.asin(z);
  const lon = Math.atan(y / x);
  return [toDegrees(lat), toDegrees(lon)];
};

const rot = (eulerCartVector, w) => {
  const cw = Math.cos(toRadians(w)),
    sw = Math.sin(toRadians(w)),
    wp = 1 - cw,
    ex = eulerCartVector.get(0),
    ey = eulerCartVector.get(1),
    ez = eulerCartVector.get(2),
    r11 = ex * ex * wp + cw,
    r12 = ex * ey * wp - ez * sw,
    r13 = ex * ez * wp + ey * sw,
    r21 = ey * ex * wp + ez * sw,
    r22 = ey * ey * wp + cw,
    r23 = ey * ez * wp - ex * sw,
    r31 = ez * ex * wp - ey * sw,
    r32 = ez * ey * wp + ex * sw,
    r33 = ez * ez * wp + cw;
  return nj.array([[r11, r12, r13], [r21, r22, r23], [r31, r32, r33]]);
};

const rotateSph = (posSphVector, eulerSphVector, w) => {
  const rotation = rot(sph2cart(eulerSphVector), w);
  const rotated = nj.dot(rotation, sph2cart(posSphVector));
  const rotatedSph = cart2sph(rotated);
  return rotatedSph;
};

export { sph2cart, cart2sph, rot, rotateSph };
