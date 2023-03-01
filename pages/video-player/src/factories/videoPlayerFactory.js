import Camera from "../../../lib/shared/camera.js";
import { supportsWorkerType } from "../../../lib/shared/util.js";
import VideoPlayerController from "../controllers/videoPlayerController.js";
import VideoPlayerService from "../services/videoPlayerService.js";
import VideoPlayerView from "../views/videoPlayerView.js";

async function getWorker() {
  if (supportsWorkerType())
    return new Worker("./src/workers/videoPlayerWorker.js", { type: "module" });

  return {
    async postMessage() {},

    onmessage(message) {},
  };
}

const worker = await getWorker();
const camera = await Camera.init();
const [rootPath] = window.location.href.split("/pages/");

const videoPlayerFactory = {
  async initialize() {
    return VideoPlayerController.initialize({
      view: new VideoPlayerView(),
      service: new VideoPlayerService({}),
    });
  },
};

export default videoPlayerFactory;
