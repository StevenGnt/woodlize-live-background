import config from '../config';

const state = {
  currentTrackIndex: 0
};

const nextTrack = () => state.currentTrackIndex++;
const prevTrack = () => state.currentTrackIndex--;
const getCurrentTrack = () => config.tracklist[state.currentTrackIndex] || config.tracklist[0];

const getBlurValue = (volume, ratio) => volume * ratio;
const getTrackTextColor = track => track.colors.text || 'white';
const getTrackBackground = track => `${config.constants.BACKGROUNDS_PATH}/${track.id}.jpg`;

export default function liveBackground(background, title, meter) {
  // Preload tracks backgrounds
  config.tracklist.forEach(track => {
    const image = new Image();
    image.src = getTrackBackground(track);
  });

  // Track changed callback
  const trackChanged = () => {
    const track = getCurrentTrack();
    background.style['background-image'] = `url('${getTrackBackground(track)}')`;
    title.style['color'] = getTrackTextColor(track);
  };

  trackChanged();

  // Set style change watcher
  setInterval(() => {
    const track = getCurrentTrack();

    const firstBlurValue = getBlurValue(meter.volume, config.constants.SHADOW_1_RATIO);
    const secondBlurValue = getBlurValue(meter.volume, config.constants.SHADOW_2_RATIO);

    const firstBlur = `0 0 ${firstBlurValue}px ${track.colors.shadow1}`;
    const secondBlur = `0 0 ${secondBlurValue}px ${track.colors.shadow2}`;

    title.style['text-shadow'] = `1px 1px 2px ${getTrackTextColor(track)}, ${firstBlur}, ${secondBlur}`;
  }, config.constants.REFRESH_INTERVAL);

  // Listen to key down (prev/next song)
  document.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowRight':
        nextTrack();
        trackChanged();
        break;
      case 'ArrowLeft':
        prevTrack();
        trackChanged();
        break;
    }
  });
}
