<template>
    <div>
        <h1>Link Modal Page 2</h1>
        <p>This is the second page within the modal navigation flow.</p>
        <p>Current path: {{ context?.path || "Not available" }}</p>

        <h2>Modal Navigation</h2>
        <p>
            <button @click="navigateTo('/modal/')">
                Go back to Modal Root
            </button>
            <button @click="navigateTo('/stack1')">Exit to Stack 1</button>
            <button @click="navigateTo('/stack2')">Exit to Stack 2</button>
        </p>

        <h2>Page 2 Specific Actions</h2>
        <p>
            <button @click="navigateWithComplexState">
                Navigate with Complex State
            </button>
            <button @click="performModalAction">Perform Modal Action</button>
            <button @click="cascadeNavigation">Cascade Navigation</button>
        </p>

        <h2>Links</h2>
        <ul>
            <li>
                <a href="/modal/" @click.prevent="navigateTo('/modal/')">
                    Link back to Modal Root
                </a>
            </li>
            <li>
                <a href="/state" @click.prevent="navigateToState">
                    Link to State Page with Modal Data
                </a>
            </li>
            <li>
                <a
                    href="/examples/links"
                    @click.prevent="navigateTo('/examples/links')"
                >
                    Link to Examples
                </a>
            </li>
        </ul>

        <h2>Modal Controls</h2>
        <p>
            <button @click="dismissModal">Dismiss Modal</button>
            <button @click="dismissWithCallback">Dismiss with Callback</button>
        </p>

        <h2>State Information</h2>
        <div style="background: #f5f5f5; padding: 10px; margin: 10px 0">
            <h3>Received State:</h3>
            <pre>{{ stateDisplay }}</pre>
        </div>

        <div style="background: #e8f4fd; padding: 10px; margin: 10px 0">
            <h3>Current Context:</h3>
            <p>Component ID: {{ context?.componentId || "Not available" }}</p>
            <p>Stack: {{ context?.stack || "Not in stack" }}</p>
            <p>Path: {{ context?.path || "Not available" }}</p>
            <p>Search: {{ context?.search || "None" }}</p>
            <p>Hash: {{ context?.hash || "None" }}</p>
        </div>

        <h2>Navigation History</h2>
        <p>
            <button @click="goBack">Go Back</button>
            <button @click="goBackMultiple">Go Back 2 Steps</button>
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { useNativeNavigationViewContext } from "capacitor-native-navigation-vue";
import { useNativeNavigationRouter } from "capacitor-native-navigation-vue-router";
import { nativeNavigationNavigatorOptions } from "./init";

const context = useNativeNavigationViewContext();
const nativeRouter = useNativeNavigationRouter(
    nativeNavigationNavigatorOptions,
);

const stateDisplay = computed(() => {
    if (context?.state) {
        return JSON.stringify(context.state, null, 2);
    }
    return "NONE";
});

function navigateTo(path: string) {
    nativeRouter.push(path);
}

function navigateToState() {
    nativeRouter.push("/state", {
        state: {
            from: "LinkModalPage2",
            modalData: context?.state,
            timestamp: Date.now(),
            pageLevel: 2,
        },
    });
}

function navigateWithComplexState() {
    nativeRouter.push("/modal/", {
        state: {
            from: "LinkModalPage2",
            complexData: {
                user: { id: 123, name: "Test User" },
                preferences: { theme: "dark", lang: "en" },
                actions: ["viewed_page2", "performed_action"],
                metadata: {
                    timestamp: Date.now(),
                    source: "modal_navigation",
                    level: 2,
                },
            },
            navigation: {
                canGoBack: true,
                totalSteps: 2,
                breadcrumb: ["modal", "page2"],
            },
        },
    });
}

function performModalAction() {
    console.log("Performing modal-specific action from Page 2...");

    // Simulate some action and then navigate
    setTimeout(() => {
        nativeRouter.push("/modal/", {
            state: {
                actionResult: "success",
                actionType: "modal_page2_action",
                timestamp: Date.now(),
                from: "LinkModalPage2",
            },
        });
    }, 500);
}

function cascadeNavigation() {
    console.log("Starting cascade navigation...");

    // Navigate through multiple routes in sequence
    setTimeout(() => {
        nativeRouter.push("/stack1");
    }, 100);

    setTimeout(() => {
        nativeRouter.push("/stack2");
    }, 600);

    setTimeout(() => {
        nativeRouter.push("/state", {
            state: {
                cascadeComplete: true,
                origin: "LinkModalPage2",
                steps: ["page2", "stack1", "stack2", "state"],
            },
        });
    }, 1200);
}

function dismissModal() {
    if (context?.dismiss) {
        context.dismiss();
    } else {
        console.warn("Dismiss function not available");
    }
}

function dismissWithCallback() {
    console.log("Dismissing modal with callback data...");

    if (context?.dismiss) {
        // In a real implementation, you might want to pass data back
        context.dismiss();
    } else {
        console.warn("Dismiss function not available");
    }
}

function goBack() {
    nativeRouter.go(-1);
}

function goBackMultiple() {
    nativeRouter.go(-2);
}

onMounted(() => {
    context?.updateView?.({
        title: "Link Modal Page 2",
        stackItem: {
            rightItems: [
                {
                    id: "done",
                    title: "Done",
                },
                {
                    id: "close",
                    title: "Close",
                },
            ],
        },
    });

    // Handle button clicks
    const removeClickListener = context?.addClickListener?.((data) => {
        if (data.buttonId === "done") {
            navigateTo("/modal/");
        } else if (data.buttonId === "close") {
            dismissModal();
        }
    });

    // Cleanup on unmount
    onUnmounted(() => {
        removeClickListener?.();
    });
});
</script>
