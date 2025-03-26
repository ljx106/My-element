<template>
  <i class="vk-icon" :class="{[`vk-icon--${type}`] : type }" :style="customStyles" v-bind="$attrs">
    <font-awesome-icon v-bind="filteredProps" />
  </i>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {omit} from "lodash-es"
import type { IconProps} from './types'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineOptions({
    name: 'VkIcon',
    inheritAttrs: false, // 禁用属性透传 
})

//  使用自定义组件属性
const props = defineProps<IconProps>()

// 过滤掉不需要的props
const filteredProps = computed( () => omit(props, ['type','color'] )) 


// 支持用户通过color属性定义颜色
const customStyles = computed(() =>{
  return props.color ? { color : props.color } : {}
})
</script>

