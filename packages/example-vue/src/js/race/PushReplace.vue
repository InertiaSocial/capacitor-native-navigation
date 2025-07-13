<template>
    <div>
        <h1>Push Replace Race</h1>
        <p>This component demonstrates push/replace race conditions.</p>
        <p>Current path: {{ context?.path || 'Not available' }}</p>

        <h2>Navigation</h2>
        <p>
            <button @click="navigateTo('/race/push-replace/two')">Go to Two</button>
            <button @click="goBack">Go Back</button>
        </p>

        <h2>Race Conditions</h2>
        <p>
            <button @click="rapidPush">Rapid Push</button>
            <button @click="rapidReplace">Rapid Replace</button>
        </p>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useNativeNavigationViewContext } from "capacitor-native-navigation-vue";
import { useNativeNavigationRouter } from "capacitor-native-navigation-vue-router";
import { nativeNavigationNavigatorOptions } from "../init";

const context = useNativeNavigationViewContext();
const nativeRouter = useNativeNavigationRouter(nativeNavigationNavigatorOptions);

function navigateTo(path: string) {
    nativeRouter.push(path);
}

function goBack() {
    nativeRouter.go(-1);
}

function rapidPush() {
    // Simulate rapid navigation
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            nativeRouter.push(`/race/push-replace/two?attempt=${i}`);
        }, i * 100);
    }
}

function rapidReplace() {
    // Simulate rapid replacement
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            nativeRouter.replace(`/race/push-replace/two?attempt=${i}`);
        }, i * 100);
    }
}

onMounted(() => {
    context?.updateView?.({
        title: "Push Replace Race",
    });
});
</script>
