import { volumeAudioProcess, createAudioMeter } from './utils';

/**
 * Request access to the audiostream
 * @returns {Promise}
 */
const getAudioStream = () => {
  return new Promise((resolve, reject) => {
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
        }, resolve, reject);
    } catch (e) {
      reject(e);
    }
  });
};

const getMeter = () => {
  return getAudioStream()
    .then(stream => {
      // Create an AudioNode from the stream.
      const audioContext = new AudioContext();
      const mediaStreamSource = audioContext.createMediaStreamSource(stream);
      // Create a new volume meter and connect it.
      const meter = createAudioMeter(audioContext);

      mediaStreamSource.connect(meter);

      return meter;
    })
    .catch(e => {
      console.error('An error occured while creating meter', e);
    });
};

export default { getMeter };
