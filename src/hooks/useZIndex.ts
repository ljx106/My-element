// 计算同类组件在竖直方向上的相对距离
import { computed, ref } from 'vue'

const zIndex = ref(0)
const useZIndex = (initialValue = 2000) => {
    const initialZIndex = ref(initialValue)
    const currentZIndex  = computed( () => zIndex.value + initialZIndex.value)
    const nextZIndex = ()=> {
        zIndex.value++
        return currentZIndex.value
    }
    return {
        currentZIndex,
        nextZIndex,
        initialZIndex
    }
}

export default useZIndex
