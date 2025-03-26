<template>
  <div
    class="vk-select"
    :class="{'is-disabled': disabled}"
    @click="toggleDropdown"
    @mouseenter="states.mouseHover = true"
    @mouseleave="states.mouseHover = false"
  >
    <Tooltip
        placement="bottom-start"
        manual
        ref="tooltipRef"
        :popper-options="popperOptions"
        @click-outside="controlDropdown(false)"
    >
        <Input 
            type="string"
            v-model="states.inputValue"
            :disabled="disabled"
            :placeholder="filteredPlaceHolder"
            ref="inputRef"
            :readonly="!filterable || !isDropdownShow"
            @input="debounceOnfilter"
            @keydown="handleKeydown"
        >
            <template #suffix>
                <Icon 
                    icon="circle-xmark" 
                    v-if="showClearIcon" 
                    class="vk-input__clear" 
                    @mousedown.prevent="NOOP"
                    @click.stop="onClear"
                />
                <Icon 
                    v-else
                    icon="angle-down" 
                    class="header-angle" 
                    :class="{ 'is-active' : isDropdownShow }" 
                />
            </template>
        </Input>
        <template #content>
            <!-- loading图标 -->
            <div class="vk-select__loading" v-if="states.loading">
                <Icon icon="spinner" spin />
            </div>
            <div class="vk-select__loading" v-else-if="filterable && filteredOptions.length===0">
                <!-- <Icon icon="spinner" spin /> -->
                 NO Matching Data!
            </div>
            <ul class="vk-select__menu" v-else>
                <template v-for="(item,index) in filteredOptions" :key="index">
                    <li
                        class="vk-select__menu-item"
                        :class="{
                            'is-disabled': item.disabled, 
                            'is-selected': states.selectedOption?.value === item.value,
                            'is-highlighted': states.highlightIndex === index
                            }"
                        :id="`select-item-${item.value}`"
                        @click.stop="itemSelect(item)"
                    >
                    <RenderVnode :vNode="renderLabel? renderLabel(item): item.label" />
                    </li>
                </template>
            </ul>
        </template>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, type Ref } from 'vue'
import { debounce, isFunction } from 'lodash-es';
import type { SelectProps, SelectEmits, SelectOption, SelectStates } from './types';

import Icon from '../Icon/Icon.vue';

import RenderVnode from '../Common/RenderVnode';

import Input from '../Input/Input.vue';
import type { InputInstance } from '../Input/types';

import Tooltip from '../Tooltip/Tooltip.vue';
import type { TooltipInstance } from '../Tooltip/types';

const findOption = (value:string) => {
    const option = props.options.find(option => option.value == value)
    return option ? option : null
}

defineOptions({
    name: 'VkSelect'
})

const timeout = computed(()=> props.remote ? 300 : 0)

const props = withDefaults(defineProps<SelectProps>(),{
    options: ()=>[], // 给数组设置默认值需要以函数返回值的方式
})
const emits = defineEmits<SelectEmits>()
const initialOption = findOption(props.modelValue)

const tooltipRef = ref() as Ref<TooltipInstance>
const inputRef  = ref() as Ref<InputInstance>

const states = reactive<SelectStates>({
    inputValue: initialOption ? initialOption.label : '',
    selectedOption: initialOption,
    mouseHover: false,
    loading: false,
    highlightIndex: -1,
})
watch(()=>props.modelValue, (newValue)=>{
    const newOption = findOption(newValue)
    states.inputValue = newOption? newOption.label : ''
    states.selectedOption = newOption
})

const isDropdownShow = ref(false)


const popperOptions: any = {
    modifiers: [
    {
        name: "offset",
        option:{
            offset: [0,9]
        }
    },
     {
        name: "sameWidth",
        enabled: true,
        fn: ({state}: {state:any}) => {
            state.styles.popper.width = `${state.rects.reference.width}px`
        },
        phase: "beforeWrite",
        reqires: ["computeStyles"],
     }   
    ]
}

const filteredOptions = ref(props.options)
watch(()=> props.options, (newOptions)=>{
    filteredOptions.value = newOptions
})

