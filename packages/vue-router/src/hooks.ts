import type { MessageEventData } from 'capacitor-native-navigation'
import { useNativeNavigation, useNativeNavigationViewContext } from 'capacitor-native-navigation-vue'
import { computed, onMounted, onUnmounted, type Ref } from 'vue'
import type { Router, RouteLocationNormalized } from 'vue-router'
import type { NativeNavigationVueRouterOptions, NavigateMessageData } from './types'
import { findModalConfig, ignoreUntilDone, toNativeNavigationState, routeToPath } from './utils'

const NAVIGATOR_NAVIGATE_MESSAGE_TYPE = 'capacitor-native-navigation-vue-router:navigate'

/**
 * A composable that creates a router instance integrated with Capacitor Native Navigation
 */
export function useNativeNavigationRouter(options: NativeNavigationVueRouterOptions) {
	const { plugin } = useNativeNavigation()
	const context = useNativeNavigationViewContext()

	const currentPath = computed(() => context?.path)
	const componentId = computed(() => context?.componentId)
	const stack = computed(() => context?.stack)

	const currentModal = computed(() =>
		currentPath.value ? findModalConfig(currentPath.value, options) : undefined
	)

	const reportError = (source: string, error: unknown) => {
		if (error instanceof Error) {
			console.error(`NativeNavigation Vue Router: ${source}`, error)
		} else {
			console.warn(`NativeNavigation Vue Router (${source}): ${error}`)
		}

		options.errorHandler?.(source, error)
	}

	const go = async (delta: number): Promise<void> => {
		if (delta < 0) {
			if (stack.value) {
				try {
					const result = await plugin.pop({
						count: -delta,
						stack: stack.value,
					})
					if (result.count === 0) {
						// If there was nothing to pop, and we're in a navigation-driven modal, dismiss it
						if (currentModal.value) {
							await plugin.dismiss()
						}
					}
				} catch (error) {
					reportError('pop', error)
					throw error
				}
			} else {
				console.warn(`Failed to pop as component ${componentId.value} is not in a stack`)
			}
		} else if (delta > 0) {
			throw new Error('go(delta) is not implemented for going forward')
		}
	}

	const push = async (
		to: string | RouteLocationNormalized,
		navOptions?: { replace?: boolean; state?: any }
	): Promise<void> => {
		const state = navOptions?.state
		const navigationState = toNativeNavigationState(state)

		if (typeof navigationState?.dismiss === 'string') {
			try {
				await plugin.dismiss({
					id: navigationState.dismiss,
				})
			} catch (error) {
				reportError('dismiss', error)
				throw error
			}
		} else if (typeof navigationState?.dismiss === 'boolean') {
			try {
				await plugin.dismiss()
			} catch (error) {
				reportError('dismiss', error)
				throw error
			}
		}

		const path = routeToPath(to)

		const targetModal = findModalConfig(path, options)
		if (targetModal) {
			if (!currentModal.value || targetModal !== currentModal.value) {
				// New modal
				const presentOptions = targetModal.presentOptions(path, state)
				try {
					await plugin.present(presentOptions)
				} catch (error) {
					reportError('push modal', error)
					throw error
				}
				return
			}
		} else if (currentModal.value) {
			// Close this modal
			plugin.dismiss({
				id: stack.value || componentId.value,
			}).catch(function(reason) {
				reportError('dismiss', reason)
			})

			// Then get the new top view to handle this navigation
			await plugin.message<NavigateMessageData>({
				type: NAVIGATOR_NAVIGATE_MESSAGE_TYPE,
				value: {
					to,
					options: navOptions,
				},
			})
			return
		}

		const replace = !!(navOptions?.replace || navigationState?.replace)
		try {
			await plugin.push({
				component: {
					type: 'view',
					path,
					state: state as any,
				},
				mode: navigationState?.root ? 'root' : replace ? 'replace' : undefined,
				target: navigationState?.target || stack.value || componentId.value,
				animated: navigationState?.animated,
			})
		} catch (error) {
			reportError(replace ? 'replace' : 'push', error)
			throw error
		}
	}

	const replace = async (
		to: string | RouteLocationNormalized,
		navOptions?: { replace?: boolean; state?: any }
	): Promise<void> => {
		return push(to, navOptions ? { ...navOptions, replace: true } : { replace: true })
	}

	// Handle navigate requests from closing modals
	onMounted(() => {
		if (!context) return

		function navigateMessageListener(data: MessageEventData<NavigateMessageData>) {
			const targetPath = routeToPath(data.value.to)

			// Decide whether to replace what's already here, or to push
			if (currentPath.value === targetPath) {
				replace(data.value.to, data.value.options)
			} else {
				push(data.value.to, data.value.options)
			}
		}

		context.addMessageListener(NAVIGATOR_NAVIGATE_MESSAGE_TYPE, navigateMessageListener)

		onUnmounted(() => {
			context.removeMessageListener(NAVIGATOR_NAVIGATE_MESSAGE_TYPE, navigateMessageListener)
		})
	})

	return {
		go: ignoreUntilDone(go),
		push: ignoreUntilDone(push),
		replace: ignoreUntilDone(replace),
	}
}

/**
 * A composable that enhances a Vue Router instance with native navigation capabilities
 */
export function useEnhancedRouter(
	router: Router,
	options: NativeNavigationVueRouterOptions
) {
	const nativeRouter = useNativeNavigationRouter(options)

	// Override router methods to use native navigation
	const originalPush = router.push.bind(router)
	const originalReplace = router.replace.bind(router)
	const originalGo = router.go.bind(router)

	router.push = async (to: any) => {
		try {
			await nativeRouter.push(to)
		} catch (error) {
			// Fallback to regular router on error
			return originalPush(to)
		}
	}

	router.replace = async (to: any) => {
		try {
			await nativeRouter.replace(to)
		} catch (error) {
			// Fallback to regular router on error
			return originalReplace(to)
		}
	}

	router.go = (delta) => {
		try {
			nativeRouter.go(delta)
		} catch (error) {
			// Fallback to regular router on error
			originalGo(delta)
		}
	}

	return router
}
