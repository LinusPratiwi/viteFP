<template>
    
    <Header gate="Entry" />
    <div class="grid grid-rows-2 grid-cols-5 gap-4 p-4">
         <Camera @setExtId="(data)=>{
          face_extId = data[2]
          isFaceIndexed = data[3]
          plate_conf = data[5]
          plate_text = data[6]
        }">
        </Camera>

        <Card   gate="entry" :face_extId="face_extId" :isFaceIndexed="isFaceIndexed"
           :plate_text="plate_text" :plate_conf="plate_conf" />
        
        
    </div>
    
</template>


<script setup >
import Header from '../components/Header.vue'
import Card from '../components/Cards.vue'
import Camera from '../components/Camera.vue'
import { ref,onMounted } from 'vue'

const extId = ref(null)
const bbox = ref(null)
const face_extId = ref(null)
let isFaceIndexed = ref(null)
let plate_conf = ref(null)
let plate_text = ref(null)
</script>

<style scoped>

</style>