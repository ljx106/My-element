// 使用函数式的方式实现动态组件创建
import type {  CreateMessageProps, MessageContext } from "./type"
import { render, h, shallowReactive } from 'vue'
import MessageConstructor from './Message.vue'
import useZIndex from "../../hooks/useZIndex"

let seed = 1 // 定义一个种子，用于生成唯一的id
const instances: MessageContext[] = shallowReactive([]) // 存储所有的实例； shallowreactive(浅层响应式)

export const createMessage = (props: CreateMessageProps) => {
    const {nextZIndex} = useZIndex() // 获取zIndex
    const container  = document.createElement('div') // 定义容器    
    const id = `message_${seed++}` // 生成唯一的id

    const destory= () => {
        // 删除数组中对应实例
        const idx = instances.findIndex(instance=> instance.id == id )
        if( idx === -1 ) return 
        instances.splice(idx,1)
        render(null, container) // 清除对应的vnode
    }

    // 手动删除
    const manualDestroy = ()=> {
        const instance = instances.find(instance => instance.id === id )
        if (instance) {
            instance.vm.exposed!.visible.value = false
        }
    }

    const newProps = {
        ...props,
        id,
        zIndex: nextZIndex(),
        onDestory: destory
    } // 组件动态构造并传入属性
    const vnode = h(MessageConstructor,newProps)   // 定义vnode
    render(vnode, container) // 挂载到vnode节点
    // render(null, container) // 销毁组件的方式

    // 将容器挂载到body上
    document.body.appendChild(container.firstElementChild!) // !表示非空断言
    const vm = vnode.component!


    const instance = { 
        id, 
        vnode, 
        vm,
        props: newProps,
        destroy: manualDestroy
    } // 定义instance，以区别不同的实例，实现各组件之间的定位
    instances.push(instance) // 将instance存储到instances中

    return instance
}

export const getLastInstance = () => {
    return instances.at(-1) // 拿到实例数组的最后一项
}

export const getLastBottomOffset = (id: string) => {
    const idx = instances.findIndex(instance => instance.id === id)
    console.log('idx',id , idx, instances.length)
    if( idx < 1 ) {
        return 0
    }else {
        const prev = instances[idx-1]
        return prev.vm.exposed!.bottomOffset.value
    }
}

export const closeAll = () => {
    instances.forEach( instance => {
        instance.destroy()
    })
} // 测试销毁方法