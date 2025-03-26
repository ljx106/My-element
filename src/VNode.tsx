import { defineComponent, ref } from 'vue'
// const vnode = h('div', { id: 'foo'},"hello")

export default defineComponent({
    name:'VNode',
    props: {
        msg:{
            type: String,
            required: true
        }
    },

    setup(props) {
        const count = ref(1)
        // render function
        return () => (
            <div>
                <h1>{props.msg}</h1>
                <p>{count.value}</p>
            </div>
        )
    }
})
