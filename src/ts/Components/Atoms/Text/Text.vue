<script setup lang="ts">
import IText from '../../../Interfaces/IText.ts';

// Define props
withDefaults(defineProps<IText>(), {
	tag: 'span',
	size: 4
});
</script>

<template>
	<component :is="tag" class="text" :data-size="size">
		<slot />
	</component>
</template>
