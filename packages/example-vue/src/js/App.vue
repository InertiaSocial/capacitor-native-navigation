<template>
    <component :is="currentComponent" v-if="currentComponent" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useNativeNavigationViewContext } from "capacitor-native-navigation-vue";

// Import route components
import Stack1 from "./Stack1.vue";
import Stack2 from "./Stack2.vue";
import View1 from "./View1.vue";
import Tab1 from "./Tab1.vue";
import PageWithState from "./PageWithState.vue";
import Container from "./Container.vue";
import LinkModal from "./LinkModal.vue";
import LinkModalPage2 from "./LinkModalPage2.vue";
import Examples from "./examples/index.vue";
import PushReplace from "./race/PushReplace.vue";
import StackImmediatePush from "./race/StackImmediatePush.vue";
import StackImmediateReplace from "./race/StackImmediateReplace.vue";
import StackImmediateReplace2 from "./race/StackImmediateReplace2.vue";
import ModalsRace from "./race/ModalsRace.vue";

// Define props that the root component receives from native navigation
interface Props {
    componentId?: string;
    path?: string;
    search?: string;
    hash?: string;
    state?: any;
    stack?: string;
    pathname?: string;
    href?: string;
}

const props = defineProps<Props>();

// Get the navigation context
const context = useNativeNavigationViewContext();

// Simple route mapping based on path
const routeComponents: Record<string, any> = {
    "/stack1": Stack1,
    "/stack2": Stack2,
    "/view1": View1,
    "/state": PageWithState,
    "/tab1": Tab1,
    "/race/push-replace/one": PushReplace,
    "/race/push-replace/two": PushReplace,
    "/race/stack-immediate-push": StackImmediatePush,
    "/race/stack-immediate-replace": StackImmediateReplace,
    "/race/stack-immediate-replace2": StackImmediateReplace2,
    "/race/modals": ModalsRace,
    "/modal/": LinkModal,
    "/modal/page2": LinkModalPage2,
};

// Handle dynamic routes
function getComponentForPath(path: string) {
    // Direct match
    if (routeComponents[path]) {
        return routeComponents[path];
    }

    // Examples routes
    if (path.startsWith("/examples/")) {
        return Examples;
    }

    // Modal routes
    if (path.startsWith("/modal/")) {
        return Container;
    }

    // Default fallback
    return null;
}

// Determine which component to render based on the current path
const currentComponent = computed(() => {
    const path = context?.path || props.path || "/";
    return getComponentForPath(path);
});
</script>
