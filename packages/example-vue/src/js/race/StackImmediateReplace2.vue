<template>
    <div>
        <h1>Stack Immediate Replace 2</h1>
        <p>This is the second variant of the immediate replace component for testing different scenarios.</p>
        <p>Current path: {{ context?.path || 'Not available' }}</p>

        <h2>Advanced Replace Operations</h2>
        <p>
            <button @click="cascadingReplace">Cascading Replace</button>
            <button @click="delayedReplace">Delayed Replace</button>
            <button @click="conditionalReplace">Conditional Replace</button>
        </p>

        <h2>State Management</h2>
        <p>
            <button @click="replaceWithState">Replace with State</button>
            <button @click="replaceAndReset">Replace and Reset</button>
        </p>

        <h2>Navigation</h2>
        <p>
            <button @click="navigateTo('/race/stack-immediate-replace')">Go to Replace 1</button>
            <button @click="navigateTo('/stack1')">Go to Stack 1</button>
            <button @click="goBack">Go Back</button>
        </p>

        <h2>Debug Info</h2>
        <p>Component ID: {{ context?.componentId || 'Not available' }}</p>
        <p>Stack: {{ context?.stack || 'Not in stack' }}</p>
        <p>Replace Count: {{ replaceCount }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useNativeNavigationViewContext } from "capacitor-native-navigation-vue";
import { useNativeNavigationRouter } from "capacitor-native-navigation-vue-router";
import { nativeNavigationNavigatorOptions } from "../init";

const context = useNativeNavigationViewContext();
const nativeRouter = useNativeNavigationRouter(nativeNavigationNavigatorOptions);

const replaceCount = ref(0);

function navigateTo(path: string) {
    nativeRouter.push(path);
}

function goBack() {
    nativeRouter.go(-1);
}

function cascadingReplace() {
    // Chain multiple replaces with different timing
    console.log('Starting cascading replace...');
    replaceCount.value++;

    nativeRouter.replace('/stack1');

    setTimeout(() => {
        nativeRouter.replace('/stack2');
    }, 500);

    setTimeout(() => {
        nativeRouter.replace('/view1');
    }, 1000);
}

function delayedReplace() {
    console.log('Starting delayed replace...');
    replaceCount.value++;

    setTimeout(() => {
        nativeRouter.replace('/stack2');
        console.log('Delayed replace executed');
    }, 2000);
}

function conditionalReplace() {
    console.log('Starting conditional replace...');
    replaceCount.value++;

    const shouldReplace = Math.random() > 0.5;

    if (shouldReplace) {
        nativeRouter.replace('/stack1');
        console.log('Conditional replace: YES');
    } else {
        console.log('Conditional replace: NO');
    }
}

function replaceWithState() {
    console.log('Replace with state...');
    replaceCount.value++;

    nativeRouter.replace('/state', {
        state: {
            from: 'StackImmediateReplace2',
            timestamp: Date.now(),
            replaceCount: replaceCount.value,
        },
    });
}

function replaceAndReset() {
    console.log('Replace and reset...');
    replaceCount.value = 0;

    nativeRouter.replace('/stack1', {
        state: {
            reset: true,
            from: 'StackImmediateReplace2',
        },
    });
}

onMounted(() => {
    context?.updateView?.({
        title: "Stack Immediate Replace 2",
    });
});
</script>
