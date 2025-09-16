<script setup lang="ts"></script>
<template>
	<RouterView v-slot="{ Component }">
		<main class="font-display">
			<Transition name="fade" mode="out-in" appear>
				<Component :is="Component" />
			</Transition>
		</main>
	</RouterView>
</template>
