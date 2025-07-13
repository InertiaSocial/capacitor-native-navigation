<template>
    <div>
        <h1>Tab 1</h1>
        <p>This is a tab component that can be used in a tab navigation structure.</p>
        <p>Tabs provide a way to organize content into separate sections.</p>

        <h2>Navigation</h2>
        <p>
            <button @click="navigateTo('/stack1')">Go to Stack 1</button>
            <button @click="navigateTo('/stack2')">Go to Stack 2</button>
            <button @click="navigateTo('/view1')">Go to View 1</button>
        </p>

        <p>
            <button @click="navigateTo('/state', { from: 'Tab1', timestamp: Date.now() })">
                Go to State Page
            </button>
        </p>

        <h2>Tab Information</h2>
        <p>Component ID: {{ context?.componentId || 'Not available' }}</p>
        <p>Current Path: {{ context?.path || 'Not available' }}</p>
        <p>Stack: {{ context?.stack || 'Not in stack' }}</p>

        <ul>
            <li>
                <a href="/stack1" @click.prevent="navigateTo('/stack1')">
                    Link to Stack 1
                </a>
            </li>
            <li>
                <a href="/stack2" @click.prevent="navigateTo('/stack2')">
                    Link to Stack 2
                </a>
            </li>
            <li>
                <a href="/modal/" @click.prevent="navigateTo('/modal/')">
                    Link to modal
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useNativeNavigationViewContext } from "capacitor-native-navigation-vue";
import { useNativeNavigationRouter } from "capacitor-native-navigation-vue-router";
import { nativeNavigationNavigatorOptions } from "./init";

const context = useNativeNavigationViewContext();
const nativeRouter = useNativeNavigationRouter(nativeNavigationNavigatorOptions);

function navigateTo(path: string, state?: any) {
    if (state) {
        nativeRouter.push(path, { state });
    } else {
        nativeRouter.push(path);
    }
}

onMounted(() => {
    context?.updateView?.({
        title: "Tab One",
    });
});
</script>
