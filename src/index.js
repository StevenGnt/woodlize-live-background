import audioHelper from './audioHelper';
import liveBackground from './liveBackground';

window.onload = function () {
  // Bootstrap background behavior
  audioHelper.getMeter()
    .then(meter => {
      const title = document.getElementById('bandName');
      const body = document.getElementsByTagName('body')[0];
      liveBackground(body, title, meter);
    });
}
