import React, { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function FaceLandmark() {
    const videoRef = useRef(null);
    const faceLandmarkerRef = useRef(null);

    const [mood, setMood] = useState("Click Detect");

    useEffect(() => {
        const setup = async () => {

            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
            );

            faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
                vision,
                {
                    baseOptions: {
                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
                    },
                    runningMode: "VIDEO",
                    numFaces: 1,
                    outputFaceBlendshapes: true
                }
            );

            startCamera();
        };

        const startCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
        };

        setup();
    }, []);

    const detectMood = () => {

        const results = faceLandmarkerRef.current.detectForVideo(
            videoRef.current,
            performance.now()
        );

        if (results.faceBlendshapes.length === 0) {
            setMood("No face detected");
            return;
        }

        const blendshapes = results.faceBlendshapes[0].categories;

        const smile =
            blendshapes.find((b) => b.categoryName === "mouthSmileLeft")?.score || 0;

        const mouthOpen =
            blendshapes.find((b) => b.categoryName === "jawOpen")?.score || 0;

        const browRaise =
            blendshapes.find((b) => b.categoryName === "browInnerUp")?.score || 0;

        if (smile > 0.6) {
            setMood("😊 Happy");
        } else if (mouthOpen > 0.6) {
            setMood("😲 Surprised");
        } else if (browRaise > 0.5) {
            setMood("😟 Sad");
        } else {
            setMood("😐 Neutral");
        }
    };

    return (
        <div style={{ textAlign: "center" }}>

            <h2>Mood Detection</h2>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                width="500"
                style={{ borderRadius: "10px" }}
            />

            <br /><br />

            <button onClick={detectMood}>
                Detect Mood
            </button>

            <h3>Detected Mood: {mood}</h3>

        </div>
    );
}