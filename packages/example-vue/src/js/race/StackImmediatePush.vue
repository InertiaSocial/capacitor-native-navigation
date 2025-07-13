<template>
    <div>
        <h1>Stack Immediate Push</h1>
        <p>This component demonstrates immediate push operations that can cause race conditions.</p>
        <p>Current path: {{ context?.path || 'Not available' }}</p>

        <h2>Immediate Operations</h2>
        <p>
            <button @click="immediatePush">Immediate Push</button>
            <button @click="multipleImmediatePush">Multiple Immediate Push</button>
        </p>

        <h2>Navigation</h2>
        <p>
            <button @click="navigateTo('/stack1')">Go to Stack 1</button>
            <button @click="navigateTo('/stack2')">Go to Stack 2</button>
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
import { nativeNavigationNavigatorOptions } from "../init";

const context = useNativeNavigationViewContext();
const nativeRouter = useNativeNavigationRouter(nativeNavigationNavigatorOptions);

function navigateTo(path: string) {
    nativeRouter.push(path);
}

function goBack() {
    nativeRouter.go(-1);
}

function immediatePush() {
    // Immediate push operation
    nativeRouter.push('/stack2');
    console.log('Immediate push executed');
}

function multipleImmediatePush() {
    // Multiple immediate push operations
    console.log('Starting multiple immediate pushes...');
    nativeRouter.push('/stack1');
    nativeRouter.push('/stack2');
    nativeRouter.push('/view1');
    console.log('Multiple immediate pushes executed');
}

onMounted(() => {
    context?.updateView?.({
        title: "Stack Immediate Push",
    });
});
</script>
