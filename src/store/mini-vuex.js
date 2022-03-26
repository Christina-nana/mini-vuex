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