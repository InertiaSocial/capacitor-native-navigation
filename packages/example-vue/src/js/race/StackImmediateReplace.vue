<template>
    <div>
        <h1>Stack Immediate Replace</h1>
        <p>This component demonstrates immediate replace operations that can cause race conditions.</p>
        <p>Current path: {{ context?.path || 'Not available' }}</p>

        <h2>Immediate Operations</h2>
        <p>
            <button @click="immediateReplace">Immediate Replace</button>
            <button @click="multipleImmediateReplace">Multiple Immediate Replace</button>
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

function immediateReplace() {
    // Immediate replace operation
    nativeRouter.replace('/stack2');
    console.log('Immediate replace executed');
}

function multipleImmediateReplace() {
    // Multiple immediate replace operations
    console.log('Starting multiple immediate replaces...');
    nativeRouter.replace('/stack1');
    nativeRouter.replace('/stack2');
    nativeRouter.replace('/view1');
    console.log('Multiple immediate replaces executed');
}

onMounted(() => {
    context?.updateView?.({
        title: "Stack Immediate Replace",
    });
});
</script>
