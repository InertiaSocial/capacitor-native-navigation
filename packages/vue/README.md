# Capacitor Native Navigation Vue

Vue support for [Capacitor Native Navigation](../../README.md).

## Installation

```shell
npm install capacitor-native-navigation-vue
```

## Usage

The Vue integration is activated by calling `initVue` and passing a reference to the `NativeNavigation` plugin, and the root component that will render each view.

```typescript
import { NativeNavigation } from 'capacitor-native-navigation'
import { initVue, type NativeNavigationVueRootProps } from 'capacitor-native-navigation-vue'
import { defineComponent } from 'vue'

const Root = defineComponent({
  props: {
    componentId: String,
    path: String,
    search: String,
    hash: String,
    state: Object,
    stack: String,
    pathname: String,
    href: String
  },
  setup(props: NativeNavigationVueRootProps) {
    // Your root component logic here
    return () => {
      // Your template here
    }
  }
})

initVue({
  plugin: NativeNavigation,
  root: Root,
})
```

## Context

Use the `useNativeNavigationViewContext` composable to access navigation context within your components:

```typescript
import { useNativeNavigationViewContext } from 'capacitor-native-navigation-vue'

export default defineComponent({
  setup() {
    const context = useNativeNavigationViewContext()
    
    if (context) {
      console.log('Current path:', context.path)
      console.log('Component ID:', context.componentId)
    }
    
    return {}
  }
})
```

## Modal Support

Use the `NativeNavigationModal` component for modal presentations:

```vue
<template>
  <NativeNavigationModal @dismiss="handleDismiss">
    <div>
      <h1>Modal Content</h1>
      <button @click="$refs.modal.dismiss()">Close Modal</button>
    </div>
  </NativeNavigationModal>
</template>

<script setup>
import { NativeNavigationModal } from 'capacitor-native-navigation-vue'

const handleDismiss = () => {
  console.log('Modal was dismissed')
}
</script>
```

## Differences to Vue Web

Capacitor Native Navigation tries as much as possible to be a seamless adaptation of Vue to native, however there are some differences that you should be aware of.

Each view is mounted as a separate Vue application instance. Views in a _stack_ remain mounted, even when not the frontmost in the stack, so they continue to respond to state changes (such as Pinia stores, or timers), even if they're not currently visible. Be careful not to trigger unintentional side-effects such as navigation from a component that is not visible.

## Error Handling

You can provide an error handler when initializing:

```typescript
import { alertErrorHandler } from 'capacitor-native-navigation-vue'

initVue({
  plugin: NativeNavigation,
  root: Root,
  errorHandler: alertErrorHandler, // or your custom error handler
})
```

## API

### `initVue(options)`

Initialize Vue integration for Capacitor Native Navigation.

#### Options

- `plugin`: The NativeNavigation plugin instance
- `root`: The root Vue component to render for each view
- `viewRootId?`: The element id to use for the root in new windows (default: 'root')
- `errorHandler?`: Optional error handler for unexpected errors

### `useNativeNavigationViewContext()`

A composable that returns the current navigation context, including:

- `componentId`: The current component ID
- `path`: The current path
- `search`: URL search parameters
- `hash`: URL hash
- `state`: Navigation state
- `stack`: Stack ID if the view is in a stack
- `pathname`: URL pathname
- `href`: Full href
- `addMessageListener`: Add a message listener
- `removeMessageListener`: Remove a message listener

### `useNativeNavigation()`

A composable that returns the NativeNavigation instance for direct plugin access.

### `NativeNavigationModal`

A Vue component for modal presentations.

#### Props

- `id?`: Optional component ID
- `animated?`: Whether to animate dismissal (default: true)

#### Events

- `dismiss`: Emitted when the modal is dismissed

#### Methods

- `dismiss()`: Programmatically dismiss the modal