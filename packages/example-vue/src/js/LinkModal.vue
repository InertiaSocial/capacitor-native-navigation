<template>
    <div>
        <h1>Link Modal</h1>
        <p>This is a modal component that demonstrates linking and navigation within modals.</p>
        <p>Current path: {{ context?.path || 'Not available' }}</p>

        <h2>Modal Navigation</h2>
        <p>
            <button @click="navigateTo('/modal/page2')">Go to Page 2</button>
            <button @click="navigateTo('/stack1')">Go to Stack 1</button>
            <button @click="navigateTo('/stack2')">Go to Stack 2</button>
        </p>

        <h2>Links</h2>
        <ul>
            <li>
                <a href="/modal/page2" @click.prevent="navigateTo('/modal/page2')">
                    Link to Modal Page 2
                </a>
            </li>
            <li>
                <a href="/stack1" @click.prevent="navigateTo('/stack1')">
                    Link to Stack 1
                </a>
            </li>
            <li>
                <a href="/examples/links" @click.prevent="navigateTo('/examples/links')">
                    Link to Examples
                </a>
            </li>
        </ul>

        <h2>Modal Actions</h2>
        <p>
            <button @click="dismissModal">Dismiss Modal</button>
            <button @click="navigateAndDismiss">Navigate and Dismiss</button>
        </p>

        <h2>State Management</h2>
        <p>
            <button @click="navigateWithState">Navigate with State</button>
        </p>

        <h2>Debug Info</h2>
        <p>Component ID: {{ context?.componentId || 'Not available' }}</p>
        <p>Stack: {{ context?.stack || 'Not in stack' }}</p>
        <p>State: {{ stateDisplay }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useNativeNavigationViewContext } from "capacitor-native-navigation-vue";
import { useNativeNavigationRouter } from "capacitor-native-navigation-vue-router";
import { nativeNavigationNavigatorOptions } from "./init";

const context = useNativeNavigationViewContext();
const nativeRouter = useNativeNavigationRouter(nativeNavigationNavigatorOptions);

const stateDisplay = computed(() => {
    if (context?.state) {
        return JSON.stringify(context.state, null, 2);
    }
    return "NONE";
});

function navigateTo(path: string) {
    nativeRouter.push(path);
}

function dismissModal() {
    if (context?.dismiss) {
        context.dismiss();
    } else {
        console.warn('Dismiss function not available');
    }
}

function navigateAndDismiss() {
    // Navigate to a new route and then dismiss the modal
    nativeRouter.push('/stack1', {
        state: {
            dismiss: true,
            from: 'LinkModal'
        }
    });
}

function navigateWithState() {
    nativeRouter.push('/modal/page2', {
        state: {
            from: 'LinkModal',
            timestamp: Date.now(),
            data: 'Custom modal state data'
        }
    });
}

onMounted(() => {
    context?.updateView?.({
        title: "Link Modal",
    });
});
</script>
