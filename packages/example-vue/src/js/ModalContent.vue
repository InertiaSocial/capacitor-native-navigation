<template>
	<div>
		<h1>Hello World</h1>
		<p>Component id: {{ componentId || 'Not in native navigation' }}</p>
		<button @click="handleDismiss">Dismiss</button>
	</div>
</template>

<script setup lang="ts">
import { useNativeNavigationViewContext } from 'capacitor-native-navigation-vue'

const context = useNativeNavigationViewContext()
const componentId = context?.componentId
const dismiss = context?.dismiss

function handleDismiss() {
	if (dismiss) {
		dismiss()
	}
}
</script>
