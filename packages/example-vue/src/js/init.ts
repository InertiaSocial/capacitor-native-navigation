import { NativeNavigation } from 'capacitor-native-navigation'
import { initVue } from 'capacitor-native-navigation-vue'
import type { NativeNavigationVueRouterOptions } from 'capacitor-native-navigation-vue-router'
import App from './App.vue'

export const nativeNavigationVue = initVue({
	plugin: NativeNavigation,
	root: App,
})

export const nativeNavigationNavigatorOptions: NativeNavigationVueRouterOptions = {
	plugin: NativeNavigation,
	modals: [
		{
			path: '/modal/',
			presentOptions(path, state) {
				return {
					component: {
						type: 'stack',
						bar: {
							background: {
								color: '#23ABED',
							},
							title: {
								color: '#223344',
								font: {
									name: 'Solway',
									size: 26,
								},
							},
							buttons: {
								color: '#334455',
								font: {
									name: 'Solway',
								},
							},
						},
						components: [
							{
								type: 'view',
								path,
								state,
								title: 'Test',
								stack: {
									rightItems: [
										{
											id: 'close-button',
											title: 'Close',
										},
									],
								},
							},
						],
					},
					style: 'formSheet',
					cancellable: true,
				}
			},
		},
	],
}
