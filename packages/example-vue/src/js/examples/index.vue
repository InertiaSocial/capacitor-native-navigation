<template>
    <div>
        <h1>Examples</h1>
        <p>This section contains various examples of Capacitor Native Navigation features.</p>
        <p>Current path: {{ context?.path || 'Not available' }}</p>

        <h2>Available Examples</h2>
        <ul>
            <li>Links</li>
            <li>Menu</li>
            <li>Menu Left</li>
            <li>Subnav</li>
            <li>Tall Content</li>
            <li>Modals</li>
            <li>Push Theming</li>
        </ul>

        <p>
            <button @click="goBack">Go Back</button>
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

function goBack() {
    nativeRouter.go(-1);
}

onMounted(() => {
    context?.updateView?.({
        title: "Examples",
    });
});
</script>
