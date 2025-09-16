<script setup lang="ts">
// Define props
defineProps<{
	id: string;
	type: string;
}>();

// Define model
const model = defineModel<string | null>();
</script>

<template>
	<input :id="id" v-model="model" :name="id" :type="type" />
</template>
