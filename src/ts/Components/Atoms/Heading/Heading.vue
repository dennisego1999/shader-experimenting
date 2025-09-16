<script setup lang="ts">
import IHeading from '../../../Interfaces/IHeading.ts';

// Define props
withDefaults(defineProps<IHeading>(), {
	tag: 'h1',
	size: 1
});
</script>

<template>
	<component :is="tag" class="heading" :data-size="size">
		<slot />
	</component>
</template>
