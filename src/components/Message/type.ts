import type { VNode, ComponentInternalInstance } from 'vue';

export interface MessageProps {
    message?: string | VNode;
    duration?: number;
    showClose?: boolean;
    type?: 'success'|'info'|'warning'| 'danger'
    onDestory: () => void;
    offset?: number;
    id: string;
    zIndex: number;
    transitionName?: string;
}

export type CreateMessageProps = Omit<MessageProps, 'onDestory' | 'id' | 'zIndex'> // Omit是一个工具类型，用于从一个类型中排除某些属性，不需要传入

export interface MessageContext {
    id: string;
    vnode: VNode;
    vm: ComponentInternalInstance;
    props: MessageProps;
    destroy: ()=> void;
}

export interface MessageInstance {
    close: () => void;
}