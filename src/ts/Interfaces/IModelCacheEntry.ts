import { AnimationClip, Object3D } from 'three';

export interface IModelCacheEntry {
	model: Object3D;
	animations: AnimationClip[];
}
