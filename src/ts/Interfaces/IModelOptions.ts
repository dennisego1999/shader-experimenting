import { ModelPrefix } from '../Enums/ModelPrefix.ts';
import { Quaternion, Vector3 } from 'three';

export default interface IModelOptions {
	modelPrefix: ModelPrefix;
	modelId: number;
	spawnPosition?: Vector3;
	spawnRotation?: Quaternion;
	spawnScale?: Vector3;
}
