import * as faceapi from 'face-api.js';


const detectFacesFromImage = async (inputImage: HTMLImageElement) => {

    console.log("detect faces function has been run");

    // create element from image url or image path
    inputImage.crossOrigin="anonymous"
    const input = inputImage as HTMLImageElement;

    // pass element to get detections
    const detections = await faceapi.detectAllFaces(input).withFaceExpressions();


    console.log("This is what I detect: ", detections);



    return detections

};

export { detectFacesFromImage };
