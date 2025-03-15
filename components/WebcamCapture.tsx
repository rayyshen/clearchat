import React from "react";
import Webcam from "react-webcam";

import { detectFacesFromImage } from "../functions/FacialAnalysis";

const WebcamComponent = () => <Webcam />;

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };
  
  const WebcamCapture = () => {
    const webcamRef = React.useRef<Webcam>(null);
    const capture = React.useCallback(
      () => {
        const imageSrc = webcamRef.current?.getScreenshot();


        var screenshotImage = new Image();
        screenshotImage.src = imageSrc as string;
        //document.body.appendChild(screenshotImage);
        detectFacesFromImage(screenshotImage);

      },
      [webcamRef]
    );
    return (
      <>
        <Webcam
          audio={false}
          height={720}
          ref={webcamRef}
          //screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
        />
        <button onClick={capture}>Capture photo</button>
      </>
    );
  };

export default WebcamCapture;