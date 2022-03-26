# Vue 3 + Vite
安装依赖包
``` 
pnpm i
``` 
启动项目
```
pnpm run dev
``` 


# 手写实现miniVuex
> 目前实现了state、mutations的功能，还有待完善getters、actions的功能

**使用到的核心技术:**
- provide/inject，provide注册共享数据，其所有子组件都可以通过inject来使用数据。在应用实例.use()方法中执行store实例的install()方法，原理就是在组件实例上注册provide(STORE_KEY,this)，其中传递的this指向store实例。在组件中需要用到vuex的地方通过引进useStore()函数，返回inject(STORE_KEY)来使用vuex中的数据和方法。

1. 手写的mini-vuex.js文件，src/store/mini-vue.js：
```javascript 
import { inject, reactive } from "vue"

const STORE_KEY = '__store__'

function createStore(options){
    return new Store(options)
}

function useStore(){
    return inject(STORE_KEY)
}

class Store{
    constructor(options){
        this._state = reactive({
            data:options.state()
        })
        this._mutation = options.mutations
    }

    // main.js入口处app.use(store)的时候，会执行这个函数
    install(app){
        app.provide(STORE_KEY,this)
    }

    get state(){
        return this._state.data
    }

    commit = (type,payload) => {
        const entry = this._mutation[type]
        entry && entry(this.state,payload)
    }
}

export { createStore , useStore }
``` 


2. store的配置文件：src/store/index.js
```javascript 
import {createStore} from './mini-vuex'
const store = createStore({
    state(){
        return{
            count:1
        }
    },
    getters:{
        double(state){
            return state.count * 2
        }
    },
    mutations:{
        add(state,value){
            state.count++
        }
    },
    actions:{
        asyncAdd({commit}){
            setTimeout(()=>{
                commit('add')
            },1000)
        }
    }
})
export default store
```  

3. 在main.js入口文件中注册vuex：
```javascript 
import { createApp } from 'vue'
import App from './App.vue'
import store from './store/index'

createApp(App)
.use(store)
.mount('#app')
``` 

4. 在组件中使用mini-vuex：
```javascript 
<template>
	<h1 @click="add">点击我实现累计：{{counter}}</h1>
</template>

<script setup>
import { computed} from 'vue';
import { useStore } from './store/mini-vuex';

const store = useStore()

let counter = computed(()=>store.state.count)

function add(){
  store.commit('add',123)
}

</script>
``` 
