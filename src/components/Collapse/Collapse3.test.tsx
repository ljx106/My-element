import { describe, expect, test } from "vitest";
import { mount }  from '@vue/test-utils';
import Collapse from './Collapse.vue';
import CollapseItem from './CollapseItem.vue';

describe('Collapse', () => {
    test('accrodion collapse', async () => {
        const wrapper = mount(Collapse, {
            props: {
                modelValue: ['a'],
                accordion: true,
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

        const firstHeader = headers[0]
        const secondHeader = headers[1]
        // 长度
        expect(headers.length).toBe(3)
        expect(contents.length).toBe(3)
        expect(firstHeader.classes()).toContain('is-active') // 初始时默认title a展开
        expect(secondHeader.classes()).not.toContain('is-active')// 初始时title b未展开

        await secondHeader.trigger('click')
        expect(firstHeader.classes()).not.toContain('is-active')// 点击title b后，a收起
        expect(secondHeader.classes()).toContain('is-active')//b展开
    });
});