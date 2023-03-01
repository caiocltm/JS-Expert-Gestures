export default class VideoPlayerController {
  #view;
  #service;

  constructor({ view, service }) {
    this.#view = view;
    this.#service = service;

    this.#view.configureBtnClick(this.onBtnStart.bind(this));
  }

  static async initialize(deps) {
    const videoPlayerController = new VideoPlayerController(deps);

    videoPlayerController.log(
      "Didn't detect yet eye blink! click in the button to start!"
    );

    return videoPlayerController.init();
  }

  async init() {
    this.#view.enableButton();
  }

  log(text) {
    this.#view.log(text);
  }

  onBtnStart() {
    this.log("Initializing detection...");
  }
}
