import { initViewHandler } from 'capacitor-native-navigation'
import type { ComponentId, CreateViewEventData, NativeNavigationPluginInternal, NativeNavigationPlugin, UpdateViewEventData, MessageEventData, ComponentAlias } from 'capacitor-native-navigation'
import type { Plugin } from '@capacitor/core'
import { createApp, type App, type Component } from 'vue'

import { initSync, prepareWindowForSync } from './sync'
import { NativeNavigationVue, NativeNavigationVueView, VueViewListenerEvent, VueViewListenerFunc, toNativeNavigationViewProps } from './types'

export { useNativeNavigationViewContext, provideNativeNavigationViewContext } from './context'
export { NativeNavigationViewProps, NativeNavigationVue } from './types'
export { default as NativeNavigationModal } from './NativeNavigationModal'
export { useNativeNavigation, createNativeNavigationProvider } from './internal'

interface Options {
	plugin: NativeNavigationPlugin & Plugin
	root: Component

	/**
	 * The element id to use for the root in new windows.
	 */
	viewRootId?: string

	/**
	 * An optional error handler to receive unexpected errors from the NativeNavigation plugin
	 */
	errorHandler?: (source: string, error: unknown) => void
}

/**
 * An error handler implementation that presents an alert with details of the error.
 */
export function alertErrorHandler(source: string, error: unknown): void {
	alert(`Native navigation integration failed (${source}): ${error instanceof Error ? error.message : error}`)
}

export function initVue(options: Options): NativeNavigationVue {
	const { plugin, root } = options
	const viewRootId = options.viewRootId || 'root'
	const internalPlugin = plugin as unknown as NativeNavigationPluginInternal
	const views: Record<ComponentId, NativeNavigationVueView> = {}
	const viewsByAlias: Record<ComponentAlias, NativeNavigationVueView> = {}

	initSync(views)

	initViewHandler({
		plugin,
		handler: {
			createView,
			updateView,
			destroyView,
			messageView,
			ready,
		},
	})

	function reportError(source: string, error: unknown) {
		if (error instanceof Error) {
			console.error(`NativeNavigation Vue: ${source}`, error)
		} else {
			console.warn(`NativeNavigation Vue (${source}): ${error}`)
		}

		options.errorHandler?.(source, error)
	}

	function createView(viewWindow: Window, data: CreateViewEventData) {
		const { path, id, alias } = data

		const rootElement = viewWindow.document.getElementById(viewRootId)
		if (rootElement) {
			prepareWindowForSync(viewWindow)

			// Create Vue app instance
			const app = createApp(root, toNativeNavigationViewProps(data, viewWindow) as any)

			const view: NativeNavigationVueView = {
				id,
				alias,
				data,
				props: toNativeNavigationViewProps(data, viewWindow),
				window: viewWindow,
				element: rootElement,
				app,
			}

			views[id] = view
			if (alias) {
				viewsByAlias[alias] = view
			}

			// Mount the Vue app
			app.mount(rootElement)

			fireViewDidChange(view, 'create')
		} else {
			reportError('createView', `Attempted to load view "${path}" but could not find root node: #${viewRootId}`)
		}
	}

	function updateView(viewWindow: Window, data: UpdateViewEventData) {
		const { id } = data

		const view = views[id]
		if (!view) {
			reportError('updateView', `Attempted to update a view that doesn't exist: ${id}`)
			return
		}

		view.data = data
		view.props = toNativeNavigationViewProps(data, viewWindow)

		// Update the Vue app props by unmounting and remounting
		// This is a simplified approach - in a production implementation,
		// you might want to use a more sophisticated reactive update mechanism
		if (view.app) {
			view.app.unmount()
			view.app = createApp(root, view.props as any)
			view.app.mount(view.element)
		}

		fireViewDidChange(view, 'update')
	}

	function messageView(viewWindow: Window, data: MessageEventData) {
		viewWindow.dispatchEvent(new CustomEvent('nativenavigationmessage', { detail: data }))
	}

	function destroyView(id: ComponentId) {
		const view = views[id]
		if (view) {
			// Unmount Vue app
			if (view.app) {
				view.app.unmount()
			}

			delete views[id]
			if (view.alias) {
				delete viewsByAlias[view.alias]
			}
			fireViewDidChange(view, 'remove')
		}
	}

	function ready(view: Window) {
		return !!view.document.getElementById(viewRootId)
	}

	const listeners: VueViewListenerFunc[] = []

	function fireViewDidChange(view: NativeNavigationVueView, event: VueViewListenerEvent) {
		for (const listener of [...listeners]) {
			listener(view, event)
		}
	}

	return {
		plugin,
		addViewsListener(listener) {
			listeners.push(listener)
			return function() {
				const i = listeners.indexOf(listener)
				if (i !== -1) {
					listeners.splice(i, 1)
				}
			}
		},
		views() {
			return views
		},
		view(id) {
			return views[id as ComponentId] || viewsByAlias[id as ComponentAlias]
		},
		fireViewReady(id) {
			internalPlugin.viewReady({
				id,
			}).catch(function(reason: unknown) {
				reportError('viewReady', reason)
			})
		},
	}
}
