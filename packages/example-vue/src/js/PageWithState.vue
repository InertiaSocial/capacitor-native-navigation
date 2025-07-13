<template>
    <div>
        <h1>Page with state</h1>
        <p>This page demonstrates that routing state is passed to a new screen.</p>
        <p>State is:</p>
        <pre>{{ stateDisplay }}</pre>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useNativeNavigationViewContext } from "capacitor-native-navigation-vue";

const context = useNativeNavigationViewContext();

const stateDisplay = computed(() => {
    if (context?.state) {
        return JSON.stringify(context.state, null, 2);
    }
    return "NONE";
});

onMounted(() => {
    context?.updateView?.({
        title: "Page With State",
    });
});
</script>
