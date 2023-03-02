import Camera from "../../../lib/shared/camera.js";
import { supportsWorkerType } from "../../../lib/shared/util.js";
import VideoPlayerController from "../controllers/videoPlayerController.js";
import VideoPlayerService from "../services/videoPlayerService.js";
import VideoPlayerView from "../views/videoPlayerView.js";

async function getWorker() {
  if (supportsWorkerType()) {
    console.log("Initializing ESM WebWorkers...");

    return new Worker("./src/workers/videoPlayerWorker.js", { type: "module" });
  }

  console.warn("Your browser doesn't supports ESM modules on WebWorkers");
  console.warn("Importing libraries...");

  await import("https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js");
  await import(
    "https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js"
  );
  await import(
    "https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js"
  );
  await import(
    "https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js"
  );

  console.warn("Using WebWorker mock instead!");

  const videoPlayerService = new VideoPlayerService({
    faceLandmarksDetection: window.faceLandmarksDetection,
  });

  const workerMock = {
    async postMessage(video) {
      const blinked = await videoPlayerService.handBlinked(video);

      if (!blinked) return;

      workerMock.onmessage({ data: { blinked } });
    },

    onmessage(message) {},
  };

  console.log("Loading Tensorflow model...");
  await videoPlayerService.loadModel();
  console.log("Tensorflow model successfully loaded!");

  setTimeout(() => worker.onmessage({ data: "READY" }), 600);

  return workerMock;
}

const worker = await getWorker();
const camera = await Camera.init();
const [rootPath] = window.location.href.split("/pages/");

const videoPlayerFactory = {
  async initialize() {
    return VideoPlayerController.initialize({
      view: new VideoPlayerView(),
      worker,
      camera,
    });
  },
};

export default videoPlayerFactory;
