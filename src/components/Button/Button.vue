<template>
    <button
        ref="_ref"
        class = "vk-button"
        :class="{
            [`vk-button--${type}`]: type,
            [`vk-button--${size}`]: size,
            'is-plain': plain,
            'is-round': round,
            'is-circle': circle,
            'is-disabled': disabled,
            'is-loading': loading,

        }"
        :disabled="disabled || loading"
        :autofocus="autofocus"
        :type="nativeType"
    >
        <Icon icon="spinner" spin v-if="loading" />
        <Icon :icon="icon" v-if="icon" />
        <span>
            <slot />
        </span>
    </button>
    
</template>
<!-- <script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'VkButton'
    })
</script> -->
<script setup lang="ts">
    import { ref } from 'vue' 
    import type { ButtonProps } from './types.ts'
    import  Icon  from '../Icon/Icon.vue'
    // import { buttonProps } from './types.ts'

    // defineProps(buttonProps)
    defineOptions({
        name: 'VkButtonn'
    })
    
    withDefaults(defineProps<ButtonProps>(),{
        nativeType: 'button'
    })
    

    const _ref = ref<HTMLButtonElement>()

    defineExpose({
        ref: _ref
    })
</script>