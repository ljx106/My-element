<template>
  <div
  class="vk-collapse"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
import { provide, ref, watch }  from 'vue'
import type { NameType, CollapseProps, CollapseEmits } from './types';
import { collapseContextKey } from './types'
defineOptions({
    name: 'VkCollapse'
})

const props = defineProps<CollapseProps>()
const emits = defineEmits<CollapseEmits>()

const activeNames = ref<NameType[]>(props.modelValue)

// 因为 props.modelValue 是 响应式对象，如果直接传 props.modelValue，它的值不会被正确监听。
// watch()需要两个参数，监听的值 和 回调函数
watch(()=>props.modelValue, ()=>{
  activeNames.value = props.modelValue
})

// 若accordion mode且activeNames数量大于1，报警
if (props.accordion && activeNames.value.length > 1) {
  console.log(props.accordion)
    console.warn('accordion mode should only have one acitve item')
}


const handleItemClick = (item: NameType) => {
  let _activeNames = [...activeNames.value]
  // 若accordion模式，仅保留一个activeName
  if (props.accordion) {
    _activeNames = [ activeNames.value[0] === item ? '' : item ]
    activeNames.value = _activeNames
  }else{
    const index = _activeNames.indexOf(item)
    if (index === -1) {
      // 若相应index不存在，插入对应name
      _activeNames.push(item)
    } else {
      // 若存在，删除该name
      _activeNames.splice(index, 1)
    }
    activeNames.value = _activeNames
  }
  emits('update:modelValue', _activeNames)
  emits('change', _activeNames)
}

provide(collapseContextKey, {
  activeNames,
  handleItemClick
})

</script>