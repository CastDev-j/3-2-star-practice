import * as THREE from "three";

interface StarProps {
  position?: THREE.Vector3;
  color?: THREE.Color;
  size?: number;
  wireframe?: boolean;
  points?: number;
  innerPosition?: number;
  innerScale?: number;
}

export class Star {
  mesh: THREE.Mesh;
  points: number;
  innerPosition: number;
  innerScale: number;
  size: number;
  wireframe: boolean;
  color: THREE.Color;
  private position: THREE.Vector3;

  constructor({
    position,
    size,
    color,
    wireframe,
    points,
    innerScale,
    innerPosition,
  }: StarProps = {}) {
    this.position = position || new THREE.Vector3(0, 0, 0);
    this.size = size || 1;
    this.color = color || new THREE.Color(0xffffff);
    this.innerScale = innerScale || 0.5;
    this.wireframe = wireframe || false;
    this.points = points || 4;
    this.innerPosition = innerPosition || 0.5;

    const vertices = this.getVertices();
    const indices = this.getIndices();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", vertices);
    geometry.setIndex(indices);

    const basicMaterial = new THREE.MeshBasicMaterial({
      color: this.color,
      wireframe: this.wireframe,
    });

    this.mesh = new THREE.Mesh(geometry, basicMaterial);
    this.mesh.position.copy(this.position);
  }

  private getVertices(): THREE.BufferAttribute {
    const halfSize = this.size / 2;
    const vertices = [];
    for (let i = 0; i < this.points * 2; i++) {
      const xOutterPosition =
        Math.cos((i / this.points) * 2 * Math.PI) * halfSize;
      const yOutterPosition =
        Math.sin((i / this.points) * 2 * Math.PI) * halfSize;
      const zOutterPosition = 0;

      const xInnerPosition =
        Math.cos(((i + this.innerPosition) / this.points) * 2 * Math.PI) *
        (halfSize * this.innerScale);
      const yInnerPosition =
        Math.sin(((i + this.innerPosition) / this.points) * 2 * Math.PI) *
        (halfSize * this.innerScale);
      const zInnerPosition = 0;

      vertices.push(xOutterPosition, yOutterPosition, zOutterPosition);

      vertices.push(xInnerPosition, yInnerPosition, zInnerPosition);
    }

    return new THREE.BufferAttribute(Float32Array.from(vertices), 3);
  }

  private getIndices(): THREE.BufferAttribute {
    const indices = [];

    for (let i = 0; i < this.points * 2; i++) {
      const currentIndex = i;
      const nextIndex = (i + 1) % (this.points * 2);
      const centerIndex = this.points * 4;

      indices.push(currentIndex, nextIndex, centerIndex);
    }

    return new THREE.BufferAttribute(Uint16Array.from(indices), 1);
  }

  updatePoints(points: number) {
    this.points = points;

    const vertices = this.getVertices();
    const indices = this.getIndices();

    this.mesh.geometry.dispose();

    this.mesh.geometry = new THREE.BufferGeometry();

    this.mesh.geometry.setAttribute("position", vertices);
    this.mesh.geometry.setIndex(indices);
  }

  updateSize(size: number) {
    this.size = size;
    const vertices = this.getVertices();

    this.mesh.geometry.setAttribute("position", vertices);
    this.mesh.geometry.attributes.position.needsUpdate = true;
  }

  updateInnerPosition(innerPosition: number) {
    this.innerPosition = innerPosition;
    const vertices = this.getVertices();

    this.mesh.geometry.setAttribute("position", vertices);
    this.mesh.geometry.attributes.position.needsUpdate = true;
  }

  updateInnerScale(innerScale: number) {
    this.innerScale = innerScale;
    const vertices = this.getVertices();

    this.mesh.geometry.setAttribute("position", vertices);
    this.mesh.geometry.attributes.position.needsUpdate = true;
  }

  updateWireframe(wireframe: boolean) {
    this.wireframe = wireframe;
    (this.mesh.material as THREE.MeshBasicMaterial).wireframe = wireframe;
  }

  updateColor(color: THREE.Color) {
    this.color = color;
    (this.mesh.material as THREE.MeshBasicMaterial).color = color;
  }
}
