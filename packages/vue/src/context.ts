import { inject, provide, type InjectionKey, type ComputedRef, computed, type Ref, ref } from 'vue'
import type { ComponentId, MessageEventData } from 'capacitor-native-navigation'
import type { NativeNavigationViewProps } from './types'

export interface NativeNavigationViewContext {
	componentId: ComponentId
	path?: string
	search?: string
	hash?: string
	state?: unknown
	stack?: ComponentId
	pathname?: string
	href?: string
	addMessageListener<T = unknown>(type: string, listener: (data: MessageEventData<T>) => void): void
	removeMessageListener<T = unknown>(type: string, listener: (data: MessageEventData<T>) => void): void
}

const NativeNavigationViewContextKey: InjectionKey<ComputedRef<NativeNavigationViewContext | undefined>> = Symbol('NativeNavigationViewContext')

export function provideNativeNavigationViewContext(props: Ref<NativeNavigationViewProps | undefined>): void {
	const context = computed(() => {
		if (!props.value) return undefined

		const messageListeners = new Map<string, Set<(data: MessageEventData) => void>>()

		function addMessageListener<T = unknown>(type: string, listener: (data: MessageEventData<T>) => void): void {
			if (!messageListeners.has(type)) {
				messageListeners.set(type, new Set())
			}
			messageListeners.get(type)!.add(listener as (data: MessageEventData) => void)

			// Add DOM event listener
			window.addEventListener('nativenavigationmessage', (event: Event) => {
				const customEvent = event as CustomEvent<MessageEventData>
				if (customEvent.detail?.type === type) {
					listener(customEvent.detail as MessageEventData<T>)
				}
			})
		}

		function removeMessageListener<T = unknown>(type: string, listener: (data: MessageEventData<T>) => void): void {
			const listeners = messageListeners.get(type)
			if (listeners) {
				listeners.delete(listener as (data: MessageEventData) => void)
				if (listeners.size === 0) {
					messageListeners.delete(type)
				}
			}

			// Remove DOM event listener
			window.removeEventListener('nativenavigationmessage', listener as unknown as EventListener)
		}

		return {
			componentId: props.value.componentId,
			path: props.value.path,
			search: props.value.search,
			hash: props.value.hash,
			state: props.value.state,
			stack: props.value.stack,
			pathname: props.value.pathname,
			href: props.value.href,
			addMessageListener,
			removeMessageListener,
		}
	})

	provide(NativeNavigationViewContextKey, context)
}

export function useNativeNavigationViewContext(): NativeNavigationViewContext | undefined {
	const context = inject(NativeNavigationViewContextKey)
	return context?.value
}
