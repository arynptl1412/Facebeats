import React, { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const FacialExpressions = () => {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const hasInitialized = useRef(false); // Lock to prevent double-loading
    const [mood, setMood] = useState("Waiting for detection...");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let streamRef = null;

        const setup = async () => {
            // Prevent React Strict Mode from running this twice
            if (hasInitialized.current) return;
            hasInitialized.current = true;

            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

                landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                    },
                    runningMode: "VIDEO",
                    outputFaceBlendshapes: true
                });

                startWebcam();
            } catch (error) {
                console.error("Failed to load the model:", error);
                setMood("Error loading model.");
            }
        };

        const startWebcam = () => {
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                streamRef = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        setIsReady(true);
                    };
                }
            }).catch(err => console.error("Webcam error:", err));
        };

        setup();

        // Cleanup function to free up system memory
        return () => {
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
                landmarkerRef.current = null;
            }
            if (streamRef) {
                streamRef.getTracks().forEach(track => track.stop());
            }
            hasInitialized.current = false;
        };
    }, []);

    const handleDetectClick = () => {
        const video = videoRef.current;
        const faceLandmarker = landmarkerRef.current;

        if (!video || !faceLandmarker) return;

        setMood("Processing..."); // Brief UI feedback

        // Wrap in a slight timeout to let the UI update before the main thread blocks
        setTimeout(() => {
            try {
                const results = faceLandmarker.detectForVideo(video, performance.now());

                if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
                    const blendshapes = results.faceBlendshapes[0].categories;
                    const getScore = (name) => blendshapes.find(b => b.categoryName === name)?.score || 0;

                    const smile = Math.max(getScore('mouthSmileLeft'), getScore('mouthSmileRight'));
                    const browDown = Math.max(getScore('browDownLeft'), getScore('browDownRight'));
                    const jawOpen = getScore('jawOpen');
                    const frown = Math.max(getScore('mouthFrownLeft'), getScore('mouthFrownRight'));
                    const browInnerUp = getScore('browInnerUp');

                    if (smile > 0.6) setMood("Pop / Upbeat 🎵 (Happy)");
                    else if (jawOpen > 0.5 && browInnerUp > 0.5) setMood("EDM / Party 🪩 (Energetic)");
                    else if (browDown > 0.6) setMood("Heavy Metal 🎸 (Intense)");
                    else if (frown > 0.5 && browInnerUp > 0.5) setMood("Acoustic / Indie 🌧️ (Melancholic)");
                    else setMood("Lo-Fi / Chill ☕ (Neutral)");
                } else {
                    setMood("No face detected. Please try again!");
                }
            } catch (error) {
                console.error("Detection error:", error);
                setMood("Detection failed.");
            }
        }, 50);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: '100%', maxWidth: '600px', borderRadius: '8px', marginBottom: '15px' }}
            ></video>
            <br />
            <button
                onClick={handleDetectClick}
                disabled={!isReady}
                style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: isReady ? '#4CAF50' : '#cccccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isReady ? 'pointer' : 'not-allowed'
                }}
            >
                {isReady ? "Detect Mood" : "Loading Model..."}
            </button>
            <h2>Music Mood: {mood}</h2>
        </div>
    );
};

export default FacialExpressions;