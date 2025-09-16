<script setup lang="ts">
import { TextSize } from '../../../Enums/TextSize.ts';
import Text from '../Text/Text.vue';

// Define props
defineProps<{
	message: string | undefined | null;
}>();
</script>

<template>
	<Text v-show="message" :size="TextSize.SMALL" class="input-error">
		{{ message }}
	</Text>
</template>
