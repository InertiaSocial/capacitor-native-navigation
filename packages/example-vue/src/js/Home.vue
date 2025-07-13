<template>
    <div>
        <h1>Capacitor Native Navigation Test Suite</h1>
        <p>
            This example app demonstrates the capabilities of Capacitor Native
            Navigation.
        </p>
        <p>Choose one of the root options below:</p>
        <dl>
            <dd>
                <button
                    style="font-size: 2rem"
                    @click="
                        setupStack({
                            path: '/stack1',
                            title: 'Stack 1',
                            options: {
                                bar: {
                                    background: {
                                        color: '#336699',
                                    },
                                    title: {
                                        color: '#DFEFEF',
                                        font: {
                                            name: 'Solway',
                                            size: 26,
                                        },
                                    },
                                    buttons: {
                                        color: '#DDEEFF',
                                        font: {
                                            name: 'Solway',
                                        },
                                    },
                                },
                            },
                        })
                    "
                >
                    Stack
                </button>
            </dd>
            <dd>
                <button style="font-size: 2rem" @click="setupTabs">Tabs</button>
            </dd>
            <dd>
                <button style="font-size: 2rem" @click="setupView">View</button>
            </dd>

            <h2>Races</h2>
            <dd>
                <button
                    @click="
                        setupStack({
                            path: '/race/stack-immediate-push',
                            title: 'Stack Immediate Push',
                        })
                    "
                >
                    Immediate push
                </button>
            </dd>
            <dd>
                <button
                    @click="
                        setupStack({
                            path: '/race/stack-immediate-replace',
                            title: 'Stack Immediate Replace',
                        })
                    "
                >
                    Immediate replace
                </button>
            </dd>
            <dd>
                <button
                    @click="
                        setupStack({
                            path: '/race/push-replace/one',
                            title: 'Push Replace',
                        })
                    "
                >
                    Push replace
                </button>
            </dd>
            <dd>
                <button
                    @click="
                        setupStack({
                            path: '/race/modals',
                            title: 'Modal Race',
                        })
                    "
                >
                    Modal Race
                </button>
            </dd>

            <h2>Examples</h2>
            <dd>
                <button
                    @click="
                        setupStack({ path: '/examples/links', title: 'Links' })
                    "
                >
                    Links
                </button>
            </dd>
            <dd>
                <button
                    @click="
                        setupStack({ path: '/examples/menu', title: 'Menu' })
                    "
                >
                    Menu
                </button>
            </dd>
            <dd>
                <button
                    @click="
                        setupStack({
                            path: '/examples/menu-left',
                            title: 'Menu Left',
                        })
                    "
                >
                    Menu Left
                </button>
            </dd>
            <dd>
                <button
                    @click="
                        setupStack({
                            path: '/examples/subnav/first',
                            title: 'Subnav',
                        })
                    "
                >
                    Subnav
                </button>
            </dd>
            <dd>
                <button
                    @click="
                        setupStack({
                            path: '/examples/tall-content',
                            title: 'Tall Content',
                            options: {
                                bar: { background: { color: '#23ABED60' } },
                            },
                        })
                    "
                >
                    Transparent Menu
                </button>
            </dd>
            <dd>
                <button
                    @click="
                        setupStack({
                            path: '/examples/tall-content',
                            title: 'No Bounce',
                            options: {
                                bar: { background: { color: '#23ABED60' } },
                            },
                            viewOptions: { iOS: { preventBounce: true } },
                        })
                    "
                >
                    No Bounce
                </button>
            </dd>
            <dd>
                <button
                    @click="
                        setupStack({
                            path: '/examples/modals',
                            title: 'Modals',
                        })
                    "
                >
                    Modals
                </button>
            </dd>
            <dd>
                <button
                    @click="
                        setupStack({
                            path: '/examples/modals',
                            title: 'Modals',
                            options: { bar: { visible: false } },
                        })
                    "
                >
                    Hidden Navbar Stack
                </button>
            </dd>
            <dd>
                <button
                    @click="
                        setupStack({
                            path: '/examples/push-theming/red',
                            title: 'Themes',
                            options: {
                                bar: { background: { color: '#23ABED60' } },
                            },
                        })
                    "
                >
                    Color Theming
                </button>
            </dd>

            <h2>Modals</h2>
            <dd>
                <button @click="showModal = !showModal">Show Modal 1</button>
            </dd>
            <dd>
                <button @click="showModal2 = !showModal2">Show Modal 2</button>
            </dd>
        </dl>

        <!-- Modals -->
        <!-- This modal is always mounted and its presentation is controlled by the open prop, so it retains the same modal component id -->
        <NativeNavigationModal
            :component="{ type: 'view' }"
            presentation-style="formSheet"
            :open="showModal"
            @close="handleModal1Close"
        >
            <ModalContent />
        </NativeNavigationModal>

        <!-- This modal is only mounted when the state is true, so it gets a new modal component id each time -->
        <NativeNavigationModal
            v-if="showModal2"
            :component="{ type: 'view' }"
            presentation-style="formSheet"
            @close="handleModal2Close"
        >
            <ModalContent />
        </NativeNavigationModal>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
    NativeNavigation,
    type StackSpec,
    type ViewSpec,
} from "capacitor-native-navigation";
import { NativeNavigationModal } from "capacitor-native-navigation-vue";
import ModalContent from "./ModalContent.vue";

import diamond from "../assets/imgs/diamond@2x.png";
import flags from "../assets/imgs/flag.2.crossed@2x.png";
import star from "../assets/imgs/star@2x.png";

const showModal = ref(false);
const showModal2 = ref(false);

function handleModal1Close() {
    console.log("Close modal 1");
    showModal.value = false;
}

function handleModal2Close() {
    console.log("Close modal 2");
    showModal2.value = false;
}

async function setupStack(options: {
    path: string;
    title: string;
    options?: Partial<StackSpec>;
    viewOptions?: Partial<ViewSpec>;
}) {
    const stackRoot = await NativeNavigation.present({
        component: {
            alias: "rootStack",
            type: "stack",
            components: [
                {
                    type: "view",
                    path: options?.path,
                    title: options?.title,
                    ...options.viewOptions,
                },
            ],
            state: {
                fromRootStack: true,
            },
            ...options.options,
        },
        animated: false,
    });
    console.log("INIT: created", stackRoot.id);
}

async function setupTabs() {
    const tabsRoot = await NativeNavigation.present({
        component: {
            alias: "rootTabs",
            type: "tabs",
            tabs: [
                {
                    title: "First",
                    image: star,
                    component: {
                        alias: "rootStack",
                        type: "stack",
                        components: [
                            {
                                type: "view",
                                path: "/stack1",
                            },
                        ],
                    },
                },
                {
                    title: "View",
                    image: diamond,
                    component: {
                        type: "stack",
                        components: [
                            {
                                type: "view",
                                path: "/view1",
                            },
                        ],
                    },
                },
                {
                    title: "Tab Test",
                    image: flags,
                    component: {
                        type: "view",
                        path: "/tab1",
                    },
                },
            ],
        },
        animated: false,
    });
    console.log("INIT: created", tabsRoot.id);
}

async function setupView() {
    const standaloneViewRoot = await NativeNavigation.present({
        component: {
            type: "view",
            path: "/view1",
        },
        animated: false,
    });
    console.log("INIT: created", standaloneViewRoot.id);
}
</script>
