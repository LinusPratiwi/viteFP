// API Endpoint : https://j93dglvqc2.execute-api.ap-southeast-1.amazonaws.com/face/search

const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const rekognition = new AWS.Rekognition();
const S3 = new AWS.S3();

exports.handler = async (event,context) => {
    let response = {};
    let body = event.body
    let bbox
     if(typeof(body) === "string"){
        body = JSON.parse(body)
    }
    
  
    

    let res
    let faceMatches
    let buf

    const param_search={
        Bucket : "vitefp-image-bucket-123",
        Key:body.key,
       
       
    }
    
    
    const searchFaces=()=>(S3.getObject(param_search).promise())
   

    try {
        res = await searchFaces()
        res = res.Body
        buf =Buffer.from(res,'binary').toString('base64')
        buf = 'data:image/png;base64,' + buf
        response ={
            statusCode : 200,

            headers:{
                "Content-Type":"image/jpeg"
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
    
    return [response, buf];
};