const generateFilterOptions = async (searchValue: string) => {
    if (!props.filterable) return // 对于开启过滤模式的组件
    if (props.filterMethod && isFunction(props.filterMethod)) {
        filteredOptions.value = props.filterMethod(searchValue)
    }else if(props.remote && props.remoteMethod && isFunction(props.remoteMethod)){
        // 远程搜索模式
        states.loading = true
        try{
            filteredOptions.value = await props.remoteMethod(searchValue)
        }catch(e){
            console.error(e)
            filteredOptions.value = []
        }finally {
            states.loading = false
        }
    } else{
        filteredOptions.value = props.options.filter((option =>option.label.includes(searchValue))) // 找出内容包括searchValue的label，返回对应的option
    }
}

const onFilter  = ()=> {
    generateFilterOptions(states.inputValue)
}
const debounceOnfilter = debounce(()=> {
    onFilter()
},timeout.value)

const filteredPlaceHolder = computed(()=>{
    // 筛选模式下，清空输入后默认选择原来的选项
    return (props.filterable && states.selectedOption && isDropdownShow.value) ? states.selectedOption.label : props.placeholder
})

const controlDropdown = ( show: boolean) => {
    if (show) {
        if ( props.filterable && states.selectedOption) {
            // filter模式 且 做过选择，再次展开时展示全部选项
            states.inputValue=''
        }
        if (props.filterable) {
            // 根据输入生成对应选项
            generateFilterOptions(states.inputValue)
        } 
        tooltipRef.value.show()
    } else {
        tooltipRef.value.hide()
        // 失焦的时候，将所选的选项回灌到input中，作为placeholder
        if (props.filterable){
            states.inputValue = states.selectedOption ? states.selectedOption.label : ''
        }
        states.highlightIndex = -1
    }
    isDropdownShow.value = show
    emits('visible-change',show)
}

const handleKeydown = (e:KeyboardEvent) => {
    e.stopPropagation();
    switch (e.key) {
        case 'Enter':
            if (!isDropdownShow.value){
                controlDropdown(true)
            }else {
                if (states.highlightIndex > -1 && filteredOptions.value[states.highlightIndex]){
                    itemSelect(filteredOptions.value[states.highlightIndex])
                }else {
                    controlDropdown(false)
                }
            }

            break
        case 'Escape':
            if (isDropdownShow.value) {
                controlDropdown(false)
            }
            break
        case 'ArrowUp': 
            e.preventDefault();
            // states.highlightIndex=-1 默认无高亮选择
            if (filteredOptions.value.length > 0) {
                if (states.highlightIndex == -1 || states.highlightIndex == 0) {
                    // 已经是第一个选项，移动到最后一项
                    states.highlightIndex = filteredOptions.value.length - 1
                } else {
                    // 向上移动
                    states.highlightIndex--
                }
            }
            break;
        case 'ArrowDown':
            e.preventDefault();
            if (filteredOptions.value.length > 0) {
                    if (states.highlightIndex == -1 || states.highlightIndex == filteredOptions.value.length - 1) {
                        // 已经是最后一个选项，移动到第一项
                        states.highlightIndex = 0
                    } else {
                        // 向上移动
                        states.highlightIndex++
                    }
                }
            break;
        default:
            break;
    }
}

const showClearIcon = computed(() => {
    // hover 上去
    // props.clearable 为 true
    // 必须要有选择过选项
    // Input 的值不能为空
    return (
        props.clearable && states.mouseHover && states.selectedOption && states.inputValue.trim() !== ''
    )
})

const onClear = () => {
    states.selectedOption = null
    states.inputValue = ''
    emits('clear')
    emits('change','')
    emits('update:modelValue','')
}

const  NOOP = () => {}

const toggleDropdown = () => {
    if (props.disabled) return
    if (isDropdownShow.value) {
        controlDropdown(false)
    }  else {
        controlDropdown(true)
    }
}
const itemSelect = (e: SelectOption) => {
    if (e.disabled) return 
    states.inputValue = e.label
    states.selectedOption = e
    emits('change',e.value)
    emits('update:modelValue',e.value)
    controlDropdown(false)
    inputRef.value.ref.focus()
}
</script>
