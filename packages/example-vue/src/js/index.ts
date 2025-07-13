import { SplashScreen } from '@capacitor/splash-screen'
import { createApp, h } from 'vue'

import Home from './Home.vue'
import { nativeNavigationVue } from './init'
import { createNativeNavigationProvider } from 'capacitor-native-navigation-vue'

import './app.css'

// Create provider component for the main window
const NativeNavigationProvider = createNativeNavigationProvider(nativeNavigationVue)

// Create app with provider wrapping Home component
const app = createApp({
	setup() {
		return () => h(NativeNavigationProvider, {}, {
			default: () => h(Home)
		})
	}
})

app.mount('#root')

SplashScreen.hide({
	fadeOutDuration: 100,
})
