<template>
    <div>
        <h1>Stack 1</h1>
        <p>
            This is the root of the stack. The title of this view was defined
            when the stack was created.
        </p>

        <h2>Title</h2>
        <p>
            <button @click="handleChangeTitle">Change Title</button>
            <button @click="handleRemoveTitle">Remove Title</button>
        </p>

        <h2>Toolbar</h2>
        <p>
            <button @click="handleToolbarToggle">
                {{ toolbarVisible ? "Hide Toolbar" : "Show Toolbar" }}
            </button>
            <button @click="handleBackEnabledToggle">
                {{ backEnabled ? "Disable Back" : "Enable Back" }}
            </button>
        </p>
        <p>
            <button @click="handleToggleShadow">
                {{ iOSShadowHidden ? "Show iOS Shadow" : "Hide iOS Shadow" }}
            </button>
        </p>

        <h2>Navigation</h2>
        <p>
            <button @click="handlePushSelf">Push Stack 1 (this)</button>
            <button @click="handlePush">Push Stack 2 (new)</button>
            <button @click="handlePushWithState">Push with State</button>
        </p>
        <p>
            <button @click="handleReplace1">Replace with Stack 2</button>
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
            <li>
                <a
                    href="/examples/menu-left"
                    @click.prevent="navigateTo('/examples/menu-left')"
                    >Link to left items</a
                >
            </li>
        </ul>

        <p>
            <button @click="goBack">Go Back</button>
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useNativeNavigationViewContext } from "capacitor-native-navigation-vue";
import { useNativeNavigationRouter } from "capacitor-native-navigation-vue-router";
import { NativeNavigation } from "capacitor-native-navigation";
import { nativeNavigationNavigatorOptions } from "./init";

const context = useNativeNavigationViewContext();
const nativeRouter = useNativeNavigationRouter(
    nativeNavigationNavigatorOptions,
);

const toolbarVisible = ref(true);
const backEnabled = ref(true);
const iOSShadowHidden = ref(false);

let counter = 1;

const updateView = context?.updateView;
const addClickListener = context?.addClickListener;

function handleChangeTitle() {
    updateView?.({
        title: `Changed title ${counter++}`,
    });
}

function handleRemoveTitle() {
    updateView?.({
        title: null,
    });
}

function handleToggleShadow() {
    const newValue = !iOSShadowHidden.value;
    iOSShadowHidden.value = newValue;
    updateView?.({
        stackItem: {
            bar: {
                background: {
                    color: "#DDFFEE",
                },
                iOS: {
                    hideShadow: newValue,
                },
            },
        },
    });
}

function handlePush() {
    nativeRouter.push("/stack2");
}

function handlePushSelf() {
    nativeRouter.push("/stack1");
}

function handlePushWithState() {
    nativeRouter.push("/state", {
        state: {
            counter: counter++,
        },
    });
}

function handleToolbarToggle() {
    toolbarVisible.value = !toolbarVisible.value;
}

function handleBackEnabledToggle() {
    backEnabled.value = !backEnabled.value;
}

function handleReplace1() {
    nativeRouter.replace("/stack2");
}

function navigateTo(path: string) {
    nativeRouter.push(path);
}

function navigateToState() {
    nativeRouter.push("/state", {
        state: { fromLink: true },
    });
}

function goBack() {
    nativeRouter.go(-1);
}

// Watch for toolbar visibility changes
watch(toolbarVisible, (newValue) => {
    updateView?.({
        stackItem: {
            bar: {
                visible: newValue,
            },
        },
        animated: true,
    });
});

// Watch for back button enabled changes
watch(backEnabled, (newValue) => {
    updateView?.({
        stackItem: {
            leftItems: newValue ? null : [],
        },
        animated: true,
    });
});

onMounted(() => {
    updateView?.({
        title: "Stack One",
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
