import { AmbientLight, Clock, DirectionalLight, Mesh, PlaneGeometry, Scene, ShaderMaterial } from 'three';
import ExperienceRenderer from './ExperienceRenderer.ts';
import ExperienceCamera from './ExperienceCamera.ts';
import { EventService } from '../Services/EventService.ts';
import { CustomEventKey } from '../Enums/CustomEventKey.ts';
import boxFragmentShader from '../../shaders/Box/Fragment.glsl';
import boxVertextShader from '../../shaders/Box/Vertex.glsl';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class ExperienceManager {
	private static _instance: ExperienceManager;

	private _clock: Clock = new Clock();
	private _scene: Scene = new Scene();
	private _controls: OrbitControls | null = null;
	private _renderer: ExperienceRenderer | null = null;
	private _camera: ExperienceCamera | null = null;
	private _canvas: HTMLCanvasElement | null = null;
	private _animateFrameId: number | null = null;

	public elapsedTime: number = 0;

	private constructor() {}

	public static get instance(): ExperienceManager {
		if (!ExperienceManager._instance) {
			ExperienceManager._instance = new ExperienceManager();
		}

		return ExperienceManager._instance;
	}

	public async init(canvas: HTMLCanvasElement): Promise<void> {
		if (this._canvas) {
			// Prevent re-initialization
			throw new Error('ConfiguratorManager is already initialized');
		}

		// Init canvas, renderer, and camera
		this._canvas = canvas;
		this._renderer = new ExperienceRenderer(this._canvas);
		this._camera = new ExperienceCamera(this._scene, this._canvas);
		this._controls = new OrbitControls(this._camera, this._canvas);

		// Preload custom materials and scene objects
		await this.preloadMaterialsAndObjects();

		// Update camera and renderer size
		this.updateSceneCameraAndRenderSize();

		// Setup the lighting
		this.setupLighting();

		// Populate the scene
		await this.populateScene();

		// Add resize listener
		window.addEventListener('resize', () => this.resize());

		// Start animation loop
		this.animate();

		// Dispatch ready event
		EventService.dispatch(CustomEventKey.READY);
	}

	public resize(): void {
		this.updateSceneCameraAndRenderSize();
	}

	public destroy(): void {
		if (this._animateFrameId) {
			cancelAnimationFrame(this._animateFrameId);
		}

		// Remove resize listener
		window.removeEventListener('resize', () => this.resize());

		if (this._renderer) {
			this._renderer.dispose();
		}
	}

	private setupLighting(): void {
		// Add ambient light
		const ambientLight = new AmbientLight(0xffffff, 4.5);
		this._scene.add(ambientLight);

		const directionalLight = new DirectionalLight(0xffffff, 1);
		directionalLight.castShadow = true;
		this._scene.add(directionalLight);
	}

	private async preloadMaterialsAndObjects() {
		// Preload possible objects and materials here
	}

	private updateSceneCameraAndRenderSize() {
		if (!this._canvas || !this._camera || !this._renderer) {
			return;
		}

		const parentElement = this._canvas.parentNode as HTMLElement;
		const boundingClientRect = parentElement.getBoundingClientRect();

		this._camera.aspect = boundingClientRect.width / boundingClientRect.height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(boundingClientRect.width, boundingClientRect.height);
	}

	private async populateScene(): Promise<void> {
		const shaderMaterial = new ShaderMaterial({
			// vertexShader: boxVertextShader,
			fragmentShader: boxFragmentShader,
			uniforms: {},
			wireframe: false
		});

		const plane = new PlaneGeometry(1, 1, 5, 5);
		const mesh = new Mesh(plane, shaderMaterial);

		this._scene.add(mesh);
	}

	private animate(): void {
		const delta = this._clock.getDelta();
		this.elapsedTime = this._clock.getElapsedTime();

		this.render(delta);

		this._animateFrameId = requestAnimationFrame(this.animate.bind(this));
	}

	private render(delta: number): void {
		if (!this._renderer || !this._camera || !this._controls) return;

		// Update controls
		this._controls.update();

		// Render
		this._renderer.render(this._scene, this._camera);
	}
}
