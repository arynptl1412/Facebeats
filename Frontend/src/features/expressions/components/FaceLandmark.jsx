import React, { useEffect, useRef, useState } from "react";
import { setup, detectMood } from '../utils/utils.js'

function FaceLandmark() {

    const videoRef = useRef(null);
    const faceLandmarkerRef = useRef(null);

    const [mood, setMood] = useState("Click Detect Mood");

    // Camera starts when component loads
    useEffect(() => {

        setup({faceLandmarkerRef, videoRef, setMood});
        const startCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        };

        startCamera();
    }, []);

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

            <button onClick={() => {
                detectMood({faceLandmarkerRef, videoRef, setMood})
            }}>
                Detect Mood
            </button>

            <h3>Detected Mood: {mood}</h3>

        </div>
    );
}

export default FaceLandmark;