<template>
    <div>
      <Form :model="model" :rules="rules" ref="formRef">
        <FormItem label="the email" prop="email">
          <Input v-model="model.email" />
        </FormItem>

        <FormItem label="the password" prop="password">
          <Input type="password" v-model="model.password" />
        </FormItem>

        <FormItem prop="confirmPwd" label="confirm password">
          <Input v-model="model.confirmPwd" type="password" />
        </FormItem>

        <div :style="{ textAlign: 'center' }">
          <Button type="primary" @click.prevent="submit">Submit</Button>
          <Button @click.prevent="reset">Reset</Button>
        </div>
        
      </Form>
      <div>
        form value:
        <pre>{{ model }}</pre>
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { reactive, ref } from 'vue'
  // This starter template is using Vue 3 <script setup> SFCs
  // Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
  import Form from '@/components/Form/Form.vue'
  import FormItem from '@/components/Form/FormItem.vue'
  import Input from '@/components/Input/Input.vue'
  import Button from '@/components/Button/Button.vue'
  const formRef = ref()
  const model = reactive({
    email: '',
    password: '',
    test: '',
    confirmPwd: '',
  })

  const rules = {
    email: [{ type: 'email', required: true, trigger: 'blur', message: '邮件格式不对' }],
    test: [{ type: 'string', required: true, trigger: 'blur', message: 'text is required' }],
    password: [
      { type: 'string', required: true, trigger: 'blur', min: 3, max: 5, message: '密码不安全' },
    ],
    confirmPwd: [
      { type: 'string', required: true, trigger: 'blur', message: '未填' },
      {
        validator: (rule, value) => value === model.password,
        trigger: 'blur',
        message: '两个密码必须相同',
      },
    ],
  }
  
  const submit = async () => {
    try {
      const result = await formRef.value.validate()
      console.log('validateFrom: ', result)
      // console.log('passed!')
    } catch (e) {
      console.log('the error', e)
    }
  }
  const reset = () => {
    formRef.value.resetFields()
  }
  </script>