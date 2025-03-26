

export interface InputProps {
    type:string;
    size?:'large' | 'small';
    disabled?: boolean;
    clearable?: boolean;
    showPassword?: boolean;
    modelValue: string;
    placeholder?: string;
    readonly?: boolean;
    autocomplete?: string;
    autofocus?: boolean;
    form?: string;
}

export interface InputEmits {
    (e : 'update:modelValue', value: string) : void
    // input的 input事件指的是值发生变化就算
    (e : 'input', value: string) : void
    // input的 change事件指的是值发生变化并且失去 focus 才算
    (e : 'change', value: string) : void
    (e : 'focus', value: FocusEvent) : void
    (e : 'blur', value: FocusEvent) : void
    (e : 'clear'): void
}

export interface InputInstance {
    ref: HTMLInputElement | HTMLTextAreaElement
}