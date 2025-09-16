import { Object3D, Quaternion, Vector3 } from 'three';
import { IModelCacheEntry } from '../Interfaces/IModelCacheEntry.ts';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';
import { ThreeLoaders } from './ThreeLoaders.ts';
import IModelOptions from '../Interfaces/IModelOptions.ts';

export default class ModelManager {
	private static _instance: ModelManager;
	private _modelCache: Map<string, IModelCacheEntry> = new Map();

	private constructor() {}

	public static get instance(): ModelManager {
		if (!this._instance) {
			this._instance = new ModelManager();
		}

		return this._instance;
	}

	/**
	 * Retrieves a model by prefix and ID.
	 *
	 * - If the model is cached, a cloned copy is returned, ensuring each caller
	 *   receives a unique `Object3D` instance while reusing the same geometry/materials.
	 * - If the model is not cached, it is loaded from disk, cached, and then returned.
	 *
	 * @param options - Options object to configure the model retrieval.
	 * @param options.modelPrefix - The folder name/prefix for the model (e.g., "player", "enemy").
	 * @param options.modelId - Numeric identifier for the model within the prefix folder.
	 * @param options.spawnPosition - Optional. Position to place the model. Defaults to `new Vector3()`.
	 * @param options.spawnRotation - Optional. Rotation to apply to the model. Defaults to identity `Quaternion`.
	 * @param options.spawnScale - Optional. Scale to apply to the model. Defaults to `Vector3(1, 1, 1)`.
	 *
	 * @returns Promise that resolves with a cached or newly loaded model entry,
	 * containing a Three.js `Object3D` and its associated animations.
	 *
	 * @example
	 * ```ts
	 * const { model, animations } = await ModelManager.instance.get({
	 *   modelPrefix: "enemy",
	 *   modelId: 1,
	 *   spawnScale: new Vector3(2, 2, 2)
	 * });
	 *
	 * const { model: playerModel } = await ModelManager.instance.get({
	 *   modelId: 5,
	 *   modelPrefix: "player",
	 *   spawnPosition: new Vector3(0, 1, 0)
	 * });
	 * ```
	 */
	public get(options: IModelOptions): Promise<IModelCacheEntry> {
		const {
			modelPrefix,
			modelId,
			spawnPosition = new Vector3(),
			spawnRotation = new Quaternion(),
			spawnScale = new Vector3(1, 1, 1)
		} = options;

		return new Promise(async (resolve, reject) => {
			if (this._modelCache.has(`${modelPrefix}-${modelId}`)) {
				// Reuse existing model
				const cachedGltf = this._modelCache.get(`${modelPrefix}-${modelId}`)!;

				// Set spawn position and rotation
				cachedGltf.model.position.copy(spawnPosition);
				cachedGltf.model.quaternion.copy(spawnRotation);

				const clonedModel: Object3D = clone(cachedGltf.model);
				clonedModel.position.copy(spawnPosition);
				clonedModel.quaternion.copy(spawnRotation);
				clonedModel.scale.copy(spawnScale);

				// Ensure matrix world is updated
				clonedModel.updateMatrixWorld(true);

				// Resolve
				resolve({ model: clonedModel, animations: cachedGltf.animations });

				return;
			}

			try {
				// Load model for first time
				const gltf = await ThreeLoaders.loadGLTF(`/assets/models/${modelPrefix}/${modelId}/scene.gltf`);
				const model: Object3D = gltf.scene;

				// Do adjustments
				model.position.copy(spawnPosition);
				model.quaternion.copy(spawnRotation);
				model.scale.copy(spawnScale);

				// Store in cache
				this._modelCache.set(`${modelPrefix}-${modelId}`, {
					model: model,
					animations: gltf.animations
				});

				// Resolve
				resolve({ model: model, animations: gltf.animations });
			} catch (error) {
				console.error(error);
				reject(new Error('Error loading player model'));
			}
		});
	}
}
