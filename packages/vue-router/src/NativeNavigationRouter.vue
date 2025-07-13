<template>
    <router-view />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import { useRouter, useRoute, type RouteLocationNormalized } from "vue-router";
import {
    useNativeNavigation,
    useNativeNavigationViewContext,
    provideNativeNavigationViewContext,
} from "capacitor-native-navigation-vue";
import type { NativeNavigationVueRouterOptions } from "./types";
import { useNativeNavigationRouter } from "./hooks";

interface Props {
    location: RouteLocationNormalized;
    options: NativeNavigationVueRouterOptions;
}

const props = defineProps<Props>();
const router = useRouter();
const route = useRoute();

// Create view props from the location
const viewProps = ref({
    componentId: (props.location.meta?.componentId as string) || "",
    path: props.location.fullPath,
    search: new URL(props.location.fullPath, "http://localhost").search,
    hash: props.location.hash,
    state: props.location.meta?.state,
    stack: props.location.meta?.stack as string,
    pathname: props.location.path,
    href: props.location.fullPath,
});

// Provide the navigation context to child components
provideNativeNavigationViewContext(viewProps);

// Set up native navigation router integration
const nativeRouter = useNativeNavigationRouter(props.options);

// Watch for route changes and update view props
watch(
    () => props.location,
    (newLocation) => {
        viewProps.value = {
            componentId: (newLocation.meta?.componentId as string) || "",
            path: newLocation.fullPath,
            search: new URL(newLocation.fullPath, "http://localhost").search,
            hash: newLocation.hash,
            state: newLocation.meta?.state,
            stack: newLocation.meta?.stack as string,
            pathname: newLocation.path,
            href: newLocation.fullPath,
        };
    },
    { deep: true },
);

// Enhance the router with native navigation capabilities
onMounted(() => {
    // Override router navigation methods
    const originalPush = router.push.bind(router);
    const originalReplace = router.replace.bind(router);
    const originalGo = router.go.bind(router);

    router.push = async (to) => {
        try {
            await nativeRouter.push(to);
        } catch (error) {
            console.warn(
                "Native navigation failed, falling back to web router:",
                error,
            );
            return originalPush(to);
        }
    };

    router.replace = async (to) => {
        try {
            await nativeRouter.replace(to);
        } catch (error) {
            console.warn(
                "Native navigation failed, falling back to web router:",
                error,
            );
            return originalReplace(to);
        }
    };

    router.go = (delta) => {
        try {
            nativeRouter.go(delta);
        } catch (error) {
            console.warn(
                "Native navigation failed, falling back to web router:",
                error,
            );
            originalGo(delta);
        }
    };
});
</script>
