<template>
    <div
      class="vk-switch"
      :class="{
        [`vk-switch--${size}`]: size,
        'is-disabled': disabled,
        'is-checked': checked
      }"
      @click="switchValue"
    >
      <input 
        class="vk-swtich__input"
        type="checkbox"
        role="switch"
        ref="input"
        :name="name"
        :disabled="disabled"
        @keydown.enter="switchValue"
      />
    <div class="vk-switch__core">
      <div class="vk-switch__core-inner">
        <span v-if="activeText || inactiveText" class="vk-switch__core-innert-ext">
          {{  checked? activeText: inactiveText}}
        </span>
      </div>
        <div class="vk-switch__core-action"></div>
    </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { SwitchProps, SwitchEmits } from './types'

defineOptions({
  name: 'VKSwitch',
  inheritAttrs: false
})

const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false
})

const emits = defineEmits<SwitchEmits>()

const innerValue = ref(props.modelValue)

const input = ref<HTMLInputElement>()

// 现在是否被选中
const checked = computed(() => innerValue.value === props.activeValue)

const switchValue = () => {
  if (props.disabled) return
  const newValue = checked.value ? props.inactiveValue : props.activeValue
  console.log(props)
  innerValue.value = newValue
  emits('update:modelValue', newValue)
  emits('change', newValue)
}

onMounted(() => {
  input.value!.checked = checked.value
})

watch(checked, (val) => {
  input.value!.checked = val 
})

watch(() => props.modelValue, (newValue) => {
  innerValue.value = newValue
})

</script>