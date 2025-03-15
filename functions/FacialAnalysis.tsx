import * as faceapi from 'face-api.js';


const detectFacesFromImage = async (inputImage: HTMLImageElement) => {



    inputImage.crossOrigin="anonymous"
    //const input = inputImage as HTMLImageElement;

    // pass element to get detections
    const detections = await faceapi.detectAllFaces(inputImage).withFaceExpressions();


    // console.log("Face detection: ", detections[0]['expressions']);


    //const emotions = ['nuetral', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'suprised']

    let highestVal = 0;
    let mainEmotion = ''

    for (let key in detections[0]['expressions']) {

        let currVal = detections[0]['expressions'][key as keyof typeof detections[0]['expressions']];

        if (typeof(currVal) == 'number') {
            if (currVal as number > highestVal) {
                mainEmotion = key;
                highestVal = currVal as number;
            }

        }
    };

    console.log(mainEmotion);


    return mainEmotion;

};

export { detectFacesFromImage };
