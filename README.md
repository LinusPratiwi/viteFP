# Face and Plate Rekognition

Mainy using AWS:
- AWS Lambda
- AWS Rekognition
- AWS S3
- AWS API Gateway

Flow :
1. Input base64 image converted into binary to be passed as parameter to --> API Gateway to perfrom detectFaces() and getting Bounding box as response
2. If detectFaces is true, then :
a. the image will be stored in S3 (done)
b. Perform searchFacesByImage(). If no faceMatches then perform indexFaces()
