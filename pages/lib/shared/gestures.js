const { GestureDescription, Finger, FingerCurl } = window.fp;

const ScrollDown = new GestureDescription("scroll-down"); // ✊️
const ScrollUp = new GestureDescription("scroll-up"); // 🖐

ScrollDown.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
ScrollDown.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  ScrollDown.addCurl(finger, FingerCurl.FullCurl, 1.0);
  ScrollDown.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

for (let finger of Finger.all) {
  ScrollUp.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

const knownGestures = [ScrollDown, ScrollUp];

const gesturesStrings = {
  "scroll-down": "✊️",
  "scroll-up": "🖐",
};

export { knownGestures, gesturesStrings };
