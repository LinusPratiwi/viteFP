<template>
    <div class="row-span-2 col-span-3 ">
        <div class="block p-6 bg-white rounded-lg border border-gray-200 shadow-md ">
            <div class="md:flex md:justify-between md:items-center">
                <Switch v-model="enabled" @click="cameraStatus" :class="enabled ? 'bg-teal-700' : 'bg-gray-200'"
                    class="relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                    <span class="sr-only">Use setting</span>
                    <span aria-hidden="true" :class="enabled ? 'translate-x-9' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                </Switch>
                <!-- end toggle -->

                <button @click="startRecognition" class="hover:bg-blue-700 bg-blue-500 text-white underline font-bold py-2 px-4 rounded ">
                    Start Recognition
                </button>
            </div>
            
            <!-- camera -->
            <div class="camera-box md:px-4 md:py-4" >
                <!-- toggle -->
                
                <!-- camera -->
                <div  >
                    <video :srcObject="camera" ref="camera" class="w-full rounded-lg border border-gray-200 shadow-md" autoplay ></video>
                    <!-- <canvas ref="canvas" style=" position:absolute; height:480px;width:640px"></canvas> -->
                </div>
                 
            </div>
            <canvas ref="canvas" id="canvas_2" style=" position:absolute; height:480px;width:640px; display:none" ></canvas>

            
        </div>
        
    </div>
    
</template>

<script setup>
import { ref,onMounted,watch  } from 'vue'
import { Switch, SwitchLabel,SwitchGroup } from '@headlessui/vue'
import * as tf from '@tensorflow/tfjs'
import { ExecutionContext } from '@tensorflow/tfjs-converter/dist/executor/execution_context';


const enabled = ref(false) 
const camera = ref(null )   
const picture = ref('')
let face_bbox
let pict
let pict_2
let isFaceIndexed
let face_Id
let face_conf
let plate_conf
let plate_text
let plate_bbox
let searchedFace
let searchedPlate
let execTime

const props = defineProps({
    Gate: String
})

const emit = defineEmits(["setExtId"])

const constraints = (window.constraints = {
    audio: false,
    video: true, 
})

const startCamera =async () => {
    try {
        camera.value = await navigator.mediaDevices.getUserMedia(constraints)
    } catch (error) {
        alert(error, "May the browser didn't support or there is some errors.")
    }
}

