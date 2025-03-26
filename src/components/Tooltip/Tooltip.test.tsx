import { describe, test, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Tooltip from './Tooltip.vue'

const onVisibleChange = vi.fn()
describe('Tooltip.vue', () => {
    beforeEach(()=>{
        vi.useFakeTimers() // 生成假timer
    })
    test('basic tooltip' ,async () => {
        const wrapper = mount(()=>
            <div>
                <div id="outside"></div>
                <Tooltip content="hello tooltip" trigger='click' onVisible-change={onVisibleChange}>
                <button id="trigger">Trigger</button>
            </Tooltip>
            </div>
            
            ,{
                attachTo: document.body     
        })
        // 静态测试
        const triggerArea = wrapper.find('#trigger')
        expect(triggerArea.exists()).toBeTruthy() 
        expect(wrapper.find('.vk-tooltip__popper').exists()).toBeFalsy()
        console.log('before',wrapper.html())
        // 测试点击行为
        // 初次点击打开
        triggerArea.trigger('click')
        await vi.runAllTimers() // 使timer完成运行
        expect(wrapper.find('.vk-tooltip__popper').exists()).toBeTruthy()
        expect(wrapper.get('.vk-tooltip__popper').text()).toBe('hello tooltip')
        expect(onVisibleChange).toHaveBeenCalledWith(true)
        console.log('after',wrapper.html())
        // 再次点击关闭
        wrapper.get('#outside').trigger('click') // 主动设置外侧区域点击事件，测试外侧点击关闭效果，成功关闭
        await vi.runAllTimers()
        expect(wrapper.find('.vk-tooltip__popper').exists()).toBeFalsy()
        expect(onVisibleChange).toHaveBeenLastCalledWith(false)
    })
})