//  API endpoint : https://j93dglvqc2.execute-api.ap-southeast-1.amazonaws.com/face/index

const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const rekognition = new AWS.Rekognition();
const S3 = new AWS.S3();

exports.handler = async (event,context) => {
    let response = {};
    let body = event.body
    let indFace
    
     if(typeof(body) === "string"){
        body = JSON.parse(body)
    }
   
    let res
    
     const externalImageId = "face_"+context.awsRequestId

    const _img = Buffer.from(body.base64.replace(/^data:image\/\w+;base64,/, ""),'base64')
    // convert base64 to binary
    const buf = new Buffer(body.base64.replace(/^data:image\/\w+;base64,/, ""),'base64')

  
    
    const param_index={
        CollectionId : "vitefp_collection",
        MaxFaces:1,
        Image:{
            Bytes:_img
        },
        ExternalImageId : externalImageId
    }
    
    const indexFaces = ()=> rekognition.indexFaces(param_index).promise()
   
  
    
    const params_s3 = {
        Body :buf,
        Bucket:"vitefp-image-bucket-123",
        Key : externalImageId,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    }
    
    
    const uptoS3 = () => (S3.putObject(params_s3)).promise()
    
    try {
    
    
        res = await indexFaces()
        
        await uptoS3()

        
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
    return [response,res];
   
};
