// function name : rekognitionFn
// API endpoint : https://j93dglvqc2.execute-api.ap-southeast-1.amazonaws.com/face/recognition
const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();
const S3 = new AWS.S3();
const { performance } = require('perf_hooks');

exports.handler = async (event,context) => {
    
    
    let response = {};
    let body = event.body
    let fbbox
    let plate
    
    const SESConfig = {
        apiVersion: "2010-12-01",
        accessKeyId:  process.env.aws_access_key_id,
        accessSecretKey: process.env.aws_secret_access_key,
        region: "ap-southeast-1"
    }
    
    AWS.config.update(SESConfig)
     if(typeof(body) === "string"){
        body = JSON.parse(body)
    }
    
    
    const externalImageId = "face_"+context.awsRequestId
    
    let isIndexed
    let faceMatches
    let faceConf
    let faceId
    let time

    const _img = Buffer.from(body.base64.replace(/^data:image\/\w+;base64,/, ""),'base64')
    // convert base64 to binary
    const buf = new Buffer(body.base64.replace(/^data:image\/\w+;base64,/, ""),'base64')

    const params_s3 = {
        Body :buf,
        Bucket:"vitefp-image-bucket-123",
        Key : externalImageId,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    }
    
    const param_text={
        Image:{
            Bytes : _img
        },
    }
    
    const detectText=()=>rekognition.detectText(param_text).promise()

    const uptoS3 = () => (S3.putObject(params_s3)).promise()
   

    const param_search={
        CollectionId : "vitefp_collection",
        MaxFaces:1,
        Image:{
            Bytes:_img
        }
    }
    
    
    const searchFacesByImage=()=>(rekognition.searchFacesByImage(param_search).promise())
    
    const param_index={
        CollectionId : "vitefp_collection",
        MaxFaces:1,
        Image:{
            Bytes:_img
        },
        ExternalImageId : externalImageId
    }
    
    const indexFaces = ()=> rekognition.indexFaces(param_index).promise()


    try {
            const start = performance.now();
            faceMatches = await searchFacesByImage()
            if(faceMatches.FaceMatches.length === 0){
                const newface = await indexFaces()
                fbbox = newface.FaceRecords[0].FaceDetail.BoundingBox
                faceConf = newface.FaceRecords[0].Face.Confidence
                faceId = externalImageId
                isIndexed = "newface"
                await uptoS3()
            }else{
                isIndexed= "knownface"
                fbbox = faceMatches.SearchedFaceBoundingBox
                faceConf = faceMatches.SearchedFaceConfidence
                faceId = faceMatches.FaceMatches[0].Face.FaceId
            }
            
            plate = await detectText()
        // }
            console.log('th')
            const end = performance.now()
            time = end - start;
        response ={
            statusCode : 200,

            headers:{
                "Content-Type":"application/json"
            },
            
        };
    } catch (e) {

        response={
            statusCode : 500,
            headers:{
                "Content-Type":"application/json"
            },
            body : e.toString(),
            
        };
    }
    return [response,faceMatches,isIndexed,plate, time ];
    
};
