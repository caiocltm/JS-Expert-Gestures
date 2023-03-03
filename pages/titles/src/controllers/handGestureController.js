import { prepareRunChecker } from "../../../lib/shared/util.js";

const { shouldRun: shouldScroll } = prepareRunChecker({ timerDelay: 195 });

export default class HandGestureController {
  #view;
  #service;
  #camera;
  #lastDirection = {
    direction: "",
    y: 0,
  };
  #pixelsPerScroll = window.innerHeight * 0.095;

  constructor({ view, service, camera }) {
    this.#view = view;
    this.#service = service;
    this.#camera = camera;
  }

  async init() {
    return this.#loop();
  }

  static async initialize(deps) {
    const handGestureController = new HandGestureController(deps);

    return handGestureController.init();
  }

  async #loop() {
    await this.#service.initializeDetector();

    await this.#estimateHands();

    this.#view.loop(this.#loop.bind(this));
  }

  async #estimateHands() {
    try {
      const hands = await this.#service.estimateHands(this.#camera.video);

      for await (const { event, x, y } of this.#service.detectGestures(hands)) {
        console.log(event);

        if (!shouldScroll()) continue;

        if (event.includes("scroll")) this.#scrollPage(event);
      }
    } catch (error) {
      console.error("Something bad happened => ", error);
    }
  }

  #scrollPage(direction) {
    if (this.#lastDirection.direction === direction) {
      this.#lastDirection.y =
        direction === "scroll-down"
          ? this.#lastDirection.y + this.#pixelsPerScroll
          : this.#lastDirection.y - this.#pixelsPerScroll;
    } else {
      this.#lastDirection.direction = direction;
    }

    this.#view.scrollPage(this.#lastDirection.y);
  }
}
