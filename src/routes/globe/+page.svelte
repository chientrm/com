<script lang="ts">
  import { OrbitControls } from '$lib/helpers/OrbitControls';
  import { DEG2RAD } from '$lib/helpers/coords';
  import { frameLoop } from '$lib/helpers/frame_loop';
  import { GeoJsonGeometry } from '$lib/helpers/geo';
  import type { GeoJsonProperties } from 'geojson';
  import { onMount } from 'svelte';
  import { withPrevious } from 'svelte-previous';
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

  export let data;

  let canvas: HTMLCanvasElement;

  type CountryLineSegments = LineSegments<GeoJsonGeometry, LineBasicMaterial>;

  const [backgroundColor, graticuleColor] = [new Color(0), new Color(0xffffff)],
    graticuleMaterial = new LineBasicMaterial({
      color: graticuleColor,
      opacity: 0.1,
      transparent: true
    }),
    borderMaterial = new LineBasicMaterial({ color: '#1da1f2' }),
    selectedBorderMaterial = new LineBasicMaterial({ color: 'darkgreen' });
  const countries = new Map<string, CountryLineSegments>();
  data.countries.forEach(({ id, group }) => {
    countries.set(
      id,
      new LineSegments(new GeoJsonGeometry(group), borderMaterial)
    );
  });
  const lineObjs = [
      new LineSegments(
        new GeoJsonGeometry(data.graticule[0]),
        graticuleMaterial
      ),
      ...Array.from(countries.values())
    ],
    sphere = new Mesh(
      new SphereGeometry(data.radius, data.radius, data.radius),
      new MeshBasicMaterial({ color: backgroundColor })
    ),
    scene = new Scene(),
    [lng, lat] = data.centerOfMass,
    camera = new PerspectiveCamera(45, 1, 1, 10000)
      .translateX(-500 * Math.sin(lng * DEG2RAD))
      .translateZ(-500 * Math.cos(lng * DEG2RAD))
      .translateY(500 * Math.sin(lat * DEG2RAD)),
    raycaster = new Raycaster(),
    mouse = new Vector2(0, 0);
  raycaster.params.Points = { threshold: 3 };
  camera.lookAt(sphere.position);

  scene.add(sphere);

  lineObjs.forEach((obj) => scene.add(obj));
  scene.background = backgroundColor;

  let properties: GeoJsonProperties | undefined = undefined;
  const [selectedSegments, previousSegments] =
    withPrevious<CountryLineSegments | null>(countries.get(data.countryCode)!, {
      requireChange: true
    });
  $: {
    if ($previousSegments) {
      const country = $previousSegments;
      country.material = borderMaterial;
    }
    if ($selectedSegments) {
      const country = $selectedSegments;
      country.material = selectedBorderMaterial;
    }
  }

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
                id: string | undefined;
                properties: GeoJsonProperties | undefined;
              }>()
            )
            .then((d) => {
              if (d.properties) {
                properties = d.properties;
                $selectedSegments = countries.get(d.properties.ISO_A2)!;
              }
            });
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

<canvas bind:this={canvas} />

<div>
  {properties?.NAME_EN ?? ''}
</div>
