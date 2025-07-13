import { inject, provide, type InjectionKey, defineComponent } from 'vue'
import type { NativeNavigationVue } from './types'

const NativeNavigationKey: InjectionKey<NativeNavigationVue> = Symbol('NativeNavigation')

export function provideNativeNavigation(nativeNavigation: NativeNavigationVue): void {
	provide(NativeNavigationKey, nativeNavigation)
}

export function useNativeNavigation(): NativeNavigationVue {
	const nativeNavigation = inject(NativeNavigationKey)
	if (!nativeNavigation) {
		throw new Error('useNativeNavigation must be used within a NativeNavigationProvider')
	}
	return nativeNavigation
}

export interface InternalContextProviderProps {
	nativeNavigation: NativeNavigationVue
}

// Vue 3 doesn't have a direct equivalent to React's Context.Provider
// Instead, we use the provide/inject system with a composable pattern
export function createNativeNavigationProvider(nativeNavigation: NativeNavigationVue) {
	return defineComponent({
		setup(_, { slots }) {
			provideNativeNavigation(nativeNavigation)
			return () => slots.default?.()
		}
	})
}
