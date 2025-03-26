<template>
  <div
    class="vk-input"
    :class="{
        [`vk-input--${type}`]: type,
        [`vk-input--${size}`]: size,
        'is-disabled': disabled,
        'is-prepend': $slots.prepend,
        'is-append': $slots.append,
        'is-prefix': $slots.prefix,
        'is-suffix': $slots.suffix,
        'is-focus': isFocus,
    }"
    >
            <!-- input  -->
            <template v-if="type!='textarea'">
            <!-- prepend  -->
                <div v-if="$slots.prepend" class="vk-input__prepend">
                    <slot name="prepend"/>
                </div>
                <div class="vk-input__wrapper">
                    <!-- prefix slot -->
                     <span v-if="$slots.prefix" class="vk-input__prefix">
                        <slot name="prefix"/>
                     </span>
                     <input 
                        class="vk-input__inner"
                        v-bind="attrs"
                        ref="inputRef"
                        :type="showPassword? (passwordVisible? 'text' : 'password' ) : type"
                        :disabled="disabled"
                        :readonly="readonly"
                        :autocomplete="autocomplete"
                        :placeholder="placeholder"
                        :autofocus="autofocus"
                        :form="form"
                        v-model="innerValue"
                        @input="handleInput"
                        @change="handleChange"
                        @focus="handleFocus"
                        @blur="handleBlur"
                    />
                    <!-- suffix slot -->
                    <span v-if="$slots.suffix || showClear || showPasswordArea" class="vk-input__suffix" @click="keepFocus">
                        <slot name="suffix"/>
                        <!-- 绑定mousedown事件，阻止外层blur事件的触发（blur事件会导致输入栏失焦，无法触发clear） -->
                        <Icon
                            icon="circle-xmark"
                            v-if="showClear"
                            class="vk-input__clear"
                            @click="clear"
                            @mousedown.prevent="NOOP"
                        />
                        <Icon
                            icon="eye"
                            v-if="showPasswordArea && passwordVisible"
                            class="vk-input__password"
                            @click="tooglePasswordVisible"
                        />
                        <Icon
                            icon="eye-slash"
                            v-if="showPasswordArea && !passwordVisible"
                            class="vk-input__password"
                            @click="tooglePasswordVisible"
                        />
                    </span>
                </div>
                <!-- append slot -->
                <div v-if="$slots.append" class="vk-input__append">
                    <slot name="append"/>
                </div>


            </template>


            <!-- textarea -->
                <template v-else>
                    <textarea 
                        class="vk-textarea__wrapper"
                        ref="inputRef"
                        v-bind="attrs"
                        :disabled="disabled"
                        :readonly="readonly"
                        :autocomplete="autocomplete"
                        :placeholder="placeholder"
                        :autofocus="autofocus"
                        :form="form"
                        v-model="innerValue"
                        @input="handleInput"                        
                        @focus="handleFocus"
                        @change="handleChange"
                        @blur="handleBlur"
                    />
                </template>
    </div>
</template>

<script setup lang="ts">
import type { InputProps, InputEmits } from './types'
import { ref, watch, computed, useAttrs, type Ref, inject } from 'vue'
import Icon from '../Icon/Icon.vue'
import { formItemContextKey } from '../Form/types'

defineOptions({
    name:'VkInput',
    inherent: false // 关闭继承属性，采用传入值
})


const props = withDefaults(defineProps<InputProps>(), { type: 'text' , autocomplete: 'off'})
const emits = defineEmits<InputEmits>()
const attrs = useAttrs()
const innerValue = ref(props.modelValue)
const isFocus = ref(false)
const passwordVisible = ref(false)
const inputRef = ref() as Ref<HTMLInputElement>

const formItemContext = inject(formItemContextKey)
const runValidation = (trigger?: string) => { // 使用form表单的验证功能
    formItemContext?.validate(trigger).catch((e) =>console.log(e.errors))
}


const NOOP = () =>{}  // 空函数，用于占位。帮助触发clear时阻止blur事件

const showClear = computed(()=> 
    props.clearable && 
    !props.disabled && 
    !!innerValue.value &&  // !!：转换为布尔值
    isFocus.value  
)

const showPasswordArea = computed(()=>  
    props.showPassword && 
    !props.disabled &&
    !!innerValue.value
)

const tooglePasswordVisible = () => {
    passwordVisible.value = !passwordVisible.value
}

const keepFocus = async ()=>{
    inputRef.value?.focus()  // 让输入栏保持焦点
}

const handleInput =()=>{
    emits('update:modelValue', innerValue.value)
    emits('input', innerValue.value)
    runValidation('input')
}

const handleChange =()=>{
    emits('change', innerValue.value)
    runValidation('change')
}

const handleFocus = (event: FocusEvent) => {
    isFocus.value = true
    emits('focus', event)
}

const handleBlur = (event:FocusEvent) => {
    isFocus.value = false
    emits('blur', event)
    runValidation('blur')  // 输入栏失焦时自动触发验证
}

const clear = () => {
    innerValue.value = ''
    emits('update:modelValue', '')
    emits('clear')
    emits('input','')
    emits('change','')
}

watch(()=> props.modelValue, (newValue)=> {
    innerValue.value = newValue
})

// 将ref属性暴露出去
defineExpose({ 
    ref: inputRef
})
</script>

