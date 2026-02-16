import "../global.css";
import GUI from "lil-gui";
import * as THREE from "three";
import { Renderer } from "./lib/renderer";
import { Star } from "./lib/star";

const canvas = document.getElementById("webgl-canvas") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("Canvas element not found");
}

const gui = new GUI();
const renderer = new Renderer(canvas);

const star = new Star({
  wireframe: true,
  size: 4,
  innerPosition: 0.5,
  innerScale: 0.5,
  points: 5,
});

renderer.scene.add(star.mesh);

const config = {
  wireframe: star.wireframe,
  rotate: true,
  rotationSpeed: 1,
  points: star.points,
  size: star.size,
  innerPosition: star.innerPosition,
  innerScale: star.innerScale,
  color: `#${star.color.getHexString()}`,
};

gui.add(config, "wireframe").onChange((value: boolean) => {
  star.updateWireframe(value);
});

gui.add(config, "points", 3, 100, 1).onChange((value: number) => {
  star.updatePoints(value);
});

gui.add(config, "size", 0.5, 10, 0.1).onChange((value: number) => {
  star.updateSize(value);
});

gui.add(config, "innerPosition", 0, 1, 0.1).onChange((value: number) => {
  star.updateInnerPosition(value);
});

gui.add(config, "innerScale", 0.1, 1, 0.1).onChange((value: number) => {
  star.updateInnerScale(value);
});

gui.addColor(config, "color").onChange((value: string) => {
  star.updateColor(new THREE.Color(value));
});

gui.add(config, "rotate");
gui.add(config, "rotationSpeed", 1, 10, 1);

renderer.animate(() => {
  const time = Date.now() * 0.001;
  if (config.rotate) {
    star.mesh.rotation.z = time * config.rotationSpeed;
  }
});
