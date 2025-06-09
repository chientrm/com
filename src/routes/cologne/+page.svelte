<script lang="ts">
	import { onMount } from 'svelte';
	let container: HTMLDivElement;

	onMount(() => {
		let renderer: any;
		let onKeyDown: (event: KeyboardEvent) => void;
		let onKeyUp: (event: KeyboardEvent) => void;

		async function init() {
			const THREE = await import('three');
			const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
			const { PointerLockControls } = await import(
				'three/examples/jsm/controls/PointerLockControls.js'
			);

			const scene = new THREE.Scene();

			// --- Add cubemap skybox using a single cross-layout image ---
			const textureLoader = new THREE.TextureLoader();
			const cubemapTexture = await textureLoader.loadAsync('/Cubemap/Cubemap_Sky_01-512x512.png');
			const cubemap = new THREE.CubeTexture();

			// Helper function to extract 6 faces from a cross-layout cubemap image
			function extractCubemapFaces(image: HTMLImageElement, size: number) {
				const canvas = document.createElement('canvas');
				canvas.width = size;
				canvas.height = size;
				const ctx = canvas.getContext('2d')!;
				const faces = [];
				// Cross layout: +X, -X, +Y, -Y, +Z, -Z
				const map = [
					[size * 2, size], // +X
					[0, size], // -X
					[size, 0], // +Y
					[size, size * 2], // -Y
					[size, size], // +Z
					[size * 3, size] // -Z
				];
				for (let i = 0; i < 6; i++) {
					ctx.clearRect(0, 0, size, size);
					ctx.drawImage(image, map[i][0], map[i][1], size, size, 0, 0, size, size);
					const face = ctx.getImageData(0, 0, size, size);
					const data = new Uint8Array(face.data.buffer);
					const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
					tex.needsUpdate = true;
					faces.push(tex);
				}
				return faces;
			}

			await new Promise<void>((resolve) => {
				if (cubemapTexture.image && cubemapTexture.image.complete) {
					resolve();
				} else {
					cubemapTexture.image.onload = () => resolve();
				}
			});

			const faces = extractCubemapFaces(cubemapTexture.image, 512);
			cubemap.images = faces;
			cubemap.needsUpdate = true;
			scene.background = cubemap;
			// --- End cubemap skybox ---

			// Camera
			const camera = new THREE.PerspectiveCamera(
				75,
				container.clientWidth / container.clientHeight,
				0.1,
				1000
			);
			// FPS camera: start at eye height, just above ground, closer to cathedral
			camera.position.set(0, 1.6, 100);

			// Renderer
			renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(renderer.domElement);

			// Lighting
			const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
			hemiLight.position.set(0, 20, 0);
			scene.add(hemiLight);

			const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
			dirLight.position.set(5, 10, 7.5);
			scene.add(dirLight);

			// --- Add ground plane with realistic dirt texture ---
			const [dirtColorMap, dirtNormalMap] = await Promise.all([
				textureLoader.loadAsync('/GroundDirt03_MR_4K/GroundDirt03_4K_BaseColor.png'),
				textureLoader.loadAsync('/GroundDirt03_MR_4K/GroundDirt03_4K_Normal.png')
			]);
			dirtColorMap.wrapS = dirtColorMap.wrapT = THREE.RepeatWrapping;
			dirtNormalMap.wrapS = dirtNormalMap.wrapT = THREE.RepeatWrapping;
			dirtColorMap.repeat.set(20, 20);
			dirtNormalMap.repeat.set(20, 20);

			const groundGeo = new THREE.PlaneGeometry(600, 600);
			const groundMat = new THREE.MeshPhongMaterial({
				map: dirtColorMap,
				normalMap: dirtNormalMap
			});
			const ground = new THREE.Mesh(groundGeo, groundMat);
			ground.rotation.x = -Math.PI / 2;
			ground.position.y = 0;
			ground.receiveShadow = true;
			scene.add(ground);
			// --- End ground plane ---

			// --- FPS Controls ---
			const controls = new PointerLockControls(camera, renderer.domElement);
			scene.add(controls.getObject());

			renderer.domElement.addEventListener('click', () => {
				controls.lock();
			});

			const move = { forward: false, backward: false, left: false, right: false };
			const velocity = new THREE.Vector3();
			const direction = new THREE.Vector3();

			onKeyDown = function (event: KeyboardEvent) {
				switch (event.code) {
					case 'ArrowUp':
					case 'KeyW':
						move.forward = true;
						break;
					case 'ArrowLeft':
					case 'KeyA':
						move.left = true;
						break;
					case 'ArrowDown':
					case 'KeyS':
						move.backward = true;
						break;
					case 'ArrowRight':
					case 'KeyD':
						move.right = true;
						break;
				}
			};
			onKeyUp = function (event: KeyboardEvent) {
				switch (event.code) {
					case 'ArrowUp':
					case 'KeyW':
						move.forward = false;
						break;
					case 'ArrowLeft':
					case 'KeyA':
						move.left = false;
						break;
					case 'ArrowDown':
					case 'KeyS':
						move.backward = false;
						break;
					case 'ArrowRight':
					case 'KeyD':
						move.right = false;
						break;
				}
			};
			document.addEventListener('keydown', onKeyDown);
			document.addEventListener('keyup', onKeyUp);

			// Load Cologne Cathedral model
			const loader = new GLTFLoader();
			loader.load(
				'/cologne_cathedral.glb',
				(gltf) => {
					gltf.scene.position.set(0, -3, 0);
					gltf.scene.scale.set(200, 200, 200);
					scene.add(gltf.scene);
				},
				undefined,
				(error) => {
					console.error('Error loading model:', error);
				}
			);

			// FPS animation loop
			let prevTime = performance.now();
			function animate() {
				requestAnimationFrame(animate);

				if (controls.isLocked) {
					const time = performance.now();
					const delta = (time - prevTime) / 1000;

					velocity.x -= velocity.x * 10.0 * delta;
					velocity.z -= velocity.z * 10.0 * delta;

					direction.z = Number(move.forward) - Number(move.backward);
					direction.x = Number(move.right) - Number(move.left);
					direction.normalize();

					// Increase movement speed from 5.0 to 12.0
					const speed = 12.0;
					if (move.forward || move.backward) velocity.z -= direction.z * speed * delta;
					if (move.left || move.right) velocity.x -= direction.x * speed * delta;

					controls.moveRight(-velocity.x * delta);
					controls.moveForward(-velocity.z * delta);

					prevTime = time;
				}

				renderer.render(scene, camera);
			}
			animate();

			window.addEventListener('resize', () => {
				camera.aspect = container.clientWidth / container.clientHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(container.clientWidth, container.clientHeight);
			});
		}

		init();

		return () => {
			if (onKeyDown) document.removeEventListener('keydown', onKeyDown);
			if (onKeyUp) document.removeEventListener('keyup', onKeyUp);
			if (renderer) renderer.dispose();
		};
	});
</script>

<div class="fps-container" bind:this={container}>
	<div class="fps-instructions">
		Click to enter. Use <b>WASD</b> to walk, mouse to look around.<br />
		Explore the Cologne Cathedral!
	</div>
</div>

<style>
	.fps-container {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: fixed;
		top: 0;
		left: 0;
		background: #222;
		z-index: 0;
	}
	.fps-instructions {
		position: absolute;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		color: #fff;
		background: rgba(0, 0, 0, 0.5);
		padding: 1em 2em;
		border-radius: 8px;
		z-index: 1;
		pointer-events: none;
		font-size: 1.2em;
	}
</style>
