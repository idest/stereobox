//import { default as THREE } from './lib/three';
import * as THREE from 'three';
import LineGeometry from './lib/examples/LineGeometry';
import LineMaterial from './lib/examples/LineMaterial';
import Line2 from './lib/examples/Line2';

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

export function getSpheres(points, parameters) {
  const sphereGeometry = new THREE.SphereGeometry(parameters.r, 16, 16);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: parameters.color,
    side: THREE.DoubleSide
  });
  const spheres = new THREE.Group();
  for (let i = 0; i < points.length; i++) {
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.copy(points[i]);
    spheres.add(sphere);
  }
  console.log(spheres);
  return spheres;
}

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

export function getLine(vertices, parameters) {
  parameters.linewidth = parameters.linewidth ? parameters.linewidth : 2;
  const geometry = new LineGeometry();
  const positions = [];
  for (let i = 0; i < vertices.length; i++) {
    positions.push(vertices[i].x);
    positions.push(vertices[i].y);
    positions.push(vertices[i].z);
  }
  geometry.setPositions(positions);
  const material = new LineMaterial(parameters);
  material.resolution.set(300, 300);
  const line = new Line2(geometry, material);
  line.scale.set(1, 1, 1);
  return line;
}

export function getCurve(curve, parameters) {
  const line = getLine(curve.getPoints(100), parameters);
  return line;
}

export function drawCircle(radius, parameters) {
  let vertices = [];
  for (let i = 0; i < 2 * Math.PI; i += (2 * Math.PI) / 100) {
    vertices.push(
      new THREE.Vector3(radius * Math.cos(i), 0, radius * Math.sin(i))
    );
  }
  const line = getLine(vertices, parameters);
  return line;
}
/*

export function getMeshLine(vertices, color, outlineColor, dashed) {
  var geometry = new THREE.Geometry();
  for (let i = 0; i < vertices.length; i++) {
    geometry.vertices.push(vertices[i]);
  }
  var line = new MeshLine();
  line.setGeometry(geometry);
  var material = new MeshLineMaterial({
    lineWidth: 0.08,
    color: color
  });
  const lineMesh = new THREE.Mesh(line.geometry, material);
  return lineMesh;
}

export function getMeshLineCurve(curve, parameters) {
  var geometry = new THREE.Geometry();
  geometry.vertices = curve.getPoints(100);
  //console.log(curve.getPoints(100));
  var line = new MeshLine();
  line.setGeometry(geometry);
  var material = new MeshLineMaterial(parameters);
  return new THREE.Mesh(line.geometry, material);
}

export function drawMeshLineCircle(radius, parameters) {
  let geometry, material, meshLine;
  geometry = new THREE.Geometry();
  for (let i = 0, v; i < 2 * Math.PI; i += (2 * Math.PI) / 100) {
    v = new THREE.Vector3(radius * Math.cos(i), 0, radius * Math.sin(i));
    geometry.vertices.push(v);
  }
  meshLine = new MeshLine();
  meshLine.setGeometry(geometry);
  material = new MeshLineMaterial(parameters);
  const mesh = new THREE.Mesh(meshLine.geometry, material);
  return mesh;
}
*/

export const toRad = degrees => (degrees / 180) * Math.PI;
