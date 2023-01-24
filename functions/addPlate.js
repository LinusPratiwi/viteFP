// API endpoint : https://drqwjtpeyl.execute-api.ap-southeast-1.amazonaws.com/plate/add

const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();
const S3 = new AWS.S3();
const DB = new AWS.DynamoDB.DocumentClient({ region: "ap-southeast-1" })

exports.handler = async (event,context) => {
    let response = {};
    let body = event.body
    
   if(typeof(body) === "string"){
        body = JSON.parse(body)
    }
    
    let result
    
    const dbId = "db_"+context.awsRequestId

    
    // di testing boleh null
    const param_db ={
        Item : {
            id : dbId,
            s3_key : body.s3_key,
            plate_text : body.plate_text,
            p_timestamp : body.p_timestamp
        },
        TableName :"viteFPTable"
    }
    
    const putDB = () =>DB.put(param_db).promise()


    try {

        result = await putDB()
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
    
    return [response,result]
};
