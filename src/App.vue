<template>
<h1 @click="add">点击我实现累计：{{counter}}</h1>
</template>

<script setup>
import { computed, reactive,provide ,ref} from 'vue';
import { useStore } from './store/mini-vuex';

const store = useStore()

let counter = computed(()=>store.state.count)
function add(){
  store.commit('add',123)
}

</script>