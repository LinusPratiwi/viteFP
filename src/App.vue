<template>

<Modal></Modal> 
<router-view />

</template>


<script setup >
import Modal from './components/Modal.vue'
import Header from './components/Header.vue'
import { ref } from 'vue'

const gate = ref('')
const bbox = ref(null)



</script>

<style scoped>

</style>