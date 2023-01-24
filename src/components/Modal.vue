<template>
    <div v-show="isOpen" class="container mx-auto">
        <div  class="flex justify-center">
            <div  class="
                      absolute
                      inset-0
                      flex
                      items-start
                      justify-center
                      bg-gray-500 
                    z-[100] " style="height:350%">
                <div class="w-l p-6 bg-white rounded-md shadow-xl mt-12">
                    <div class="flex items-center justify-between">
                        <h3 class="text-2xl">Choose a Gate {{isOpen}}</h3>
                       
                    </div>
                    <div class="mt-4">
                        <p class="mb-4 text-sm">
                            Welcome to the parking automation gate. Choose a gate to proceed.
                        </p>
                        <button @click="isOpen = false; goToEntry()" class="px-6 py-2 text-blue-800 btn border border-blue-600 rounded">
                            Entry Gate
                           
                        </button> 
                        
                        <button  @click="isOpen = false; goToExit()" class="float-right px-6 py-2 ml-2 text-blue-100 bg-blue-600 rounded">
                            Exit Gate
                        </button>
                        
                    </div>
                    
                </div>
                
            </div>
            
        </div>
    </div>
    <!-- <router-view /> -->
   
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
let isOpen = ref(true)

const emit = defineEmits(()=>['setGate'])
const router = useRouter()



const goToExit = ()=>{
    isOpen=false
    router.push({
        name : 'Exit'
    })
}

const goToEntry = ()=>{
    isOpen=false
    router.push({
        name : 'Entry'
    })
}
</script>

<style lang="scss" scoped>

</style>