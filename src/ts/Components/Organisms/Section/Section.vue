<script setup lang="ts">
import ISection from '../../../Interfaces/ISection.ts';

// Define props
withDefaults(defineProps<ISection>(), {
	tag: 'section',
	fluid: false
});
</script>

<template>
	<component :is="tag" class="section" :class="{ 'section--fluid': fluid }">
		<div class="section__inner">
			<slot />
		</div>
	</component>
</template>
