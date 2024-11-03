// Get references to HTML elements
const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const photoCanvas = document.getElementById('photoCanvas');
const captureButton = document.getElementById('captureButton');

// Setup video stream and canvas
async function setupCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
    video.play();

    drawOverlay();
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
}

// Draw circular overlay on canvas
function drawOverlay() {
  const context = overlay.getContext('2d');
  const width = overlay.width = video.videoWidth;
  const height = overlay.height = video.videoHeight;

  // Draw a transparent background with a circular cut-out
  context.clearRect(0, 0, width, height);
  context.fillStyle = 'rgba(0, 0, 0, 0.5)';
  context.fillRect(0, 0, width, height);

  const radius = Math.min(width, height) / 3;
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.arc(width / 2, height / 2, radius, 0, Math.PI * 2, true);
  context.fill();
  context.globalCompositeOperation = 'source-over';
}

// Capture photo from the video stream
captureButton.addEventListener('click', () => {
  const context = photoCanvas.getContext('2d');
  photoCanvas.width = video.videoWidth;
  photoCanvas.height = video.videoHeight;

  // Draw the current video frame to the canvas
  context.drawImage(video, 0, 0, photoCanvas.width, photoCanvas.height);

  // Here, you can save the image or display it as needed
  const imageDataUrl = photoCanvas.toDataURL('image/png');
  console.log("Captured photo:", imageDataUrl);

  // Optional: Open the image in a new tab
  window.open(imageDataUrl);
});

// Initialize camera on page load
setupCamera();

// Register the service worker for offline capabilities
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log("Service Worker Registered"))
    .catch((error) => console.log("Service Worker Registration Failed:", error));
}
