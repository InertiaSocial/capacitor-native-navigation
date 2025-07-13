<template>
    <div>
        <h1>View 1</h1>
        <p>This is a standalone view component.</p>
        <p>Views can be presented without being in a stack or tab structure.</p>

        <h2>Navigation</h2>
        <p>
            <button @click="navigateTo('/stack1')">Go to Stack 1</button>
            <button @click="navigateTo('/stack2')">Go to Stack 2</button>
        </p>

        <p>
            <button @click="navigateTo('/state', { from: 'View1' })">Go to State Page</button>
        </p>

        <ul>
            <li>
                <a href="/stack1" @click.prevent="navigateTo('/stack1')">
                    Link to Stack 1
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
        title: "View One",
    });
});
</script>
