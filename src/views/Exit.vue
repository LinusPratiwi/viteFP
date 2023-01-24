<template>
    <Header gate="Exit" />
    <div class="grid grid-rows-3 grid-cols-5 gap-4 p-4">
        <Camera @setExtId="(data)=>{
          image=data[0]
          bbox = data[1]
          face_extId = data[2]
          isFaceIndexed = data[3]
          face_conf = data[4]
          plate_conf = data[5]
          plate_text = data[6]
          // plate_bbox = data[7]
          execTime = data[8]
        }">
        </Camera>

        <Card :image="image" :bbox="bbox" gate="exit" :face_extId="face_extId" :isFaceIndexed="isFaceIndexed"  :face_conf="face_conf" :plate_text="plate_text" :plate_conf="plate_conf" :date="date" :execTime="execTime"></Card> 
    </div>
    <!-- <canvas ref="canvas" id="canv_app" style=" height:480px;"></canvas> -->
</template>


<script setup >
import Header from '../components/Header.vue'
import Card from '../components/Cards.vue'
import Camera from '../components/Camera.vue'
import { ref } from 'vue'

const image = ref(null)
const bbox = ref(null)
const face_extId = ref(null)
const isFaceIndexed = ref(null)
const face_conf = ref(null)
const plate_text = ref(null)
const plate_conf = ref(null)
const plate_bbox = ref(null)
let date = Date.now()
date = new Date(date)
const execTime = ref(null)

</script>

<style scoped>

</style>