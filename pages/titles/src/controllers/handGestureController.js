import { prepareRunChecker } from "../../../lib/shared/util.js";

const { shouldRun: shouldScroll } = prepareRunChecker({ timerDelay: 300 });
const { shouldRun: shouldClick } = prepareRunChecker({ timerDelay: 300 });

export default class HandGestureController {
  #view;
  #service;
  #camera;
  #lastDirection = {
    direction: "",
    y: 0,
  };

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

      this.#view.clearCanvas();

      if (hands?.length) this.#view.drawResults(hands);

      for await (const { event, x, y } of this.#service.detectGestures(hands)) {
        if (event === "click") {
          if (!shouldClick()) continue;

          this.#view.clickOnElement(x, y);

          continue;
        }

        console.log(event);

        if (!shouldScroll()) continue;

        if (event.includes("scroll")) this.#scrollPage(event);
      }
    } catch (error) {
      console.error("Something bad happened => ", error);
    }
  }

  #scrollPage(direction) {
    const pixelsPerScroll = this.#view.getScrollHeight() * 0.09;

    if (this.#lastDirection.direction !== direction) {
      this.#lastDirection.direction = direction;
      this.#view.scrollPage(this.#lastDirection.y);

      return;
    }

    if (
      direction === "scroll-down" &&
      this.#lastDirection.y + pixelsPerScroll < this.#view.getScrollHeight()
    )
      this.#lastDirection.y += pixelsPerScroll;

    if (
      direction === "scroll-up" &&
      this.#lastDirection.y - pixelsPerScroll >= 0
    )
      this.#lastDirection.y -= pixelsPerScroll;

    this.#view.scrollPage(this.#lastDirection.y);
  }
}
