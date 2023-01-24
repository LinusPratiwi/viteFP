const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const rekognition = new AWS.Rekognition();
const S3 = new AWS.S3();

exports.handler = async (event,context) => {
    let response = {};
    let body = event.body
    let bbox
    
    const externalImageId = "face_"+context.awsRequestId
    
    let face2
    let facebyimagefound
    
    if(typeof(body) === "string"){
        body = JSON.parse(body)
    }

   
    // convert base64 to binary
    const buf = new Buffer(body.base64.replace(/^data:image\/\w+;base64,/, ""),'base64')

    const params2 = {
        Body :buf,
        Bucket:"vitefp-image-bucket-123",
        Key : externalImageId,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    }

    const uptoS3 = () => (S3.putObject(params2)).promise()
    // 1) uptoS3 return alamat S3 or externalimageid --> alamat nya jadi parameter detect face 2) detect face as image byte64
    const param_face={
        Image:{
            S3Object:{
                Bucket:"vitefp-image-bucket-123",
                Name : externalImageId
            },
            
        }
    }
    
    const detectFaces=()=>(rekognition.detectFaces(param_face).promise())
    
    

    try {
        
        // #1 Detect Face.
        await uptoS3()
        const res = await detectFaces()
        
        if(res.FaceDetails != ""){
            bbox = res.FaceDetails[0].BoundingBox
        }
        // bbox = bbox.BoundingBox
        // bbox = bbox.FaceDetails
        // face2 = await listFaces()
        // const res = await searchFaces()
        // if(res.FaceMatches.length === 0 ){
        //     await uptoS3()
            // await indexFace()
        //     face2="sucessfully indexed"
        // }
        // facebyimagefound = await searchFaces()
        // if(!facebyimagefound){
        //     facebyimagefound="ni"
        // }
        response ={
            statusCode : 200,
            // body: res,
       
            // in postman need to be stringify
            // body: JSON.stringify(res),
            headers:{
                "Content-Type":"application/json"
            },
            
        };
    } catch (e) {
        facebyimagefound = "there is no face"
        response={
            statusCode : 500,
            headers:{
                "Content-Type":"application/json"
            },
            body : e.toString(),
            
        };
    }
    
    return [response,bbox];
};
