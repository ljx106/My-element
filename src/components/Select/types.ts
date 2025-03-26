import type { VNode } from "vue";

export interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

export type RenderLabelFunc = (option: SelectOption) => VNode;
export type CustomFilterFunc = (value: string) => SelectOption[]; // 定义一种方法，其输入为string，返回值为SelectOption数组
export type CustomFilterRemoteFunc = (value: string) => Promise<SelectOption[]>;


export interface SelectProps {
    // v-model
    modelValue: string;
    // 选项
    options?: SelectOption[];
    // 基本表单属性
    placeholder: string;
    disabled: boolean;
    clearable?: boolean;
    filterable?: boolean;
    renderLabel?: RenderLabelFunc;
    filterMethod?: CustomFilterFunc; // filterMethods是一个CustomFilterFunc类型的属性
    remote?: boolean;
    remoteMethod?:CustomFilterRemoteFunc;
}

export interface SelectStates {
    inputValue: string;
    selectedOption: null | SelectOption;
    mouseHover:boolean;
    loading:boolean;
    highlightIndex:number;
}


export interface SelectEmits {
    (e: 'change', value: string) : void;
    (e: 'update:modelValue', value: string) : void;
    (e: 'visible-change',value: boolean) : void;
    (e: 'clear') : void;
}