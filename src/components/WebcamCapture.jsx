import { useEffect, useRef, useState } from "react";
import "./WebcamCapture.css";

const MAX_WIDTH = 480; // keeps the saved image small
const MAX_FILE_MB = 5;

function WebcamCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  // Start the camera only while cameraOn is true
  useEffect(() => {
    if (!cameraOn) return;
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {
        setError("Camera access denied or not available. You can upload a photo instead.");
        setCameraOn(false);
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [cameraOn]);

  function openCamera() {
    setError("");
    setCameraOn(true);
  }

  function openFilePicker() {
    setError("");
    fileRef.current?.click();
  }

  // Draw any image source onto the canvas at a small size and return base64
  function toSmallDataUrl(source, width, height) {
    const canvas = canvasRef.current;
    const scale = Math.min(1, MAX_WIDTH / width);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.getContext("2d").drawImage(source, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.8);
  }

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const dataUrl = toSmallDataUrl(video, video.videoWidth, video.videoHeight);
    setPreview(dataUrl);
    onCapture(dataUrl);
    setCameraOn(false); // turns the camera off
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets the user pick the same file again later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Image is too large. Maximum size is ${MAX_FILE_MB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const dataUrl = toSmallDataUrl(img, img.width, img.height);
        setPreview(dataUrl);
        onCapture(dataUrl);
        setCameraOn(false);
        setError("");
      };
      img.onerror = () => setError("Could not read that image.");
      img.src = reader.result;
    };
    reader.onerror = () => setError("Could not read that file.");
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPreview("");
    onCapture("");
  }

  return (
    <div className="webcam">
      {error && <p className="webcam-error">{error}</p>}

      {/* hidden file input, always rendered so Upload works in every state */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: "none" }}
      />

      {preview ? (
        <>
          <img src={preview} alt="Selected" className="webcam-media" />
          <div className="webcam-actions">
            <button type="button" className="btn-secondary" onClick={openCamera}>
              Retake
            </button>
            <button type="button" className="btn-secondary" onClick={openFilePicker}>
              Upload another
            </button>
            <button type="button" className="btn-secondary" onClick={removePhoto}>
              Remove
            </button>
          </div>
        </>
      ) : cameraOn ? (
        <>
          <video ref={videoRef} autoPlay playsInline muted className="webcam-media" />
          <div className="webcam-actions">
            <button type="button" className="btn-primary" onClick={capture}>
              Capture
            </button>
            <button type="button" className="btn-secondary" onClick={() => setCameraOn(false)}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div className="webcam-choices">
          <button type="button" className="webcam-placeholder" onClick={openCamera}>
            <span className="webcam-icon">📷</span>
            <span>Use Camera</span>
          </button>
          <button type="button" className="webcam-placeholder" onClick={openFilePicker}>
            <span className="webcam-icon">📁</span>
            <span>Upload Photo</span>
          </button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default WebcamCapture;