<script setup lang="ts">
import Section from '../../Organisms/Section/Section.vue';
import ExperienceManager from '../../../Classes/ExperienceManager.ts';
import { onBeforeUnmount, onMounted, ref, Ref } from 'vue';

// Set variables
const experiencerCanvas: Ref<HTMLCanvasElement | null> = ref(null);

// Life cycles
onMounted(() => {
	if (!experiencerCanvas.value) {
		return;
	}

	// Init the experiencer
	ExperienceManager.instance.init(experiencerCanvas.value);
});

onBeforeUnmount(() => {
	// Destroy the experiencer
	ExperienceManager.instance.destroy();
});
</script>

<template>
	<Section class="experience" :fluid="true">
		<canvas ref="experiencerCanvas" class="h-full w-full" />
	</Section>
</template>
