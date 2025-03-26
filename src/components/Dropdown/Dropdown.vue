<template>
    <div 
        class="vk-dropdown"
    >
    <Tooltip 
        :placement="placement" 
        :trigger="trigger"
        :popper-options="popperOptions"
        :openDelay="openDelay" 
        :closeDelay="closeDelay"
        @visible-change="visibleChange"
        ref="tooltipRef" 
    >
        <slot />
        <template #content>
            <ul class="vk-dropdown__menu">
                <template v-for="item in menuOptions" :key="item.key">
                    <li     
                        v-if="item.divided"
                        role="separator"
                        class="divided-placeholder"
                    />
                    <li
                        class="vk-dropdown__item"
                        @click="itemClick(item)"
                        :class="{'is-disabled': item.disabled, 'is-divided': item.divided }"
                        :id="`dropdown-item-${item.key}`"
                    >
                        <RenderVnode :v-node="item.label" />
                    </li>
                </template>
            </ul>
        </template>
    </Tooltip>
    </div>
</template>



<script setup lang="ts">
import type { DropdownInstance, DropdownProps, DropdownEmits,MenuOption, } from './types';  
import { renderVNode } from 'vue/server-renderer'
import { ref, type Ref } from 'vue'
import type { TooltipInstance } from '../Tooltip/types';
import Tooltip from '../Tooltip/Tooltip.vue';
import RenderVnode from '../Common/RenderVnode.ts';
import VNode from '@/VNode';

defineOptions({
    name: 'VkDropdown'
})
const props = withDefaults(defineProps<DropdownProps>(), { hideAfterClick: true })
const emits = defineEmits<DropdownEmits>()
const tooltipRef = ref() as Ref<TooltipInstance>

const visibleChange=(e: boolean) => {
    emits('visible-change', e)
}

const itemClick = (e:MenuOption)=>{
    if (e.disabled){ // 不可点击项直接返回
        return
    }

    // 可点击项触发事件并关闭悬浮窗
    emits('select',e)
    if (props.hideAfterClick){
        tooltipRef.value?.hide()
    }
}

defineExpose<DropdownInstance>({
    show: tooltipRef.value?.show,
    hide: tooltipRef.value?.hide,
})
</script>

  