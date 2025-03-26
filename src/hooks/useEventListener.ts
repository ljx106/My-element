// 事件监听
import { onMounted, onBeforeUnmount, isRef, watch, unref } from 'vue';
import type { Ref } from 'vue';
 
export default function useEventListener(
    target: Ref<EventTarget | null> | EventTarget,
    event: string,
    handler: (e: Event) => unknown
){
    if (isRef(target)) {
        watch(target,(value, oldvalue)=>{
            oldvalue?.removeEventListener(event, handler) // 旧的值解绑监听器
            value?.addEventListener(event, handler)
        })
    }else{ // 不是响应式对象
        onMounted(() =>{
            target.addEventListener(event, handler)
        })
    }
    onBeforeUnmount(()=>{
        unref(target)?.removeEventListener(event,handler)  // unref：将一个响应式对象解绑，返回一个具体的类型，如EventTarget
    })
}