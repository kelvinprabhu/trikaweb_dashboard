import { useRef } from 'react';

// Dummy hook for compatibility, does nothing
export const usePoseDetection = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  onResults: (results: any) => void
) => {
  // No pose detection
  return useRef(null);
};