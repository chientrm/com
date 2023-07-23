import { BufferGeometry, Float32BufferAttribute } from 'three';

export class GeoJsonGeometry extends BufferGeometry {
  constructor(group: Group) {
    super();
    group.indices.length && this.setIndex(group.indices);
    group.vertices.length &&
      this.setAttribute(
        'position',
        new Float32BufferAttribute(group.vertices, 3)
      );
  }
}
