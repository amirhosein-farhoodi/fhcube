import * as THREE from "three";

export function localToWorld(
  localPos: [number, number, number],
  groupPos: [number, number, number],
  groupRot: [number, number, number],
): [number, number, number] {
  const vec = new THREE.Vector3(...localPos);
  vec.applyEuler(new THREE.Euler(...groupRot));
  vec.add(new THREE.Vector3(...groupPos));
  return [vec.x, vec.y, vec.z];
}
