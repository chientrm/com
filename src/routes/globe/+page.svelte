<script lang="ts">
  import { OrbitControls } from '$lib/helpers/OrbitControls';
  import { frameLoop } from '$lib/helpers/frame_loop';
  import { GeoJsonGeometry } from '$lib/helpers/geo';
  import { onMount } from 'svelte';
  import {
    LineBasicMaterial,
    LineSegments,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
  } from 'three';
  import type { PageData } from './$types';

  export let data: PageData;

  let canvas: HTMLCanvasElement;

  const graticuleMaterial = new LineBasicMaterial({
      color: 'white',
      opacity: 0.1,
      transparent: true
    }),
    borderMaterial = new LineBasicMaterial({ color: '#1da1f2' }),
    lineObjs = [
      new LineSegments(
        new GeoJsonGeometry(data.graticule[0]),
        graticuleMaterial
      ),
      ...data.countries.map(
        (country) =>
          new LineSegments(new GeoJsonGeometry(country), borderMaterial)
      )
    ],
    camera = new PerspectiveCamera(45, 1, 1, 10000),
    scene = new Scene();

  lineObjs.forEach((obj) => scene.add(obj));
  camera.position.z = 500;

  onMount(() => {
    const renderer = new WebGLRenderer({ canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.width, canvas.width);

    const control = new OrbitControls(camera, renderer.domElement);
    control.enableDamping = true;

    const stop = frameLoop(() => {
      control.update();
      renderer.render(scene, camera);
    });

    return () => {
      renderer.dispose();
      stop();
    };
  });
</script>

<svelte:head>
  <title>Counter | chientrm.com</title>
  <meta name="description" content="globe" />
  <meta property="og:title" content="chientrm.com | globe" />
  <meta property="og:description" content="globe" />
</svelte:head>

<canvas bind:this={canvas} />
