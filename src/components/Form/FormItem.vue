<template>
  <div
    class="vk-form-item"
    :class="{
        'is-error': validateStatus.state === 'error',
        'is-success': validateStatus.state === 'success',
        'is-loading': validateStatus.loading,
        'is-required': isRequired
    }"
  >
    <label class="vk-form-item__label" >
        <slot name="label" :label="label" >
            {{ label }}
        </slot>
    </label>
    <div class="vk-form-item__content">
        <slot :validate="validate" />
        <div class="vk-form-item__error-msg" v-if="validateStatus.state === 'error'">
            {{ validateStatus.errorMsg }}
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, reactive, provide, onMounted, onUnmounted } from 'vue';
import { formContextKey,  formItemContextKey } from './types';
import type { FormItemProps, FormValidateFailure, FormItemContext, ValidateStatusProp, FormItemInstance } from './types'
import { isNil } from 'lodash-es'
import   Schema  from 'async-validator'

defineOptions({
  name: 'VKForItem'
})

const props = defineProps<FormItemProps>()

const formContext = inject(formContextKey);
const validateStatus: ValidateStatusProp = reactive({
    state: 'init',
    errorMsg: '',
    loading: false,
})
let initialValue: any = null
const innerValue = computed(()=>{
    const model = formContext?.model
    if (model && props.prop && !isNil(model[props.prop])){
        return model[props.prop]
    }else{
        return null
    }
})

const itemRules = computed(()=>{
    const rules = formContext?.rules
    if (rules && props.prop && !isNil(rules[props.prop])){
        return rules[props.prop]
    }else{
        return []
    }
})
const getTriggeredRules = (trigger?:string) => {
    const rules = itemRules.value
    if (rules) {
        return rules.filter(rule => {
            if (!rule.trigger || !trigger) return true
            return rule.trigger && rule.trigger === trigger
        })
    }else {
        return []
    }
}

const isRequired = computed(()=>{
    return itemRules.value.some(rule => rule.required)
})

const validate = async (trigger?:string) => { // 使用async，自动转化成promise函数
    const triggeredRules = getTriggeredRules(trigger)
    if ( triggeredRules.length === 0) return true // 没有验证规则时，直接通过
    const modelName = props.prop
    if (modelName) {
        const validator = new Schema({
            [modelName]: triggeredRules
        })
        validateStatus.loading = true // 处于验证状态
        return validator.validate({ [modelName]: innerValue.value }) // validator对象的validate方法返回值是一个promise对象
        .then(() => {
            validateStatus.state = 'success'
        })
        .catch( (e: FormValidateFailure) => {
            const  { errors } = e 
            validateStatus.state = 'error'
            validateStatus.errorMsg= (errors && errors.length > 0) ? errors[0].message || '' : ''
            console.log(e.errors)
            return Promise.reject(e)
        })
        .finally(()=>{
            validateStatus.loading = false
        })
    }
}

const clearValidate = () => {
  validateStatus.state = 'init'
  validateStatus.errorMsg = ''
  validateStatus.loading = false
}
const resetField = () => {  // 清空信息并重置状态
  clearValidate()
  const model = formContext?.model
  if (model && props.prop && !isNil(model[props.prop])) {
    model[props.prop] = initialValue
  }
}


const context: FormItemContext = {
    validate,
    prop: props.prop || '',
    clearValidate,
    resetField,
} 
provide(formItemContextKey, context)


onMounted(() => {
    if (props.prop){
        formContext?.addField(context)
        initialValue = innerValue.value 
    }
})
onUnmounted(() => {
    formContext?.removeField(context)
})

defineExpose<FormItemInstance>({
    validateStatus,
    validate,
    resetField,
    clearValidate,
})

</script>

<style  scoped>

</style>
