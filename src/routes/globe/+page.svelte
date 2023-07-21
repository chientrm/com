<script lang="ts">
  import Earth from '$lib/assets/images/earth_map_BW.png?w=1536&flatten?grayscale&webp';
  import { OrbitControls } from '$lib/helpers/OrbitControls';
  import { frameLoop } from '$lib/helpers/frame_loop';
  import fragmentShader from '$lib/shaders/globe.frag?raw';
  import vertexShader from '$lib/shaders/globe.vert?raw';
  import { onMount } from 'svelte';
  import {
    AdditiveBlending,
    AmbientLight,
    Color,
    FrontSide,
    Mesh,
    MeshPhongMaterial,
    PerspectiveCamera,
    Raycaster,
    Scene,
    ShaderMaterial,
    SphereGeometry,
    TextureLoader,
    WebGLRenderer
  } from 'three';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const renderer = new WebGLRenderer({ canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.width, canvas.width);

    const camera = new PerspectiveCamera(45, 1, 1, 10000);
    camera.position.z = 500;

    const control = new OrbitControls(camera, renderer.domElement);
    control.enableDamping = true;

    const scene = new Scene();
    scene.add(new AmbientLight(0xffffff, 0.8));

    const raycaster = new Raycaster();
    raycaster.params.Points = { threshold: 3 };

    const loader = new TextureLoader();
    loader.load(Earth, (map) => {
      const geometry = new SphereGeometry(170, 40, 40);
      const globe = new Mesh(geometry, new MeshPhongMaterial({ map }));
      globe.rotateY(-Math.PI);
      scene.add(globe);
      const glowMat = new ShaderMaterial({
        uniforms: {
          c: { value: 0.02 },
          p: { value: 2.5 },
          glowColor: { value: new Color(0xff524a) },
          viewVector: { value: camera.position }
        },
        vertexShader,
        fragmentShader,
        side: FrontSide,
        blending: AdditiveBlending
      });
      const glow = new Mesh(geometry, glowMat);
      glow.scale.multiplyScalar(1.02);
      scene.add(globe);
    });

    const stopLoop = frameLoop(() => {
      control.update();
      renderer.render(scene, camera);
    });

    return () => {
      renderer.dispose();
      stopLoop();
    };
  });
</script>

<canvas bind:this={canvas} />
