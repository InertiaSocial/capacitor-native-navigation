import { defineComponent, onMounted, ref, type PropType } from 'vue'
import { useNativeNavigation } from './internal'
import type { ComponentId } from 'capacitor-native-navigation'

export interface NativeNavigationModalProps {
  id?: ComponentId
  animated?: boolean
}

export default defineComponent({
  name: 'NativeNavigationModal',
  props: {
    id: {
      type: String as unknown as PropType<ComponentId>,
      required: false
    },
    animated: {
      type: Boolean,
      default: true
    }
  },
  emits: ['dismiss'],
  setup(props: NativeNavigationModalProps, { emit, slots }) {
    const { plugin } = useNativeNavigation()
    const modalId = ref<ComponentId>()

    onMounted(() => {
      if (props.id) {
        modalId.value = props.id
      }
    })

    const dismiss = async () => {
      try {
        await plugin.dismiss({
          id: modalId.value,
          animated: props.animated
        })
        emit('dismiss')
      } catch (error) {
        console.error('Failed to dismiss modal:', error)
      }
    }

    // Expose dismiss method for parent components
    return {
      dismiss,
      render() {
        return slots.default?.({
          dismiss
        })
      }
    }
  }
})