const start = performance.now();
const startRecognition= async ()=>{
    const vid = document.querySelector('video')
    const context = document.getElementById('canv_app').getContext('2d')
    const context_2 = document.getElementById('canvas_2').getContext('2d')
    const context_fbbox = context
    const context_pbbox = context
    context.drawImage(vid, 0, 0, 213, 160)
    context_2.drawImage(vid, 0, 0, 400, 180)
       
    pict = document.getElementById('canv_app').toDataURL('image/jpg')
    pict_2 = document.getElementById('canvas_2').toDataURL('image/jpg')

    let param = {
        base64: pict,
    }
    let param_2 = {
        base64: pict_2,
    }

    // face rekognition, return : bbox,extimgid,indexstatus,faceconf
    const face = await fetch("https://j93dglvqc2.execute-api.ap-southeast-1.amazonaws.com/face/recognition",{
        method: "post",
        headers: {
            "Content-Type":"application/json",
            "Authorization": "AWS4-HMAC-SHA256 Credential=AKIASAGNXVQIH3TPNWMD/20221021/us-east-1/execute-api/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=155523b838bb4234b4d3da5c55f27790dc81926815f511296665f8e44a1d74f2",
            "X-Amz-Date": "20221021T012622Z",
            "X-Amz-Content-Sha256": "beaead3198f7da1e70d03ab969765e0821b24fc913697e929e726aeaebf0eba3",
        },
        body: JSON.stringify(param),
        
    })

    const newface = await fetch("https://j93dglvqc2.execute-api.ap-southeast-1.amazonaws.com/face/index", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(param)
    })

    const plate = await fetch("	https://drqwjtpeyl.execute-api.ap-southeast-1.amazonaws.com/plate/read", {
        method: "post" ,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(param)
    })

    const plate_2 =  await fetch("	https://drqwjtpeyl.execute-api.ap-southeast-1.amazonaws.com/plate/read", {
        method: "post" ,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(param_2)
    })

    var face_res = await face.json()
    var plate_res = await plate.json()
    var plate_read = await plate_2.json()
    console.log("plattt==?", plate_res)
    console.log("hasil ==??", face_res)
    console.log("PLAT ONLY", plate_read,pict_2  )
    

    let param_plate
    if(plate_res[1].TextDetections.length != 0){
        param_plate= {
            plate_query: plate_res[1].TextDetections[0].DetectedText
        }
    }else{
        param_plate = ''
    }

    
    const searchPlate = await fetch("	https://drqwjtpeyl.execute-api.ap-southeast-1.amazonaws.com/plate/search", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(param_plate)
    })

    const srcplate = await searchPlate.json()
    const searchedPlate = srcplate[1]

    console.log("searched plate",searchedPlate)

    if ( face_res[1] != null && face_res[1].FaceMatches.length === 0 && face_res[1].SearchedFaceConfidence > 85 ) {
        const newfaceres = await newface.json()
        console.log("new face??", newfaceres)
        face_Id = newfaceres[1].FaceRecords[0].Face.ExternalImageId
        face_bbox = newfaceres[1].FaceRecords[0].Face.BoundingBox
        isFaceIndexed = "newface"
        face_conf = newfaceres[1].FaceRecords[0].Face.Confidence
        searchedFace = null
    }
    else if ( face_res[1] != null && face_res[1].FaceMatches.length > 0) {  
        face_Id = face_res[1].FaceMatches[0].Face.ExternalImageId
        face_bbox = face_res[1].SearchedFaceBoundingBox
        isFaceIndexed = face_res[2]
        face_conf = face_res[1].SearchedFaceConfidence
        const searchFace = await fetch("https://j93dglvqc2.execute-api.ap-southeast-1.amazonaws.com/face/search", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "AWS4-HMAC-SHA256 Credential=AKIASAGNXVQIH3TPNWMD/20221021/us-east-1/execute-api/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=155523b838bb4234b4d3da5c55f27790dc81926815f511296665f8e44a1d74f2",
                "X-Amz-Date": "20221021T012622Z",
                "X-Amz-Content-Sha256": "beaead3198f7da1e70d03ab969765e0821b24fc913697e929e726aeaebf0eba3",

            },
            body: JSON.stringify({  
                "key": face_Id
            })
        })

        const srcface = await searchFace.json()
        searchedFace = srcface[1]
        console.log("search face", srcface)

    }else{
        face_Id = '-'
    }

    if(searchedPlate != null && searchedPlate.Count === 0){
        plate_conf = plate_res[1].TextDetections[0].Confidence
        plate_text = plate_res[1].TextDetections[0].DetectedText
        plate_bbox = plate_res[1].TextDetections[0].Geometry.BoundingBox
        let date = Date.now()
        date = new Date(date)

        const db_param = {
            s3_key: face_Id,
            plate_text: plate_text,
            p_timestamp: date
        }
        
        const addtoDB = await fetch("https://drqwjtpeyl.execute-api.ap-southeast-1.amazonaws.com/plate/add", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(db_param)
        })

        const db_res = addtoDB.json()
        console.log("dbdbdb ?", db_res)

         const [px, py, pwidth, pheight] = [plate_bbox.Left, plate_bbox.Top, plate_bbox.Width, plate_bbox.Height];
        plate_bbox = [`${px * 300}`, `${py * 150}`, `${pwidth * 300}`, `${pheight * 150}`]
        context_pbbox.strokeStyle = 'green'
        context_pbbox.lineWidth = 3
        context_pbbox.beginPath()
        context_pbbox.rect(plate_bbox[0], plate_bbox[1], plate_bbox[2], plate_bbox[3])
        context_pbbox.stroke()
    }else if(searchedPlate != null && searchedPlate.Count > 0){
        const [x, y, width, height] = [face_bbox.Left, face_bbox.Top, face_bbox.Width, face_bbox.Height];
    face_bbox = [`${x * 300}`, `${y * 150}`, `${width * 300}`, `${height * 150}`]
    context_fbbox.strokeStyle = 'green'
    context_fbbox.lineWidth = 3
    context_fbbox.beginPath()
    context_fbbox.rect(face_bbox[0], face_bbox[1], face_bbox[2], face_bbox[3])
    context_fbbox.stroke()
    }

    const end = performance.now()
    // execTime = end - start
    execTime = face_res[4]
    console.log(execTime,'skfal', typeof execTime)
    emit('setExtId', [searchedFace, face_bbox,face_Id, isFaceIndexed, face_conf, plate_conf, plate_text, plate_bbox, execTime])
}

const stopCamera = async () => {
    let tracks =  document.querySelector('video').srcObject.getTracks()
    
   tracks.forEach(element => {
        element.stop()
   });
 
   

}

const cameraStatus = ()=>{
    if(enabled.value === true){
        enabled.value === false
        stopCamera()
        console.log("stop", enabled.value)
       
    }
    if(enabled.value === false){
        enabled.value === true
        startCamera()
        
        console.log('start',enabled.value)

    }
   
}



const runSSD =  async() => {
    // 3. TODO - Load network 
    context2 = document.getElementById('plate_canv').getContext('2d')
    const net =await tf.loadGraphModel('../../ssd_model/model.json')
    console.log("SSD ** ",net)

    const vid = document.querySelector('video')
    const img = tf.browser.fromPixels(vid)
    const resized = tf.image.resizeBilinear(img,[640,480])
    const casted = resized.cast('int32')
    const expanded  = casted.expandDims(0)
    const obj = await net.executeAsync(expanded)

    const boxes = await obj[0].array()
    const scores = await obj[3].array()
    console.log("scores : ",scores)
    requestAnimationFrame(() => { drawRect(boxes[0],  scores[0], 0.5, 300, 150, context2) }
    )
    const _box = boxes[0]
    // let _maxconf = 0

    tf.dispose(img)
    tf.dispose(resized)
    tf.dispose(casted)
    tf.dispose(expanded)
    tf.dispose(obj)
    // return _plate_bbox
}

</script>

<style lang="scss" scoped>
#canv{
    background-color: red($color: #000000);
    display: block;
}

</style>