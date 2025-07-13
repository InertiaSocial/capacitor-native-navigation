import type { RouteLocationNormalized } from 'vue-router'
import type { ModalConfig, NativeNavigationState, NativeNavigationVueRouterOptions } from './types'

/**
 * Find the modal configuration that matches the given path
 */
export function findModalConfig(path: string, options: NativeNavigationVueRouterOptions): ModalConfig | undefined {
	return options.modals?.find(modal => path.startsWith(modal.path))
}

/**
 * Convert Vue Router state to NativeNavigation state
 */
export function toNativeNavigationState(state: unknown): NativeNavigationState | undefined {
	if (typeof state === 'object' && state !== null) {
		return state as NativeNavigationState
	}
	return undefined
}

/**
 * Create a navigation state object for Vue Router
 */
export function createNativeNavigationState(options: Partial<NativeNavigationState> = {}): NativeNavigationState {
	return {
		replace: false,
		root: false,
		animated: true,
		...options,
	}
}

/**
 * Convert a route location to a path string
 */
export function routeToPath(to: string | RouteLocationNormalized): string {
	if (typeof to === 'string') {
		return to
	}

	let path = to.path
	if (to.query && Object.keys(to.query).length > 0) {
		const searchParams = new URLSearchParams()
		for (const [key, value] of Object.entries(to.query)) {
			if (Array.isArray(value)) {
				value.forEach(v => searchParams.append(key, String(v)))
			} else if (value !== null && value !== undefined) {
				searchParams.append(key, String(value))
			}
		}
		path += `?${searchParams.toString()}`
	}
	if (to.hash) {
		path += to.hash
	}

	return path
}

/**
 * Helper to ignore rapid successive calls until the current operation is done
 */
export function ignoreUntilDone<T extends unknown[], R>(
	fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
	let pending: Promise<R> | undefined

	return async function(...args: T): Promise<R> {
		if (pending) {
			return pending
		}

		pending = fn(...args)
		try {
			return await pending
		} finally {
			pending = undefined
		}
	}
}

/**
 * Parse a URL path into its components
 */
export function parsePath(path: string): { pathname: string; search: string; hash: string } {
	try {
		const url = new URL(path, 'http://localhost')
		return {
			pathname: url.pathname,
			search: url.search,
			hash: url.hash,
		}
	} catch {
		// Fallback for invalid URLs
		const hashIndex = path.indexOf('#')
		const searchIndex = path.indexOf('?')

		let pathname = path
		let search = ''
		let hash = ''

		if (hashIndex !== -1) {
			hash = path.slice(hashIndex)
			pathname = path.slice(0, hashIndex)
		}

		if (searchIndex !== -1 && (hashIndex === -1 || searchIndex < hashIndex)) {
			search = path.slice(searchIndex, hashIndex !== -1 ? hashIndex : undefined)
			pathname = path.slice(0, searchIndex)
		}

		return { pathname, search, hash }
	}
}
