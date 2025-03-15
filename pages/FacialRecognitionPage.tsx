"use client";

import { useEffect } from 'react';
import * as faceapi from 'face-api.js';

import React from "react";
import Webcam from "react-webcam";

import WebcamCapture from '../components/WebcamCapture';



export default function FacialRecognitionPage() {
    useEffect(() => {
        const loadModelsAndDetectFaces = async () => {

            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
            await faceapi.nets.faceExpressionNet.loadFromUri('/models');

            const detections = await detectFacesFromImage("https://www.shutterstock.com/image-photo/portrait-sad-man-260nw-126009806.jpg")
            console.log('Detections:', detections);
        };


        loadModelsAndDetectFaces();
    }, []);

    
    const WebcamComponent = () => <Webcam />;

    

    const detectFacesFromImage = async (imageUrl: string) => {

        // create element from image url or image path
        const imageElement = document.createElement('img')
        imageElement.src=imageUrl
        imageElement.crossOrigin="anonymous"
        const input = imageElement as HTMLImageElement;

        // pass element to get detections
        const detections = await faceapi.detectAllFaces(input).withFaceExpressions();


        return detections

    };

    return (
        <div>
            <WebcamCapture></WebcamCapture>
            <h1>This is the facial recognition page!</h1>
            <img id="myImage" src="https://www.shutterstock.com/image-photo/portrait-sad-man-260nw-126009806.jpg" crossOrigin='anonymous'/>
        </div>
    );
}
