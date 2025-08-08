import { useEffect, useRef } from 'react';

export const usePoseDetection = (videoRef: React.RefObject<HTMLVideoElement | null>, onResults: (results: any) => void) => {
  const poseRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    let poseInstance: any = null;

    const initializePose = async () => {
      try {
        console.log('Starting MediaPipe Tasks Vision initialization...');
        
        // Import MediaPipe Tasks Vision
        const { PoseLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');

        console.log('MediaPipe Tasks Vision loaded successfully');

        // Create the pose landmarker
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        poseInstance = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numPoses: 1
        });

        console.log('Pose landmarker created:', poseInstance);

        poseRef.current = poseInstance;

        // Set up camera processing
        if (videoRef.current) {
          const processFrame = async () => {
            try {
              if (videoRef.current && poseInstance && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                const startTimeMs = performance.now();
                const results = poseInstance.detectForVideo(videoRef.current, startTimeMs);
                
                if (results.landmarks && results.landmarks.length > 0) {
                  // Convert to the format expected by the modal
                  const poseResults = {
                    poseLandmarks: results.landmarks[0].map((landmark: any) => ({
                      x: landmark.x,
                      y: landmark.y,
                      z: landmark.z,
                      visibility: landmark.visibility || 1.0
                    }))
                  };
                  onResults(poseResults);
                }
              }
            } catch (error) {
              console.error('Error processing frame:', error);
            }
            
            // Continue processing frames
            if (videoRef.current) {
              animationFrameRef.current = requestAnimationFrame(processFrame);
            }
          };

          // Start processing frames
          processFrame();
          console.log('Camera processing started successfully');
        }
      } catch (error) {
        console.error('Failed to initialize MediaPipe Tasks Vision:', error);
        console.error('Error details:', error);
      }
    };

    initializePose();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (poseInstance) {
        poseInstance.close();
      }
    };
  }, [videoRef, onResults]);

  return poseRef;
};