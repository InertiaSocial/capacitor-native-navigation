import type { ComponentId, CreateViewEventData, NativeNavigationPlugin, ComponentAlias } from 'capacitor-native-navigation'
import type { Plugin } from '@capacitor/core'
import type { App, Component } from 'vue'

export interface NativeNavigationViewProps {
	componentId: ComponentId
	path: string
	search: string
	hash: string
	state: unknown
	stack?: ComponentId
	pathname: string
	href: string
}

export interface NativeNavigationVueView {
	id: ComponentId
	alias?: ComponentAlias
	data: CreateViewEventData
	props: NativeNavigationViewProps
	window: Window
	element: HTMLElement
	app?: App
}

export type VueViewListenerEvent = 'create' | 'update' | 'remove'
export type VueViewListenerFunc = (view: NativeNavigationVueView, event: VueViewListenerEvent) => void

export interface NativeNavigationVue {
	plugin: NativeNavigationPlugin & Plugin
	addViewsListener(listener: VueViewListenerFunc): () => void
	views(): Record<ComponentId, NativeNavigationVueView>
	view(id: ComponentId | ComponentAlias): NativeNavigationVueView | undefined
	fireViewReady(id: ComponentId): void
}

export interface NativeNavigationVueRootProps extends NativeNavigationViewProps {}

export function toNativeNavigationViewProps(data: CreateViewEventData, viewWindow: Window): NativeNavigationViewProps {
	const path = data.path || ''
	const url = new URL(path, viewWindow.location.origin)

	return {
		componentId: data.id,
		path: path,
		search: url.search,
		hash: url.hash,
		state: data.state,
		stack: data.stack,
		pathname: url.pathname,
		href: path,
	}
}
