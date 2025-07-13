<template>
    <div>
        <h1>Stack 2</h1>
        <p>This is the second view in the stack.</p>

        <h2>Navigation</h2>
        <p>
            <button @click="handlePush">Push Stack 1</button>
            <button @click="handlePushSelf">Push Stack 2 (this)</button>
            <button @click="handlePushWithState">Push with State</button>
        </p>
        <p>
            <button @click="handleReplace">Replace with Stack 1</button>
        </p>

        <ul>
            <li>
                <a href="/stack1" @click.prevent="navigateTo('/stack1')"
                    >Push Stack 1</a
                >
            </li>
            <li>
                <a href="/stack2" @click.prevent="navigateTo('/stack2')"
                    >Push Stack 2</a
                >
            </li>
            <li>
                <a href="/state" @click.prevent="navigateToState"
                    >Push with State</a
                >
            </li>
            <li>
                <a href="/modal/" @click.prevent="navigateTo('/modal/')"
                    >Link to modal</a
                >
            </li>
        </ul>

        <p>
            <button @click="goBack">Go Back</button>
        </p>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useNativeNavigationViewContext } from "capacitor-native-navigation-vue";
import { useNativeNavigationRouter } from "capacitor-native-navigation-vue-router";
import { NativeNavigation } from "capacitor-native-navigation";
import { nativeNavigationNavigatorOptions } from "./init";

const context = useNativeNavigationViewContext();
const nativeRouter = useNativeNavigationRouter(
    nativeNavigationNavigatorOptions,
);

let counter = 1;

const updateView = context?.updateView;
const addClickListener = context?.addClickListener;

function handlePush() {
    nativeRouter.push("/stack1");
}

function handlePushSelf() {
    nativeRouter.push("/stack2");
}

function handlePushWithState() {
    nativeRouter.push("/state", {
        state: {
            counter: counter++,
            from: "Stack2",
        },
    });
}

function handleReplace() {
    nativeRouter.replace("/stack1");
}

function navigateTo(path: string) {
    nativeRouter.push(path);
}

function navigateToState() {
    nativeRouter.push("/state", {
        state: { fromLink: true, from: "Stack2" },
    });
}

function goBack() {
    nativeRouter.go(-1);
}

onMounted(() => {
    updateView?.({
        title: "Stack Two",
        stackItem: {
            rightItems: [
                {
                    id: "reset",
                    title: "Reset",
                },
            ],
        },
    });

    const removeClickListener = addClickListener?.((data) => {
        if (data.buttonId === "reset") {
            NativeNavigation.reset();
        }
    });

    onUnmounted(() => {
        removeClickListener?.();
    });
});
</script>
