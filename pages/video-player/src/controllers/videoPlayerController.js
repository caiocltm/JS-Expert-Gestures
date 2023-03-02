export default class VideoPlayerController {
  #view;
  #worker;
  #camera;
  #blinkCounter = 0;

  constructor({ view, worker, camera }) {
    this.#view = view;
    this.#worker = this.#configureWorker(worker);
    this.#camera = camera;

    this.#view.configureBtnClick(this.onBtnStart.bind(this));
  }

  static async initialize(deps) {
    const videoPlayerController = new VideoPlayerController(deps);

    videoPlayerController.log(
      "Didn't detect yet eye blink! click in the button to start!"
    );

    return videoPlayerController.init();
  }

  #configureWorker(worker) {
    let ready = false;

    worker.onmessage = ({ data }) => {
      if ("READY" === data) {
        console.log("Worker is READY!");

        this.#view.enableButton();

        ready = true;

        return;
      }

      const blinked = data.blinked;

      this.#blinkCounter += blinked;

      console.log("Blinked => ", blinked);

      this.#view.togglePlayVideo();
    };

    return {
      send(message) {
        if (!ready) return;

        worker.postMessage(message);
      },
    };
  }

  async init() {}

  log(text) {
    const times = `     - Blinked times: ${this.#blinkCounter}`;

    this.#view.log(`Status: ${text}`.concat(this.#blinkCounter ? times : ""));
  }

  onBtnStart() {
    this.log("Initializing detection...");

    this.#blinkCounter = 0;

    this.loop();
  }

  loop() {
    const video = this.#camera.video;
    const image = this.#view.getVideoFrame(video);

    this.#worker.send(image);

    this.log("Detecting eye blink...");

    setTimeout(() => this.loop(), 100);
  }
}
