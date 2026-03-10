import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// MediaPipe initialization (runs when button is clicked)
export const setup = async ({faceLandmarkerRef, videoRef, setMood}) => {

    if (!faceLandmarkerRef.current) {

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
    }
};

// Mood detection
export const detectMood = ({faceLandmarkerRef, videoRef, setMood}) => {

    const results = faceLandmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now()
    );

    if (!results.faceBlendshapes.length) {
        setMood("No face detected");
        return;
    }

    const blendshapes = results.faceBlendshapes[0].categories;

    const smile =
        blendshapes.find(b => b.categoryName === "mouthSmileLeft")?.score || 0;

    const jawOpen =
        blendshapes.find(b => b.categoryName === "jawOpen")?.score || 0;

    const browRaise =
        blendshapes.find(b => b.categoryName === "browInnerUp")?.score || 0;

    if (smile > 0.6) {
        setMood("😊 Happy");
    }
    else if (jawOpen > 0.6) {
        setMood("😲 Surprised");
    }
    else if (browRaise > 0.5) {
        setMood("😟 Sad");
    }
    else {
        setMood("😐 Neutral");
    }
};