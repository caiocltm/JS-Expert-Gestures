import "https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js";
import "https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js";
import "https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js";
import "https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js";
import VideoPlayerService from "../services/videoPlayerService.js";

const { tf, faceLandmarksDetection } = self;

tf.setBackend("webgl");

const videoPlayerService = new VideoPlayerService({
  faceLandmarksDetection,
});

console.log("Loading Tensorflow model...");
await videoPlayerService.loadModel();
console.log("Tensorflow model successfully loaded!");

postMessage("READY");

onmessage = async ({ data: video }) => {
  const blinked = await videoPlayerService.handBlinked(video);

  if (!blinked) return;

  postMessage({ blinked });
};
