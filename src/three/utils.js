import * as THREE from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';

export function greatCircleFunction(P, Q) {
  var angle = P.angleTo(Q);
  return function(t) {
    var X = new THREE.Vector3()
      .addVectors(
        P.clone().multiplyScalar(Math.sin((1 - t) * angle)),
        Q.clone().multiplyScalar(Math.sin(t * angle))
      )
      .divideScalar(Math.sin(angle));
    return X;
  };
}

export function createSphereArc(P, Q) {
  var sphereArc = new THREE.Curve();
  sphereArc.getPoint = greatCircleFunction(P, Q);
  return sphereArc;
}

export function getCurve(curve, parameters) {
  var geometry = new THREE.Geometry();
  geometry.vertices = curve.getPoints(100);
  var line = new MeshLine();
  line.setGeometry(geometry);
  var material = new MeshLineMaterial(parameters);
  return new THREE.Mesh(line.geometry, material);
}

export function getLine(P, Q, color, dashed) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(P, Q);
  var line = new MeshLine();
  line.setGeometry(geometry);
  var material = new MeshLineMaterial({
    lineWidth: 0.05,
    color: color
  });
  return new THREE.Mesh(line.geometry, material);
}

export function getPoints(points, color) {
  var geometry = new THREE.Geometry();
  for (let i = 0; i < points.length; i++) {
    geometry.vertices.push(points[i]);
  }
  var material = new THREE.PointsMaterial({
    color: color,
    size: 0.05
  });
  return new THREE.Points(geometry, material);
}

export function drawCircle(radius, parameters) {
  let geometry, material, meshLine;
  geometry = new THREE.Geometry();
  for (let i = 0, v; i < 2 * Math.PI; i += 2 * Math.PI / 100) {
    console.log(i);
    v = new THREE.Vector3(radius * Math.cos(i), 0, radius * Math.sin(i));
    geometry.vertices.push(v);
  }
  meshLine = new MeshLine();
  meshLine.setGeometry(geometry);
  material = new MeshLineMaterial(parameters);
  const mesh = new THREE.Mesh(meshLine.geometry, material);
  console.log(mesh);
  return mesh;
}

export const toRad = degrees => degrees / 180 * Math.PI;
