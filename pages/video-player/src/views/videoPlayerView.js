export default class VideoPlayerView {
  #btnInit = document.querySelector("#init");
  #statusElement = document.querySelector("#status");

  enableButton() {
    this.#btnInit.disabled = false;
  }

  configureBtnClick(fn) {
    this.#btnInit.addEventListener("click", fn);
  }

  log(text) {
    this.#statusElement.innerHTML = text;
  }
}
