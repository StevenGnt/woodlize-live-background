const SHADOW_1_RATIO = 300;
const SHADOW_2_RATIO = 100;

var audioContext = null;
var meter = null;
var rafID = null;

window.onload = function () {
  const bandName = document.getElementById('bandName');

  const content = document.getElementById('content');
  content.style.height = innerHeight + 'px';
  console.log(content);

  // monkeypatch Web Audio
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  // grab an audio context
  audioContext = new AudioContext();

  // Attempt to get audio input
  try {
    // monkeypatch getUserMedia
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    // ask for an audio input
    navigator.getUserMedia(
      {
        "audio": {
          "mandatory": {
            "googEchoCancellation": "false",
            "googAutoGainControl": "false",
            "googNoiseSuppression": "false",
            "googHighpassFilter": "false"
          },
          "optional": []
        },
      }, gotStream, () => {
        console.log('failed getting audio access');
      });
  } catch (e) {
    alert('getUserMedia threw exception :' + e);
  }
}

var mediaStreamSource = null;

function gotStream(stream) {
  // Create an AudioNode from the stream.
  mediaStreamSource = audioContext.createMediaStreamSource(stream);

  // Create a new volume meter and connect it.
  meter = createAudioMeter(audioContext);
  mediaStreamSource.connect(meter);

  // kick off the visual updating
  drawLoop();
}

const getBlurValue = (volume, ratio) => volume * ratio;

function drawLoop(time) {
  const firstBlur = getBlurValue(meter.volume, SHADOW_1_RATIO);
  const secondBlur = getBlurValue(meter.volume, SHADOW_2_RATIO);
  const cssShadow = `1px 1px 2px white, 0 0 ${firstBlur}px white, 0 0 ${secondBlur}px white`;

  bandName.style['text-shadow'] = cssShadow;

  // set up the next visual callback
  rafID = window.requestAnimationFrame(drawLoop);
}