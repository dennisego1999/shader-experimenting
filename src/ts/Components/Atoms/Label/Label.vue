<script setup lang="ts">
import { TextSize } from '../../../Enums/TextSize.ts';
import ITextSize from '../../../Interfaces/ITextSize.ts';
import Text from '../Text/Text.vue';

// Define props with defaults
withDefaults(defineProps<ITextSize>(), {
	size: TextSize.EXTRA_LARGE
});
</script>

<template>
	<label>
		<Text :size="size">
			<slot />
		</Text>
	</label>
</template>
