<template>
    <div>
        <h1>Modals Race</h1>
        <p>This component demonstrates modal presentation race conditions and edge cases.</p>
        <p>Current path: {{ context?.path || 'Not available' }}</p>

        <h2>Modal Operations</h2>
        <p>
            <button @click="showSingleModal">Show Single Modal</button>
            <button @click="showMultipleModals">Show Multiple Modals</button>
            <button @click="showAndDismissModal">Show & Dismiss Modal</button>
        </p>

        <h2>Race Conditions</h2>
        <p>
            <button @click="rapidModalToggle">Rapid Modal Toggle</button>
            <button @click="overlappingModals">Overlapping Modals</button>
            <button @click="chainedModals">Chained Modals</button>
        </p>

        <h2>Modal States</h2>
        <p>
            <button @click="showFormSheetModal">Form Sheet Modal</button>
            <button @click="showFullScreenModal">Full Screen Modal</button>
            <button @click="showPageSheetModal">Page Sheet Modal</button>
        </p>

        <h2>Navigation</h2>
        <p>
            <button @click="navigateTo('/stack1')">Go to Stack 1</button>
            <button @click="navigateTo('/stack2')">Go to Stack 2</button>
            <button @click="goBack">Go Back</button>
        </p>

        <h2>Debug Info</h2>
        <p>Component ID: {{ context?.componentId || 'Not available' }}</p>
        <p>Stack: {{ context?.stack || 'Not in stack' }}</p>
        <p>Modal Count: {{ modalCount }}</p>
        <p>Active Modals: {{ activeModals.length }}</p>

        <!-- Modals -->
        <NativeNavigationModal
            v-if="showModal1"
            :component="{ type: 'view' }"
            presentation-style="formSheet"
            @close="handleModal1Close"
        >
            <div style="padding: 20px;">
                <h2>Modal 1</h2>
                <p>This is the first modal in the race test.</p>
                <button @click="handleModal1Close">Close Modal 1</button>
                <button @click="showModal2 = true">Open Modal 2</button>
            </div>
        </NativeNavigationModal>

        <NativeNavigationModal
            v-if="showModal2"
            :component="{ type: 'view' }"
            presentation-style="pageSheet"
            @close="handleModal2Close"
        >
            <div style="padding: 20px;">
                <h2>Modal 2</h2>
                <p>This is the second modal in the race test.</p>
                <button @click="handleModal2Close">Close Modal 2</button>
                <button @click="showModal3 = true">Open Modal 3</button>
            </div>
        </NativeNavigationModal>

        <NativeNavigationModal
            v-if="showModal3"
            :component="{ type: 'view' }"
            presentation-style="fullScreen"
            @close="handleModal3Close"
        >
            <div style="padding: 20px;">
                <h2>Modal 3</h2>
                <p>This is the third modal in the race test.</p>
                <button @click="handleModal3Close">Close Modal 3</button>
                <button @click="closeAllModals">Close All Modals</button>
            </div>
        </NativeNavigationModal>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useNativeNavigationViewContext } from "capacitor-native-navigation-vue";
import { useNativeNavigationRouter } from "capacitor-native-navigation-vue-router";
import { NativeNavigationModal } from "capacitor-native-navigation-vue";
import { nativeNavigationNavigatorOptions } from "../init";

const context = useNativeNavigationViewContext();
const nativeRouter = useNativeNavigationRouter(nativeNavigationNavigatorOptions);

const showModal1 = ref(false);
const showModal2 = ref(false);
const showModal3 = ref(false);
const modalCount = ref(0);

const activeModals = computed(() => {
    const modals = [];
    if (showModal1.value) modals.push('modal1');
    if (showModal2.value) modals.push('modal2');
    if (showModal3.value) modals.push('modal3');
    return modals;
});

function navigateTo(path: string) {
    nativeRouter.push(path);
}

function goBack() {
    nativeRouter.go(-1);
}

function showSingleModal() {
    console.log('Showing single modal...');
    modalCount.value++;
    showModal1.value = true;
}

function showMultipleModals() {
    console.log('Showing multiple modals...');
    modalCount.value++;
    showModal1.value = true;

    setTimeout(() => {
        showModal2.value = true;
    }, 500);

    setTimeout(() => {
        showModal3.value = true;
    }, 1000);
}

function showAndDismissModal() {
    console.log('Show and dismiss modal rapidly...');
    modalCount.value++;
    showModal1.value = true;

    setTimeout(() => {
        showModal1.value = false;
    }, 200);
}

function rapidModalToggle() {
    console.log('Starting rapid modal toggle...');
    modalCount.value++;

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            showModal1.value = !showModal1.value;
        }, i * 100);
    }
}

function overlappingModals() {
    console.log('Creating overlapping modals...');
    modalCount.value++;

    // Show modals with overlapping timing
    showModal1.value = true;

    setTimeout(() => {
        showModal2.value = true;
        showModal1.value = false; // Close first while opening second
    }, 150);

    setTimeout(() => {
        showModal3.value = true;
        showModal2.value = false; // Close second while opening third
    }, 300);
}

function chainedModals() {
    console.log('Creating chained modals...');
    modalCount.value++;

    showModal1.value = true;
}

function showFormSheetModal() {
    console.log('Showing form sheet modal...');
    modalCount.value++;
    showModal1.value = true;
}

function showFullScreenModal() {
    console.log('Showing full screen modal...');
    modalCount.value++;
    showModal3.value = true;
}

function showPageSheetModal() {
    console.log('Showing page sheet modal...');
    modalCount.value++;
    showModal2.value = true;
}

function handleModal1Close() {
    console.log('Modal 1 closed');
    showModal1.value = false;
}

function handleModal2Close() {
    console.log('Modal 2 closed');
    showModal2.value = false;
}

function handleModal3Close() {
    console.log('Modal 3 closed');
    showModal3.value = false;
}

function closeAllModals() {
    console.log('Closing all modals...');
    showModal1.value = false;
    showModal2.value = false;
    showModal3.value = false;
}

onMounted(() => {
    context?.updateView?.({
        title: "Modals Race",
    });
});
</script>
