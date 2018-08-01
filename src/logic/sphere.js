import nj from 'numjs';
//var nj = require('numjs');

//order of spherical coordinates: [longitude, latitude]

const toRadians = angle => angle * (Math.PI / 180);

const toDegrees = angle => angle * (180 / Math.PI);

const sph2cart = sphVector => {
  const lon = toRadians(sphVector[0]);
  const lat = toRadians(sphVector[1]);
  const x = Math.cos(lat) * Math.cos(lon);
  const y = Math.cos(lat) * Math.sin(lon);
  const z = Math.sin(lat);
  return nj.array([x, y, z]);
};

const cart2sph = cartVector => {
  const x = cartVector.get(0),
    y = cartVector.get(1),
    z = cartVector.get(2);
  //atan2 is necessaty when -pi < lon < pi to get the appropiaete signs
  const lon = Math.atan2(y, x);
  //TODO: figure out the difference between these two methods for calculating
  //latitude, second one always works when transforming a vector calculated
  //using cross product, first one doesn't
  //const lat = Math.asin(z); // this one doesn't always work
  const lat = Math.atan(z / Math.sqrt(x ** 2 + y ** 2)); //this one does
  return [toDegrees(lon), toDegrees(lat)];
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

const cross = (cartVectorA, cartVectorB) => {
  const [a1, a2, a3] = cartVectorA.tolist();
  const [b1, b2, b3] = cartVectorB.tolist();
  const x = a2 * b3 - a3 * b2;
  const y = a3 * b1 - a1 * b3;
  const z = a1 * b2 - a2 * b1;
  return nj.array([x, y, z]);
};

const haversine = (sphVector1, sphVector2) => {
  //Distancia entre 2 puntos en la superficie terrestre
  const lon1 = toRadians(sphVector1[0]),
    lat1 = toRadians(sphVector1[1]),
    lon2 = toRadians(sphVector2[0]),
    lat2 = toRadians(sphVector2[1]);

  //haversine formula
  const dlon = lon2 - lon1,
    dlat = lat2 - lat1,
    a =
      Math.sin(dlat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2,
    c = 2 * Math.asin(Math.sqrt(a));
  return toDegrees(c);
};

export { sph2cart, cart2sph, rot, rotateSph, cross, haversine };
