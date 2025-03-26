<template>
  <form class=" vk_form">
    <slot />
  </form>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import  { formContextKey, type FormProps, type FormItemContext, type FormContext, type FormValidateFailure, type FormInstance} from './types';
import FormItem from './FormItem.vue';
import type { ValidateFieldsError } from 'async-validator';

defineOptions({
  name: 'VkForm'
})

const props = defineProps<FormProps>()

const fields: FormItemContext[] = []   // fields为所填信息的集合
const addField: FormContext['addField'] = (field) => {
  fields.push(field)
}
const removeField: FormContext['removeField'] = (field) => {
  if (field.prop){
    fields.splice(fields.indexOf(field), 1)
  }
}

const resetFields = (keys: string[] = []) => {
  const filterArr = keys.length > 0 ? fields.filter( field => keys.includes(field.prop)) : fields
  filterArr.forEach(field => field.resetField())
}

const clearValidate = (keys: string[] = []) => {
  const filterArr = keys.length > 0 ? fields.filter( field => keys.includes(field.prop)) : fields
  filterArr.forEach(field => field.clearValidate())
}

const validate = async ()=> {
  let validationErrors: ValidateFieldsError = {}
  console.log('fields', fields)
  for (const field of fields) {
    try{
      await field.validate('')
    } catch(e) {
      const error = e as FormValidateFailure // catch中不能指定错误具体类型，故而使用类型断言
      validationErrors = {
        ...validationErrors,
        ...error.fields
      }
    }
  }
  if (Object.keys(validationErrors).length === 0) return true
  return  Promise.reject(validationErrors)
}

provide(formContextKey, {
  ...props,
  addField,
  removeField
})

defineExpose<FormInstance>({
  validate,
  clearValidate,
  resetFields
})

</script>

<style  scoped>

</style>
