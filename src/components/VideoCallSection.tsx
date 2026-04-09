import React, { useState, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor } from 'lucide-react';
import { Button } from './ui/Button';

const VideoCallSection: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsActive(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Could not access camera. Please check browser permissions.");
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = screenStream;
        setIsScreenSharing(true);
        
        // Listen for when user clicks "Stop Sharing" in browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };
      } else {
        stopScreenShare();
      }
    } catch (err) {
      console.error("Screen share failed", err);
    }
  };

  const stopScreenShare = () => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
    setIsScreenSharing(false);
  };

  const endCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsActive(false);
    setIsScreenSharing(false);
  };

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative group">
      <div className="aspect-video bg-black flex items-center justify-center relative">
        {isActive && !isVideoOff ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted={isMuted}
            className={`w-full h-full object-cover ${!isScreenSharing ? 'scale-x-[-1]' : ''}`}
          />
        ) : (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <VideoOff className="text-gray-500" size={32} />
            </div>
            <p className="text-gray-400 font-medium">
              {isActive ? "Camera is Off" : "Ready to Pitch?"}
            </p>
          </div>
        )}
      </div>

      <div className="p-6 bg-gray-900/90 border-t border-gray-800">
        {!isActive ? (
          <Button onClick={startCall} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700">
            Start Live Pitch Meeting
          </Button>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-full ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-gray-800 text-white'}`}>
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500/20 text-red-500' : 'bg-gray-800 text-white'}`}>
                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              </button>
              <button onClick={toggleScreenShare} className={`p-3 rounded-full ${isScreenSharing ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-white'}`}>
                <Monitor size={20} />
              </button>
            </div>
            <button onClick={endCall} className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full">
              <PhoneOff size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallSection;