<script setup>
  import { ref } from 'vue'
  import Collapse from '@/components/Collapse/Collapse.vue'
  import CollapseItem from '@/components/Collapse/CollapseItem.vue'
  const openValue = ref(['item1'])
</script>

<template>
    <Collapse v-model="openValue">
      <CollapseItem name="item1" title="默认展开标题1">
        <p>内容段落展示1</p>
      </CollapseItem>
      <CollapseItem name="item2" title="测试标题2">
        <p>内容段落展示2</p>
      </CollapseItem>
      <CollapseItem name="item3" title="测试标题3">
        <div>选项内元素1</div>
        <div>选项内元素2</div>
        <div>选项内元素3</div>
      </CollapseItem>
      <CollapseItem disabled name="item4" title="disabled状态展示">
        <p>disabled状态展示</p>
      </CollapseItem>
    </Collapse>
    <p>openValue: {{ openValue }}</p>
  </template>

  