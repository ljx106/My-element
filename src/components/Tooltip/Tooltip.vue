<template>
  <div 
    class="vk-tooltip"
    ref="popperContainerNode"
    v-on="outerevents"
    >
    <div
        class="vk-tooltip__trigger"
        ref="triggerNode"
        v-on="events"
    >
        <slot />
    </div>

    <Transition :name="transitionName">
        <div
            v-if="isOpen"
            class="vk-tooltip__popper"
            ref="popperNode"
            :style="`${width ? `width:${width}px` : ''}`"
        >
            <slot name="content">{{ content }}</slot>
            <div id="arrow" data-popper-arrow></div>
        </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onUnmounted, computed } from 'vue';
import { createPopper, type Instance } from '@popperjs/core'
import type { TooltipProps, TooltipEmits, TooltipInstance} from './types'
import useClickOutside from '../../hooks/useClickOutside'
import { debounce } from 'lodash-es'

defineOptions({
    name : "VkTooltips"
})
const props = withDefaults(defineProps<TooltipProps>(),{
    placement: 'bottom',
    trigger: 'hover',
    transition: 'fade',
    openDelay: 0,
    closeDelay: 0,
})

const emits = defineEmits<TooltipEmits>()
const isOpen = ref(false)
const popperNode = ref<HTMLElement>()
const triggerNode = ref<HTMLElement>()
const popperContainerNode = ref<HTMLElement>()

let popperInstance: null | Instance = null
let events : Record<string,any> = reactive({})
let outerevents : Record<string,any> = reactive({})
// let openTimes = 0 
// let closeTimes = 0 

// types.ts中引入了Options，为了避免对属性placement的覆盖，在此处将placement作为属性传入，其余属性从Options中取得
const popperOptions = computed(()=>{
    return  {
        placement: props.placement,
        modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 9],
        },
      },      
    ],   
        ...props.popperOptions 
    }
})



const open = () => {
    // openTimes++
    // console.log('open times', openTimes)
    isOpen.value = true
    emits('visible-change', true)
    
}
const close = () => {
    // closeTimes++ 
    // console.log('close times', closeTimes)
    isOpen.value = false
    emits('visible-change', false)
}

// 事件防抖
const openDebounce = debounce( open, props.openDelay)
const closeDebounce = debounce( close, props.closeDelay) 

const openFinal = () => {
    closeDebounce.cancel()
    openDebounce()
}
const closeFinal = () => {
    openDebounce.cancel()
    closeDebounce()
}

const togglePopper = () => {
    if ( isOpen.value) {
        closeDebounce()
    } else {
        openFinal()
    }
}

useClickOutside(popperContainerNode, () =>{  // 实现点击悬浮窗外部关闭效果
    if (props.trigger == 'click' && isOpen.value && !props.manual) {
        closeFinal()
    }
    if (isOpen.value) {
        emits('click-outside',true)
    }
})

const attachEvents = () => {
    if (props.trigger =='hover') {
        events['mouseenter'] = openFinal
        outerevents['mouseleave'] = closeFinal // 解决鼠标移动到悬浮窗上，悬浮窗也会消失的问题，现将hover范围扩大到整个tooltip范围，包括悬浮窗
    }else if (props.trigger =='click'){
        events['click'] = togglePopper
    }
}

if (!props.manual){
    attachEvents() 
}

watch(()=>props.manual, (isManual) =>{
    if (isManual){ // manual模式下，清空鼠标事件
        events = {}
        outerevents = {}
    }else {
        attachEvents() // 否则触发一次事件
    }
})

watch(()=> props.trigger, (newtrigger, oldtrigger) =>{
    if ( oldtrigger != newtrigger) {
        // clear events
        events = {}
        outerevents = {}
        attachEvents()
    } 
})

watch(isOpen, (newValue) => {
  if (newValue) {
    if (triggerNode.value && popperNode.value) {
      popperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value)
    } else {
      popperInstance?.destroy()
    }
  }
}, { flush: 'post'})

onUnmounted(()=>{  // 卸载时清除实例
    popperInstance?.destroy()
})

defineExpose<TooltipInstance>({
    'show': openFinal,
    'hide': closeFinal
})
</script>
