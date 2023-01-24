<template>
    <div class="col-span-2 row-span-3 ">
        <div style="height:100%" class=" w-full bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700 ">
            <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 bg-gray-50 rounded-t-lg border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800"
                id="defaultTab" data-tabs-toggle="#defaultTabContent" role="tablist">
                <li class="mr-2">
                    <button id="about-tab" type="button" 
                        aria-selected="true"
                        class="inline-block p-4 text-blue-600 rounded-tl-lg dark:bg-gray-800  dark:text-blue-500   border-blue-600 dark:border-blue-500">Results</button>
                </li>
            </ul>

            
            <div class=""> 
                <div id="defaultTabContent" class="flex justify-evenly relative">
                    <!-- ENTRY GATE -->
                    <div v-if="gate === 'entry'" class="w-full absolute left-1/2 top-1/2 transform -translate-x-1/2 bg-white rounded-lg md:p-4 dark:bg-gray-800 bg-white rounded-lg md:p-4 dark:bg-gray-800"  >
                    <canvas ref="canvas" id="canv_app" class="-ml-8 mt-10 transform translate-x-1/2 "></canvas>
                        <div id="status" class="flex justify-center">
                            <div v-if="isFaceIndexed === 'knownface'">
                                <p class=" text-xl mt-10 font-bold tracking-tight text-green-600 dark:text-white text-center"> Face is recognized as
                                    </p>
                                <p>{{face_extId}}</p>
                            </div>
                            <div v-else-if="isFaceIndexed === 'newface'">
                                <p class="mt-5 text-xl font-bold tracking-tight text-green-600 dark:text-white text-center">New face information stored </p>
                                <p>{{face_extId}}</p>
                            </div>   
                        </div>
                        <hr class="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700" />
                        <div class="flex justify-center">
                            <div v-if="plate_conf > 50 ">
                                <p  class=" text-xl font-bold tracking-tight text-green-600 dark:text-white text-center"> Plate information stored </p>
                                <p class="text-center">{{ plate_text }}</p>
                            </div>
                        
                            <p v-else class=" text-xl font-bold tracking-tight text-red-600 dark:text-white text-center"></p>

                        </div>
                    </div>

                    <!-- EXIT GATE -->
                    <div v-if="gate === 'exit'" class=" w-full absolute left-1/2 top-1/2 transform -translate-x-1/2 bg-white rounded-lg md:p-4 dark:bg-gray-800 bg-white rounded-lg md:p-4 dark:bg-gray-800"  >
                        <!-- Verification status -->
                    
                        <div class="text-l italic tracking-tight text-grey-100 dark:text-white text-center">
                            <div v-if="isFaceIndexed==='knownface' && plate_conf">
                                <div id="status" class="flex justify-center">
                                    <svg class="w-6 h-6" fill="green" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                    <p class=" text-xl font-bold tracking-tight text-green-600 dark:text-white text-center">Verified</p>
                                </div>
                                <p>Both face and plate information are valid</p>
                                </div>
                            <p v-else-if="isFaceIndexed==='knownface'">Only face information is valid</p>
                            <p v-else-if="plate_conf">Only plate information is valid</p>
                            <p v-else>Information are invalid</p>
                        </div>
                       
                        
                        <!--Verification end -->
                        
                        <!-- Verif Table -->
                        <table v-if="gate === 'exit'" class="table-auto -ml-4 border-separate border-spacing-2">
                           
                            <tbody>
                               
                                <tr>
                                    <td  class=" pl-3">Image</td>
                                    <td  class="text-center pl-3">
                                        <canvas ref="canvas" id="canv_app"></canvas>
                                        <img :src=image alt=""/>
                                    </td>
                                    
                                </tr>
                                <tr>
                                    <td class=" pl-3">Matched Face Id</td>
                                    <td  class="rounded-lg italic border border-slate-300 pl-3 " :class="isFaceIndexed === 'knownface' ? 'border-green-600' : 'border-red-600' " >
                                        <span v-if="isFaceIndexed === 'knownface' ">{{face_extId}} (OK)</span>
                                        <span v-else>-</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="pl-3">Face Accuracy</td>
                                    <td
                                        class="rounded-lg italic border border-slate-300 pl-3 " :class="isFaceIndexed === 'knownface' ? 'border-green-600' : 'border-gray-600' " >
                                        <span v-if="face_conf ">{{face_conf}} %</span>
                                        <span v-else>-</span>
                                    </td>
                                </tr>
                                 <tr>
                                    <td class="pl-3">Plate Status</td>
                                    <td class="rounded-lg italic border border-slate-300 pl-3 " :class=" plate_conf > 50 ? 'border-green-600' : 'border-red-600' " ><span v-if="plate_text">{{plate_text}} (OK)</span>
                                    <span v-else>No Plate Identified</span></td>
                                </tr>
                                <tr>
                                    <td class=" pl-3">Plate Accuracy</td>
                                    <td class="rounded-lg italic border border-slate-300 pl-3 " :class=" plate_conf > 50 ? 'border-green-600' : 'border-red-600' " ><span v-if="plate_conf">{{plate_conf}} %</span>
                                    <span v-else>-</span></td>
                                </tr>

                                <tr>
                                    <td class="pl-3">Execution Time</td>
                                    <td class="border border-slate-300 pl-3 border-green-600 rounded-lg">{{ execTime ? execTime.toFixed(2) + ' milliseconds' : '-' }}</td>
                                </tr>
                               
                                <tr>
                                    <td class="pl-3">Timestamp</td>
                                    <td class="border border-slate-300 pl-3 border-green-600 rounded-lg">{{ date }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- Verif Table ends -->                       
                        <ul>
                            <li>
                                
                            </li>
                        </ul>                       
                    </div>
                </div>            
            </div>
        </div>
    </div>
</template>


<script setup>
import {ref} from 'vue'

const props = defineProps({
    image: String,
    bbox: Array,
    gate: String,
    face_extId: String,
    isFaceIndexed: String,
    face_conf: Number,
    plate_text: String,
    plate_conf: Number,
    date: Date,
    execTime: Number
})


</script>



