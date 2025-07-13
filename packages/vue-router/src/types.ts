import type { ComponentId, NativeNavigationPlugin, MessageEventData, PresentOptions } from 'capacitor-native-navigation'
import type { Plugin } from '@capacitor/core'
import type { RouteLocationNormalized } from 'vue-router'

export interface ModalConfig {
	/**
	 * The path prefix for views that should be in the modal
	 */
	path: string

	/**
	 * A function to return the component specification for the view to present for the modal
	 */
	presentOptions(path: string, state?: unknown): PresentOptions
}

export interface NativeNavigationVueRouterOptions {
	plugin: NativeNavigationPlugin & Plugin

	/**
	 * Modal configurations for handling modal presentations
	 */
	modals?: ModalConfig[]

	/**
	 * An optional error handler to receive unexpected errors from navigation
	 */
	errorHandler?: (source: string, error: unknown) => void
}

export interface NativeNavigationState {
	/**
	 * If true, replaces the current view instead of pushing a new one
	 */
	replace?: boolean

	/**
	 * If true, resets the stack to just the new view
	 */
	root?: boolean

	/**
	 * Target component ID to push to
	 */
	target?: ComponentId

	/**
	 * Whether to animate the transition
	 */
	animated?: boolean

	/**
	 * If true, dismisses the current modal
	 * If string, dismisses the modal with the specified ID
	 */
	dismiss?: boolean | string
}

export interface NavigateMessageData {
	to: string | RouteLocationNormalized
	options?: { replace?: boolean; state?: any }
}
