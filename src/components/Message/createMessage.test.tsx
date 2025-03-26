import { describe, expect, test } from 'vitest';
import { nextTick } from 'vue';
import { createMessage, closeAll } from './method';

export const rAF = async () => { // 等待transition动画效果结束
    return new Promise((res) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(async () => {
          res(null)
          await nextTick()
        })
      })
    })
  }

function getTopValue(element: Element){
    const styles = window.getComputedStyle(element)
    const topValue = styles.getPropertyValue('top')
    return Number.parseFloat(topValue)
}
describe('createMessage', () => {
    test('调用方法应该创建对应的 Message组件',async()=>{
        const instance = createMessage({message: 'hello world', duration: 0})
        await rAF()
        console.log('html', document.body.innerHTML)
        expect(document.querySelector('.vk-message')).toBeTruthy()
        instance.destroy()
        await rAF()
        console.log('html2', document.body.innerHTML)
        expect(document.querySelector('.vk-message')).toBeFalsy()
    })


    test('多次调用方法应该创建多个实例',async()=>{
        createMessage({message: '11111 hello world', duration: 0})
        createMessage({message: '22222 hello world', duration: 0})
        await rAF()
        const elements = document.querySelectorAll('.vk-message')
        expect(elements.length).toBe(2)
        closeAll()
        await rAF()
        expect(document.querySelector('.vk-message')).toBeFalsy()
    })


    test('创建多个实例应该有正确地offset',async()=>{
        createMessage({message: '11111 hello world', duration: 0, offset: 100})
        createMessage({message: '22222 hello world', duration: 0, offset: 50})
        await rAF()
        const elements = document.querySelectorAll('.vk-message')
        expect(elements.length).toBe(2)
        const firstElementTop = getTopValue(elements[0])
        const secondElementTop = getTopValue(elements[1])
        // 在JS-dom中，对应的height返回值是0
        expect(firstElementTop).toBe(100)
        expect(secondElementTop).toBe(150)
    })
       
})