import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Icon from '../Icon/Icon.vue'

describe('Button.vue', () => { 
    test('basic button', () => {
        const wrapper = mount(Button, {
            props:{
                type: 'primary'
            },
            slots: {
                default: 'button'
            }
        })
        console.log(wrapper.html())
        expect(wrapper.classes()).toContain('vk-button--primary')
        // slot
        // get,find，对于不存在的组件，get会报错，find则继续查找
        expect(wrapper.get('button').text()).toBe('button')
        // events事件测试
        wrapper.get('button').trigger('click')
        console.log(wrapper.emitted())
        expect(wrapper.emitted()).toHaveProperty('click')
    })


    test('disabled',() => {
        const wrapper = mount(Button, {
            props:{
                disabled: true
            },
            slots: {
                default: 'disabled'
            }
        })
        // attributes 属性检测
        expect(wrapper.attributes('disabled')).toBeDefined()
        expect(wrapper.find('button').element.disabled).toBeDefined()
        expect(wrapper.emitted()).not.toHaveProperty('click')
    })


    test('icon',() => {
        const wrapper = mount(Button, {
            props:{
                icon: 'arrow-up'
            },
            slots: {
                default: 'icon'
            },
            global:{
                // 组件替换
                stubs:[ 'FontAwesomeIcon']
            }
        })
        // attributes 属性检测
        console.log(wrapper.html())
        // 第三方组件使用情况
        const iconElement = wrapper.findComponent(FontAwesomeIcon)
        expect(iconElement.exists()).toBeTruthy()
        expect(iconElement.props().icon).toBe('arrow-up')
    })


    test('loading',() => {
        const wrapper = mount(Button, {
            props:{
                loading: true
            },
            slots: {
                default: 'loading'
            },
            global:{
                stubs:[ 'Icon']
            }
        })
        // attributes 属性检测
        console.log(wrapper.html())
        // 第三方组件使用情况
        const iconElement = wrapper.findComponent(Icon)
        expect(iconElement.exists()).toBeTruthy()
        expect(iconElement.props().icon).toBe('spinner')
        expect(wrapper.attributes('disabled')).toBeDefined()
    })
})