# Capacitor Native Navigation Vue Router

Vue Router support for [Capacitor Native Navigation](../../README.md).

## Installation

```shell
npm install capacitor-native-navigation-vue-router
```

Note: This package requires both `capacitor-native-navigation-vue` and `vue-router` as peer dependencies.

```shell
npm install capacitor-native-navigation-vue vue-router
```

## Usage

The Vue Router integration transparently integrates with Vue Router so that the `router.push()`, `router.replace()` and `router.go()` functions translate pushes, replaces and backs into their native equivalent. This enables Capacitor Native Navigation to be very loosely coupled with your app; you start with a separate native entrypoint, but then reuse all of your web routing and navigation code.

### Basic Setup

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { NativeNavigation } from 'capacitor-native-navigation'
import { initVue, type NativeNavigationVueRootProps } from 'capacitor-native-navigation-vue'
import { useNativeNavigationRouter } from 'capacitor-native-navigation-vue-router'
import { defineComponent } from 'vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Your routes here
  ]
})

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
    const nativeRouter = useNativeNavigationRouter({
      plugin: NativeNavigation,
      modals: [],
    })

    return () => {
      return h('router-view')
    }
  }
})

initVue({
  plugin: NativeNavigation,
  root: Root,
})
```

### Using with Router Component

You can also use the provided `NativeNavigationRouter` component:

```vue
<template>
  <NativeNavigationRouter :location="location" :options="routerOptions">
    <router-view />
  </NativeNavigationRouter>
</template>

<script setup>
import { NativeNavigationRouter } from 'capacitor-native-navigation-vue-router'
import { NativeNavigation } from 'capacitor-native-navigation'

const location = {
  path: '/home',
  fullPath: '/home',
  // ... other route location properties
}

const routerOptions = {
  plugin: NativeNavigation,
  modals: [],
}
</script>
```

## Modal Support

Special support is available for modal views in the router options:

```typescript
const routerOptions = {
  plugin: NativeNavigation,
  modals: [
    {
      // The path prefix for views that should be in the modal
      path: '/modal/',
      // A function to return the component specification for the view to present for the modal
      presentOptions(path, state) {
        return {
          component: {
            type: 'stack',
            stack: [
              {
                type: 'view',
                path,
                state,
                options: {
                  // We can specify the title here, or set it using `update` from the component
                  title: 'My Modal Title',
                  stack: {
                    rightItems: [
                      // Add a close button to the view
                      {
                        id: 'close',
                        title: 'Close',
                      },
                    ],
                  },
                },
              },
            ],
          },
          style: 'formSheet',
          cancellable: false
        }
      },
    },
  ]
}
```

## Navigation State

You can control native navigation behavior by passing state to router navigation methods:

```typescript
import { createNativeNavigationState } from 'capacitor-native-navigation-vue-router'

// Replace current view instead of pushing
router.push('/new-page', {
  state: createNativeNavigationState({ replace: true })
})

// Reset stack to just the new view
router.push('/home', {
  state: createNativeNavigationState({ root: true })
})

// Dismiss current modal before navigating
router.push('/new-page', {
  state: createNativeNavigationState({ dismiss: true })
})

// Navigate without animation
router.push('/new-page', {
  state: createNativeNavigationState({ animated: false })
})
```

## API

### `useNativeNavigationRouter(options)`

A composable that provides native navigation methods integrated with Vue Router.

#### Options

- `plugin`: The NativeNavigation plugin instance
- `modals?`: Array of modal configurations
- `errorHandler?`: Optional error handler for navigation errors

#### Returns

- `go(delta)`: Navigate back/forward by delta steps
- `push(to, options?)`: Push a new route
- `replace(to, options?)`: Replace current route

### `useEnhancedRouter(router, options)`

A composable that enhances an existing Vue Router instance with native navigation capabilities.

### `NativeNavigationRouter`

A Vue component that provides router integration.

#### Props

- `location`: Current route location
- `options`: Router options with plugin and modal configurations

### `createNativeNavigationState(options?)`

Helper function to create navigation state objects.

#### Options

- `replace?`: Replace current view instead of pushing
- `root?`: Reset stack to just the new view  
- `animated?`: Whether to animate the transition
- `dismiss?`: Dismiss modal before navigating (boolean or component ID)
- `target?`: Target component ID to push to

### `routeToPath(to)`

Convert a route location to a path string.

### `parsePath(path)`

Parse a URL path into pathname, search, and hash components.

## Error Handling

You can provide an error handler when setting up the router:

```typescript
import { alertErrorHandler } from 'capacitor-native-navigation-vue-router'

const routerOptions = {
  plugin: NativeNavigation,
  errorHandler: alertErrorHandler, // or your custom error handler
}
```

## Integration with Vue Router Features

This package is designed to work seamlessly with Vue Router's existing features:

- **Route Guards**: Navigation guards work as expected
- **Route Meta**: Use route meta fields to pass additional data
- **Nested Routes**: Full support for nested routing
- **Dynamic Routes**: Parameter and query handling
- **Navigation Methods**: All router navigation methods are enhanced

## Differences from Web Router

- Navigation methods are asynchronous when using native navigation
- Back navigation uses native back stack instead of browser history
- Modal presentations are handled through native UI
- Views remain mounted when in a stack (similar to keep-alive)