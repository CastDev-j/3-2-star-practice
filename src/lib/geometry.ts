import * as THREE from "three";

interface GeometryProps {
  position?: THREE.Vector3;
  size?: number;
  color?: THREE.Color;
  wireframe?: boolean;
}

export class Geometry {
  mesh: THREE.Mesh;
  segments: number = 3;
  private position: THREE.Vector3;
  private size: number;
  private color: THREE.Color;
  private wireframe: boolean;

  constructor({ position, size, color, wireframe }: GeometryProps = {}) {
    this.position = position || new THREE.Vector3(0, 0, 0);
    this.size = size || 1;
    this.color = color || new THREE.Color(0xffffff);
    this.wireframe = wireframe || false;

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

    for (let i = 0; i < this.segments; i++) {
      const xPosition = Math.cos((i / this.segments) * 2 * Math.PI) * halfSize;
      const yPosition = Math.sin((i / this.segments) * 2 * Math.PI) * halfSize;
      const zPosition = 0;

      vertices.push(xPosition, yPosition, zPosition);
    }

    return new THREE.BufferAttribute(Float32Array.from(vertices), 3);
  }

  private getIndices(): THREE.BufferAttribute {
    const indices = [];

    for (let i = 0; i < this.segments; i++) {
      const currentIndex = i;
      const nextIndex = (i + 1) % this.segments;
      const centerIndex = this.segments;
      indices.push(currentIndex, nextIndex, centerIndex);
    }

    return new THREE.BufferAttribute(Uint16Array.from(indices), 1);
  }

  updateSegments(newSegments: number): void {
    this.segments = newSegments;
    const vertices = this.getVertices();
    const indices = this.getIndices();

    this.mesh.geometry.setAttribute("position", vertices);
    this.mesh.geometry.setIndex(indices);
    this.mesh.geometry.attributes.position.needsUpdate = true;
  }
}
