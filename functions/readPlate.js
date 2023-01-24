// API endpoint : https://drqwjtpeyl.execute-api.ap-southeast-1.amazonaws.com/plate/read

const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const rekognition = new AWS.Rekognition();
const S3 = new AWS.S3();

exports.handler = async (event,context) => {
    let response = {};
    let body = event.body
    let fbbox
    let pbbox
    let plate
    let plateconf
    
     if(typeof(body) === "string"){
        body = JSON.parse(body)
    }
    
    const externalImageId = "face_"+context.awsRequestId
    // let externalImageId = "testface"
    
    let isIndexed
    let faceMatches
    let faceConf
    let faceId

    const _img = Buffer.from(body.base64.replace(/^data:image\/\w+;base64,/, ""),'base64')
    // convert base64 to binary
    const buf = new Buffer(body.base64.replace(/^data:image\/\w+;base64,/, ""),'base64')


    const param_text={
        Image:{
            Bytes : _img
        },
    }
    
    const detectText=()=>rekognition.detectText(param_text).promise()

    try {
       
        
        plate = await detectText()

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
    return [response,plate];

};
