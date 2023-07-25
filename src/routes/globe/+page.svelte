<script lang="ts">
  import { OrbitControls } from '$lib/helpers/OrbitControls';
  import { frameLoop } from '$lib/helpers/frame_loop';
  import { GeoJsonGeometry } from '$lib/helpers/geo';
  import type { GeoJsonProperties } from 'geojson';
  import { onMount } from 'svelte';
  import {
    Color,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Raycaster,
    Scene,
    SphereGeometry,
    Vector2,
    WebGLRenderer
  } from 'three';
  import type { PageData } from './$types';

  export let data: PageData;

  let canvas: HTMLCanvasElement;

  const backgroundColor =
      data.colorMode === 'white' ? new Color(0xffffff) : new Color(0),
    graticuleColor =
      data.colorMode === 'white' ? new Color(0) : new Color(0xffffff),
    graticuleMaterial = new LineBasicMaterial({
      color: graticuleColor,
      opacity: 0.1,
      transparent: true
    }),
    borderMaterial = new LineBasicMaterial({ color: '#1da1f2' }),
    lineObjs = [
      new LineSegments(
        new GeoJsonGeometry({ name: '' }, data.graticule[0]),
        graticuleMaterial
      ),
      ...data.countries.map(
        ({ properties, group }) =>
          new LineSegments(
            new GeoJsonGeometry(properties, group),
            borderMaterial
          )
      )
    ],
    sphere = new Mesh(
      new SphereGeometry(data.radius, data.radius, data.radius),
      new MeshBasicMaterial({ color: backgroundColor })
    ),
    mouseSphere = new Mesh(
      new SphereGeometry(3, 20, 20),
      new MeshBasicMaterial({ color: 'white' })
    ),
    scene = new Scene(),
    camera = new PerspectiveCamera(45, 1, 1, 10000),
    raycaster = new Raycaster(),
    mouse = new Vector2(0, 0);
  raycaster.params.Points = { threshold: 3 };
  camera.position.z = 500;

  scene.add(sphere);
  scene.add(mouseSphere);

  lineObjs.forEach((obj) => scene.add(obj));
  scene.background = backgroundColor;

  let properties: GeoJsonProperties | undefined = undefined;

  onMount(() => {
    const renderer = new WebGLRenderer({ canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.width, canvas.width);

    const control = new OrbitControls(camera, renderer.domElement);
    control.enableDamping = true;
    control.enablePan = false;

    canvas.addEventListener(
      'mousedown',
      (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        mouse.setX(((e.clientX - rect.left) / canvas.clientWidth) * 2 - 1);
        mouse.setY(-((e.clientY - rect.top) / canvas.clientWidth) * 2 + 1);

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([sphere]);
        if (intersects.length > 0) {
          const point = intersects[0].point,
            x = point.x,
            y = point.y,
            z = point.z,
            formData = new FormData();
          formData.append('x', x.toString());
          formData.append('y', y.toString());
          formData.append('z', z.toString());
          fetch('/globe/get_id', { method: 'POST', body: formData })
            .then((res) =>
              res.json<{
                id: number | undefined;
                properties: GeoJsonProperties | undefined;
              }>()
            )
            .then((data) => (properties = data.properties));
          mouseSphere.position.set(x, y, z);
        }
      },
      false
    );

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

<div>
  {properties?.name ?? ''}
</div>
