// TDD(Test Driven Development)测试驱动开发，通过测试期望实现的功能，推动组件的完善。
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from './Input.vue'

describe('Input', () => {
    it('基本展示', () => {
        // 针对动态 class，查看 classes 是否正确
        // 针对V-if是否渲染正确的标签以及内容
        // 针对 slots，是否渲染对应的 slots 内容
        const wrapper = mount(Input, {
            props: {
                size: 'small',
                type: 'text',
                modelValue: ''
            },
            slots:{
                prepend:'prepend',
                prefix: 'prefix',
            }
        })
        console.log(wrapper.html())
        // classes
        expect(wrapper.classes()).toContain('vk-input--small')
        expect(wrapper.classes()).toContain('is-prepend')

        // 渲染input组件
        expect(wrapper.find('input').exists()).toBeTruthy()
        expect(wrapper.find('input').attributes('type')).toBe('text')

        // slots
        expect(wrapper.find('.vk-input__prepend').exists()).toBeTruthy()
        expect(wrapper.get('.vk-input__prepend').text()).toBe('prepend')
        expect(wrapper.find('.vk-input__prefix').exists()).toBeTruthy()
        expect(wrapper.get('.vk-input__prefix').text()).toBe('prefix')

        // textarea
        const wrapper2 = mount(Input,{
            props: {
                type: 'textarea',
                modelValue: ''
            }
        })
        expect(wrapper2.find('textarea').exists()).toBeTruthy()
    })

    it('支持 v-model', async () => {
        const wrapper = mount(Input, {
          props: {
            modelValue: 'test',
            'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
            type: 'text'
          }
        })
        // 初始值
        const input = wrapper.get('input')
        expect(input.element.value).toBe('test')
        
        // 更新值
        await input.setValue('update')
        expect(wrapper.props('modelValue')).toBe('update')
        expect(input.element.value).toBe('update')

        // setValue会触发input事件和change事件
        console.log('the events', wrapper.emitted())
        expect(wrapper.emitted()).toHaveProperty('input')
        expect(wrapper.emitted()).toHaveProperty('change')
        // emitted返回值是数组嵌套数组的类型[['update'], ['change'],...]
        const inputEvent = wrapper.emitted('input')
        const changeEvent = wrapper.emitted('change')
        expect(inputEvent![0]).toEqual(['update'])
        expect(changeEvent![0]).toEqual(['update'])

        // v-model的异步更新
        await wrapper.setProps({modelValue: 'prop update'})
        expect(input.element.value).toBe('prop update')
    })

    it('支持点击清空字符串', async () => {
        const wrapper = mount(Input, {
            props: {
              modelValue: 'test',
              clearable: true,
              type: 'text'
            },
            global: {
              stubs: ['Icon']
            }
          })
          // 不出现对应的 Icon 区域
          expect(wrapper.find('.vk-input__clear').exists()).toBeFalsy()
          const input = wrapper.get('input')
          await input.trigger('focus')
          expect(wrapper.emitted()).toHaveProperty('focus')
          //  出现 Icon 区域
          expect(wrapper.find('.vk-input__clear').exists()).toBeTruthy()
          // 点击值变为空并且消失
          await wrapper.get('.vk-input__clear').trigger('click')
          expect(input.element.value).toBe('')
          // 点击值置空并且消失，不仅触发clear事件，还会触发input和change事件
          expect(wrapper.emitted()).toHaveProperty('clear')
          expect(wrapper.emitted()).toHaveProperty('input')
          expect(wrapper.emitted()).toHaveProperty('change')
          const inputEvent = wrapper.emitted('input')
          const changeEvent = wrapper.emitted('change')
          expect(inputEvent![0]).toEqual([''])
          expect(changeEvent![0]).toEqual([''])

          await input.trigger('blur')
    })

    it('支持切换密码显示', async () => {
        const wrapper = mount(Input, {
          props: {
            modelValue: '',
            showPassword: true,
            type: 'text'
          },
          global: {
            stubs: ['Icon']
          }
        })
        // 当前值为空，不展示Icon
        expect(wrapper.find('.vk-input__password').exists()).toBeFalsy()
        const input = wrapper.get('input')
        expect(input.element.type).toBe('password')
        // 出现Icon区域，并且Icon为特定图标
        await input.setValue('123')
        const eyeIcon = wrapper.find('.vk-input__password')
        expect(eyeIcon.exists()).toBeTruthy()
        expect(eyeIcon.attributes('icon')).toBe('eye-slash')
        // 点击会切换input类型和Icon图标
        await eyeIcon.trigger('click')
        expect(input.element.type).toBe('text')
        expect(wrapper.find('.vk-input__password').attributes('icon')).toBe('eye')
    })
})