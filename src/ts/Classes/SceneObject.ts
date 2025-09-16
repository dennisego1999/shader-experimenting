import { ModelPrefix } from '../Enums/ModelPrefix.ts';
import { AnimationName } from '../Enums/AnimationName.ts';
import {
	AnimationAction,
	AnimationClip,
	AnimationMixer,
	Box3,
	Mesh,
	Object3D,
	Quaternion,
	Scene,
	Vector3
} from 'three';
import IModelOptions from '../Interfaces/IModelOptions.ts';
import ModelManager from './ModelManager.ts';

export default class SceneObject {
	private _animationsMap: Map<string, AnimationAction>;
	private _model: Object3D;
	private _mixer: AnimationMixer;
	private readonly _modelId: number;
	private readonly _modelPrefix: ModelPrefix;
	private readonly _spawnPosition: Vector3;
	private readonly _spawnRotation: Quaternion;
	private readonly _spawnScale: Vector3;
	private readonly _currentAction: AnimationName;

	constructor(options: IModelOptions) {
		const {
			modelPrefix,
			modelId,
			spawnPosition = new Vector3(),
			spawnRotation = new Quaternion(),
			spawnScale = new Vector3(1, 1, 1)
		} = options;

		this._modelPrefix = modelPrefix;
		this._modelId = modelId;
		this._spawnPosition = spawnPosition;
		this._spawnRotation = spawnRotation;
		this._spawnScale = spawnScale;
		this._animationsMap = new Map();
		this._model = new Object3D();
		this._mixer = new AnimationMixer(new Mesh());
		this._currentAction = AnimationName.CAR;
	}

	get modelDimensions() {
		if (!this._model) {
			return { width: 0, height: 0, depth: 0 };
		}

		// Calculate dimensions
		const bbox = new Box3().setFromObject(this._model);
		const size = new Vector3();
		bbox.getSize(size);

		return { width: size.x, height: size.y, depth: size.z };
	}

	async init(scene: Scene): Promise<void> {
		// Load the model
		await this.load();

		// Add model to scene
		scene.add(this._model);

		// Call animation when corresponding key is pressed
		this._animationsMap.forEach((animation: AnimationAction, key: string) => {
			if (key === this._currentAction) {
				// Play the animation
				animation.play();
			}
		});
	}

	async load(): Promise<Object3D> {
		try {
			const { model, animations } = await ModelManager.instance.get({
				modelPrefix: this._modelPrefix,
				modelId: this._modelId,
				spawnPosition: this._spawnPosition,
				spawnRotation: this._spawnRotation,
				spawnScale: this._spawnScale
			});

			// Set model
			this._model = model;

			// Filter out the T pose animation
			const filteredAnimations = [
				...animations.filter((animation: AnimationClip) => animation.name !== AnimationName.TPOSE)
			];

			// Set animation mixer
			this._mixer = new AnimationMixer(this._model);

			// Set animations map
			filteredAnimations.forEach((animation: AnimationClip) => {
				const action = this._mixer.clipAction(animation);

				this._animationsMap.set(animation.name as AnimationName, action);
			});

			// Set scale
			this._model.scale.copy(this._spawnScale);

			// Return the loaded model
			return this._model;
		} catch (error) {
			console.error(error);

			return Promise.reject(error);
		}
	}

	public update(delta: number): void {
		// Update the mixer
		this._mixer.update(delta);
	}
}
