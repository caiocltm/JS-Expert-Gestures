const { GestureDescription, Finger, FingerCurl } = window.fp;

const ScrollDown = new GestureDescription("scroll-down"); // ✊️
const ScrollUp = new GestureDescription("scroll-up"); // 🖐
const Click = new GestureDescription("click"); // 🤏

ScrollDown.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
ScrollDown.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  ScrollDown.addCurl(finger, FingerCurl.FullCurl, 1.0);
  ScrollDown.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

for (let finger of Finger.all) {
  ScrollUp.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

Click.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.8);
Click.addCurl(Finger.Index, FingerCurl.FullCurl, 0.5);

Click.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
Click.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.4);

Click.addCurl(Finger.Middle, FingerCurl.HalfCurl, 1.0);
Click.addCurl(Finger.Middle, FingerCurl.FullCurl, 0.9);

Click.addCurl(Finger.Ring, FingerCurl.HalfCurl, 1.0);
Click.addCurl(Finger.Ring, FingerCurl.FullCurl, 0.9);

Click.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0);
Click.addCurl(Finger.Pinky, FingerCurl.FullCurl, 0.9);

const knownGestures = [ScrollDown, ScrollUp, Click];

const gesturesStrings = {
  "scroll-down": "✊️",
  "scroll-up": "🖐",
  click: "🤏",
};

export { knownGestures, gesturesStrings };
