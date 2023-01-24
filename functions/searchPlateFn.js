// API Endpoint : https://drqwjtpeyl.execute-api.ap-southeast-1.amazonaws.com/plate/search

const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();
const S3 = new AWS.S3();
const DB = new AWS.DynamoDB.DocumentClient({ region: "ap-southeast-1" })
// const fetch = require('node-fetch')
// import * as fetch from 'node-fetch'

exports.handler = async (event,context) => {
    let response = {};
    let body = event.body
    
   if(typeof(body) === "string"){
        body = JSON.parse(body)
    }
    
    let result

    const query_param ={
        TableName: 'viteFPTable',
        IndexName : "plate-index",
        KeyConditionExpression: 'plate = :plate',
        ExpressionAttributeValues: {
          ':plate': body.plate_query

        },
        ProjectionExpression: "face_extId,plate_extId,plate"
        
    }
    
    const findPlate =()=>DB.query(query_param).promise()

    try {
        result = await findPlate()

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
