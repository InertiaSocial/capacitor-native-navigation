<template>
    <div>
        <h1>Container</h1>
        <p>This is a container component that can hold other components.</p>
        <p>Current path: {{ context?.path || 'Not available' }}</p>

        <div style="padding: 20px; border: 1px solid #ccc; margin: 20px 0;">
            <router-view />
        </div>

        <h2>Navigation</h2>
        <p>
            <button @click="navigateTo('/modal/')">Go to Modal Root</button>
            <button @click="navigateTo('/modal/page2')">Go to Modal Page 2</button>
            <button @click="goBack">Go Back</button>
        </p>

        <h2>Debug Info</h2>
        <p>Component ID: {{ context?.componentId || 'Not available' }}</p>
        <p>Stack: {{ context?.stack || 'Not in stack' }}</p>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useNativeNavigationViewContext } from "capacitor-native-navigation-vue";
import { useNativeNavigationRouter } from "capacitor-native-navigation-vue-router";
import { nativeNavigationNavigatorOptions } from "./init";

const context = useNativeNavigationViewContext();
const nativeRouter = useNativeNavigationRouter(nativeNavigationNavigatorOptions);

function navigateTo(path: string) {
    nativeRouter.push(path);
}

function goBack() {
    nativeRouter.go(-1);
}

onMounted(() => {
    context?.updateView?.({
        title: "Container",
    });
});
</script>
