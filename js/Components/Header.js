import {
  MOON__ICON,
  SUN__ICON,
  VOLUME__ON__ICON,
  VOLUME__OF__ICON,
  PLAY__ICON,
  STOP_ICON,
} from '../helpers/icons';
export default class Header {
  constructor(root) {
    Object.assign(this, {
      root,
      themaButton: null,
      volumeButton: null,
      isMusicPlay: false,
      music: null,
      musicButton: null,
    });
  }
  /* ==================== HELPERS ==================== */
  createDomNode(el = 'div', ...classes) {
    const domElement = document.createElement(el);
    domElement.classList.add(...classes);
    return domElement;
  }
  createButton(text, handleEvent, type) {
    const button = this.createDomNode('button', 'button', `${type}--button`);
    button.innerText = text;
    button.onclick = handleEvent;

    this.buttonContainer.append(button);
    return button;
  }

  generateHeader() {
    const volume = localStorage.getItem('volume');
    if (!volume) localStorage.setItem('volume', 'on');
    this.createHeader();
    this.createButtons(volume);
    this.music = this.createAudio();

    this.checkThema();
  }
  /* ==================== CREATE DOM NODE ==================== */
  createHeader() {
    this.header = this.createDomNode('header', 'header');

    this.header.innerHTML = `<h1 class="nonograms__title">Nonograms</h1>`;

    this.root.append(this.header);
  }
  createButtons(volume) {
    this.buttonContainer = this.createDomNode('div', 'button__container');
    this.themaButton = this.createButton('button', this.handleSwitch, 'thema');
    this.volumeButton = this.createButton(
      'button',
      this.handleVolumeToggle,
      'volume'
    );
    volume === 'on'
      ? (this.volumeButton.innerHTML = VOLUME__OF__ICON)
      : (this.volumeButton.innerHTML = VOLUME__ON__ICON);

    this.musicButton = this.createButton(
      'button',
      this.handleMusicToggle,
      'music'
    );
    this.musicButton.innerHTML = PLAY__ICON;

    this.header.append(this.buttonContainer);
  }
  createAudio() {
    const music = this.createDomNode('audio');
    music.innerHTML = `<source src="./src/assets/sounds/music.mp3" type="audio/mpeg">`;
    this.root.append(music);
    return music;
  }

  /* ==================== LISTENERS ==================== */
  handleSwitch = () => {
    const thema = localStorage.getItem('thema');

    thema === 'light' || !thema
      ? this.setThema('dark', 'light', SUN__ICON)
      : this.setThema('light', 'dark', MOON__ICON);
  };
  handleVolumeToggle = () => {
    const volume = localStorage.getItem('volume');
    volume === 'on'
      ? (localStorage.setItem('volume', 'of'),
        (this.volumeButton.innerHTML = VOLUME__ON__ICON))
      : (localStorage.setItem('volume', 'on'),
        (this.volumeButton.innerHTML = VOLUME__OF__ICON));
  };
  handleMusicToggle = () =>
    this.isMusicPlay ? this.handleStopMusic() : this.handlePlayMusic();

  handleStopMusic() {
    this.music.pause();
    this.music.currentTime = 0;
    this.isMusicPlay = false;
    this.musicButton.innerHTML = PLAY__ICON;
  }
  handlePlayMusic() {
    this.music.play();
    this.isMusicPlay = true;
    this.musicButton.innerHTML = STOP_ICON;
  }

  /* ==================== THEMA ==================== */
  setThema(active, remove, icon) {
    localStorage.setItem('thema', active);
    this.changeRootClass(active, remove, icon);
  }
  changeRootClass(active, remove, icon) {
    this.root.classList.add(active), this.root.classList.remove(remove);
    this.themaButton.innerHTML = icon;
  }
  checkThema() {
    const thema = localStorage.getItem('thema');
    thema === 'dark'
      ? this.changeRootClass('dark', 'light', SUN__ICON)
      : this.changeRootClass('light', 'dark', MOON__ICON);
  }
}
