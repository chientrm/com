import { describe, expect, it } from 'vitest';
import { polarToCartesian, cartesianToPolar } from './coords';

describe('coords', () => {
  const test = (lng: number, lat: number) => {
    const r = 150,
      { x, y, z } = polarToCartesian(lng, lat, r),
      [newLng, newLat] = cartesianToPolar({ x, y, z });
    expect(newLng.toFixed(5)).equal(lng.toFixed(5));
    expect(newLat.toFixed(5)).equal(lat.toFixed(5));
  };
  it('coords', () => {
    test(124.45053144586961, -9.1801897109863262);
    test(52.563812695699426, 42.74225494960632);
    test(-180, -90);
    test(-180, 90);
    test(180, -90);
    test(180, 90);
  });
});
