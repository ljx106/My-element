import { describe, expect, test } from "vitest";
import { mount }  from '@vue/test-utils';
import Collapse from './Collapse.vue';
// import { h } from 'vue'
import CollapseItem from './CollapseItem.vue';

describe('Collapse.vue', ()=> {
    test('basic collapse',async ()=>{
        const wrapper = mount(Collapse, {
            props: {
              'modelValue': ['a']
            },
            slots: {
              default: 
              (<>
                <CollapseItem name="a" title="title a">
                  content a
                </CollapseItem>
                <CollapseItem name="b" title="title b">
                  content b
                </CollapseItem>
                <CollapseItem name="c" title="title c" disabled>
                  content c
                </CollapseItem>
              </>)
            },
            global: {
              stubs: ['Icon']
            },
            attachTo: document.body
          })
        const headers = wrapper.findAll('.vk-collapse-item__header')
        const contents = wrapper.findAll('.vk-collapse-item__content')
        // 长度
        expect(headers.length).toBe(3)
        expect(contents.length).toBe(3)
        // 文本
        const firstHeader = headers[0]
        const secondHeader = headers[1]
        expect(firstHeader.text()).toBe("title a")
        // 内容
        const firstContent = contents[0]
        const secondContent = contents[1]

        expect(firstContent.isVisible()).toBeTruthy() // 默认展开第一个
        expect(secondContent.isVisible()).toBeFalsy()

        // 动作
        await firstHeader.trigger('click') // 触发点击事件
        // console.log("------------",firstContent.html())
        expect(firstContent.isVisible()).toBeFalsy() // 第一个header被点击后收起


        await secondHeader.trigger('click')
        expect(secondContent.isVisible()).toBeTruthy() // 第二个header被点击后展开

        // 捕获动作事件
        expect(wrapper.emitted()).toHaveProperty('change')
        const changeEvent = wrapper.emitted('change') as any[]
        console.table(changeEvent)
        expect(changeEvent).toHaveLength(2)
        expect(changeEvent[0]).toEqual([[]]) 
        expect(changeEvent[1]).toEqual([['b']])


        // disabled
        const disabledHeader = headers[2]
        expect(disabledHeader.classes()).toContain('is-disabled')
    })
})