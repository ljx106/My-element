<script setup lang="ts">
  import { ref, onMounted, h } from 'vue'

  import Button from './components/Button/Button.vue'
  import type { ButtonInstance } from './components/Button/types'

  import Collapse from './components/Collapse/Collapse.vue'
  import Item from './components/Collapse/CollapseItem.vue'

  import  Icon  from './components/Icon/Icon.vue'

  import Tooltip from './components/Tooltip/Tooltip.vue'
  import type { TooltipInstance } from './components/Tooltip/types'
  import type { Options } from '@popperjs/core'

  import Dropdown from './components/Dropdown/Dropdown'
  import type { MenuOption } from './components/Dropdown/types'

  import Message from './components/Message/Message.vue'
  import { createMessage } from './components/Message/method'

  import Input from './components/Input/Input.vue'

  const size = ref<any>('3x')
  const openedValue = ref(['a'])
  const trigger = ref<any>('hover') 
  const buttonRef = ref<ButtonInstance | null>(null)
  const tooltipRef = ref<TooltipInstance | null>(null) // tooltip配置项
  // const options: Partial<Options> = { placement: 'right-end', strategy: 'fixed'} // tooltip配置项
    const options: MenuOption[] = [
      { key: 1, label: h('b','this is bold')},
      { key: 2, label: 'item2', disabled: true},
      { key: 3, label: 'item3', divided: true},
      { key: 4, label: 'item4'}
    ]

  const open = () => {
    tooltipRef.value?.show()
  }
  const close = () => {
    tooltipRef.value?.hide()
  }

  onMounted( () => {
    const instance = createMessage({ message: 'MS hello world' , showClose: true, type: 'success'})
    createMessage({ message: 'MS hello world again', duration: 0, showClose: true, type:'info'   })
    createMessage({ message: 'MS hello world three', duration: 0, showClose: true, type: 'danger' })
    if ( buttonRef.value){
      console.log('buttonRef', buttonRef.value.ref)
    } 

    setTimeout(() => {
      // openedValue.value = ['a','b']
      size.value = '2xl'
      // trigger.value = 'hover'
      // instance.destroy()
    }, 2000);
  })




  const testClick = () => {
    alert("自定义组件点击功能测试")
  }

  const inlineConsole = (...args:any)=>{
    console.log(...args)
  }
</script>

<template>
  <header>
    <Dropdown 
      placement="bottom" 
      :trigger="trigger" 
      :menu-options="options"
      @visible-change="e=>inlineConsole('visible-change',e)"
      @select="e=>inlineConsole('select',e)"
      manual
      ref="tooltipRef"
    >
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125"/>
    </Dropdown>
  </header>
  <Icon icon="arrow-up" :size="size" spin type="danger" />
  <main>
    <Button ref="buttonRef" @click="open">Test Button</Button>
    <Button plain @click="close">Plain Button</Button>
    <Button round>Round Button</Button>
    <Button circle>VK</Button>
    <Button disabled>Disabled Button</Button>
    <br/><br/>
    <Button type="primary">Primary</Button>
    <Button type="success">Success</Button>
    <Button type="info">Info</Button>
    <Button type="warning">Warning</Button>
    <Button type="danger">Danger</Button>
    <br/><br/>
    <Button type="primary"plain>Primary</Button>
    <Button type="success" plain>Success</Button>
    <Button type="info" plain>Info</Button>
    <Button type="warning"plain>Warning</Button>
    <Button type="danger" plain>Danger</Button>
    <br/><br/>
    <Button size="large">Large</Button>
    <Button size="small">Small</Button>
    <br/><br/>
    <Button size="large" loading>Loading</Button>
    <Button size="large" icon="arrow-up" >Icon</Button><br/><br/>

    <Collapse v-model="openedValue" accordion>
      <Item name="a">
        <template #title>
          <h1>Title A</h1>
        </template>
        <h1>headline title</h1>
        <div>this is content a aaa</div>
      </Item>

      <Item name="b"title="Title B">
        <div> this is bbbbb test </div>
      </Item>

      <Item name="c"title="Disabled Title" disabled>
        <div>this is cccc test </div>
      </Item>
    </Collapse>
    
  </main>
  {{ openedValue }}
</template>

<style scoped>
</style>
