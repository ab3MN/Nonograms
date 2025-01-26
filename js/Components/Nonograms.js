import Timer from './Timer';
import Modal from './Modal';
import generateResults from './generateResults';

import { getRandomDifferentItem } from '../helpers/getRandomInt';
import { calculateMatrixPositiveValues } from '../helpers/matrix';
import { getTime } from '../helpers/getTime';
import {
  SAVE__ICON,
  DOWNLOAD__ICON,
  RESET__ICON,
  START__ICON,
  SCORE__ICON,
  RANDOM__ICON,
  TEPLATE__ICON,
} from '../helpers/icons';

const modal = new Modal();

export default class Nonograms extends Timer {
  constructor(nonograms, root) {
    super();
    Object.assign(this, {
      /* ==================== Node elements ==================== */
      root,
      section: null,
      wrapper: null,
      sectionWrapper: null,
      board: null,
      gameTimer: null,
      buttonContainer: null,
      main: null,
      clickSound: null,
      templateSelector: null,

      /* ==================== Game params ==================== */
      nonograms,
      nonogram: null,
      id: null,
      template: null,
      userAnswer: null,
      count: 0,
      winningSquares: 0,
      level: null,
      crossMatrix: null,
      name: null,
      savedTime: 0,
    });
  }

  /* ==================== HELPERS ==================== */
  getRandomTemplate() {
    let level = getRandomDifferentItem(['easy', 'medium', 'hard']);

    if (!this.level) level = 'easy';

    const nonogram = getRandomDifferentItem(this.nonograms[level], this.id);

    const { template, id } = nonogram;
    this.reset(nonogram);
    Object.assign(this, { nonogram, id, template, level });
  }
  createDomNode(el = 'div', ...classes) {
    const domElement = document.createElement(el);
    domElement.classList.add(...classes);
    return domElement;
  }
  createButton(text, handleEvent, type, icon) {
    const button = this.createDomNode('button', 'button', `${type}--button`);
    button.onclick = handleEvent;
    button.addEventListener('click', () => this.handleSoundPlayClick());
    button.innerHTML = icon + '  ' + text;

    this.buttonContainer.append(button);
  }
  calculateWinnersSquares() {
    this.winningSquares = calculateMatrixPositiveValues(this.template);
  }
  /* ==================== CREATE DOM NODE ==================== */
  generateGame(savedGame = null) {
    if (!this.main) {
      this.main = this.createDomNode('main', 'main');
      this.clickSound = this.createAudio('./src/assets/sounds/click.mp3');
      this.crossSound = this.createAudio('./src/assets/sounds/cross.mp3');
      this.paintSound = this.createAudio('./src/assets/sounds/paint.mp3');
    }

    if (this.sectionWrapper) this.main.innerHTML = '';

    if (!this.nonogram) this.getRandomTemplate();

    if (savedGame) {
      const { count, nonogram, userAnswer, level, crossMatrix, savedTime } =
        savedGame;
      const { template, id } = nonogram;

      Object.assign(this, {
        count,
        nonogram,
        userAnswer,
        level,
        template,
        id,
        crossMatrix,
        savedTime,
      });
    }

    this.createDOM();

    this.root.append(this.main);
  }
  createDOM() {
    this.calculateWinnersSquares();
    this.createSection();
    this.createGameTimer();
    this.createLogo();
    this.createClues();
    this.createBoard();
    this.createButtons();
    this.createAllSelect();
  }
  createSection() {
    this.section = this.createDomNode(
      'section',
      'section',
      'nonograms',
      this.level
    );
    this.sectionWrapper = this.createDomNode('div', 'wrapper');

    this.wrapper = this.createDomNode('div', 'nonograms__wrapper');
    this.sectionWrapper.append(this.wrapper);

    this.section.append(this.sectionWrapper);
    this.main.append(this.section);
  }
  createGameTimer() {
    this.gameTimer = this.createDomNode('h2', 'nonograms__timer');
    this.savedTime !== 0
      ? (this.gameTimer.innerText = getTime(this.savedTime))
      : (this.gameTimer.innerText = '00:00:00');

    this.sectionWrapper.prepend(this.gameTimer);
  }
  createLogo() {
    const logo = this.createDomNode('div', 'nonograms__logo');
    logo.innerHTML = `<img class="nonograms__img" src="./src/assets/img/logo.png" alt="Logo" />`;
    this.wrapper.append(logo);
  }
  createClues() {
    const { clues } = this.nonogram;
    const { col, row } = clues;
    this.createClue(col, 'top', 'nonograms__clue--col');
    this.createClue(row, 'left', 'nonograms__clue--row');
  }
  createClue(data, type, clueClass) {
    const clueWrapper = this.createDomNode('div', 'nonograms__clues', type);

    data.forEach((el) => {
      const clue = this.createDomNode('div', 'nonograms__clue');
      const clues = el.split(',');

      for (let i = 0; i < 5; i++) {
        const clueItem = this.createDomNode('div', clueClass);
        if (clues[i]) clueItem.innerText = clues[i];
        clue.append(clueItem);
      }
      clueWrapper.append(clue);
    });
    this.wrapper.append(clueWrapper);
  }
  createBoard() {
    this.board = this.createDomNode('div', 'nonograms__board');
    this.template.forEach((el, row) => {
      const boardRow = this.createDomNode('div', 'nonograms__board--row');
      el.forEach((item, col) => this.createBoardItem(item, col, row, boardRow));
      this.board.append(boardRow);
    });

    this.board.onmousedown = this.handleClick;
    this.board.oncontextmenu = (e) => e.preventDefault();

    this.wrapper.append(this.board);
  }
  createBoardItem(item, col, row, boardRow) {
    const boardItem = this.createDomNode('button', 'nonograms__board--item');
    const firsLine = this.createDomNode('span');
    const secondLine = this.createDomNode('span');

    boardItem.dataset.col = col;
    boardItem.dataset.row = row;
    boardItem.dataset.isWinner = !!item;
    boardItem.append(firsLine);
    boardItem.append(secondLine);

    boardRow.append(boardItem);
  }
  createButtons() {
    this.buttonContainer = this.createDomNode('div', 'button__container');
    this.createButton('Start', this.handleStart, 'start', START__ICON);
    this.createButton('Restart', this.handleRestart, 'restart', RESET__ICON);
    this.createButton('Save', this.handleSaveGame, 'save', SAVE__ICON);
    this.createButton('Load', this.handleLoadGame, 'load', DOWNLOAD__ICON);
    this.createButton('Score', this.handleShowResult, 'score', SCORE__ICON);
    this.createButton(
      'Template',
      this.handleShowAnswer,
      'answer',
      TEPLATE__ICON
    );
    this.createButton(
      'Random Game',
      this.handleRandomGame,
      'random',
      RANDOM__ICON
    );

    this.section.append(this.buttonContainer);
  }
  createAudio(src = '') {
    const clickSound = this.createDomNode('audio', 'click__sound');

    clickSound.innerHTML = `<source src=${src} type="audio/mpeg">`;
    this.root.append(clickSound);
    return clickSound;
  }
  createAllSelect() {
    const selectContainer = this.createDomNode('div', 'select__container');
    this.createSelect(
      [{ name: 'easy' }, { name: 'medium' }, { name: 'hard' }],
      this.handleSelectGameLevel,
      '',
      selectContainer
    );

    this.templateSelector = this.createSelect(
      this.nonograms[this.level],
      this.handleSelectGameTemplate,
      'template',
      selectContainer
    );
    this.buttonContainer.prepend(selectContainer);
  }
  createSelect(options = [], event, type = '', root) {
    const select = this.createDomNode('select', 'nonograms__select');
    this.createOption(options, select, type);

    select.onchange = event;
    this.sectionWrapper.append(select);
    root.append(select);
    return select;
  }
  createOption(options = [], select, type) {
    const opt = this.createDomNode('option', 'nonograms__dificult');
    type === 'template'
      ? (opt.innerText = 'Choose Template')
      : (opt.innerText = 'Choose difficult');
    opt.selected = 'true';
    opt.disabled = 'disabled';
    select.append(opt);

    options.forEach(({ name }) => {
      const option = this.createDomNode('option', 'nonograms__dificult');
      option.value = name;
      option.innerText = name;
      select.append(option);
    });
  }

  /* ==================== LISTENERS ==================== */
  handleStart = () => {
    if (!this.name) {
      modal.genereateModal('<h3>Need to choose level and template</h3>');
      return;
    }

    this.nonogram = this.nonograms[this.level].find(
      ({ name }) => name === this.name
    );
    const { template, id } = this.nonogram;
    Object.assign(this, { id, template });

    this.reset(this.nonogram);
    this.generateGame();
    this.name = '';
  };
  handleSelectGameLevel = (e) => {
    const { value } = e.target;
    if (value !== this.level) {
      this.level = value;
      this.templateSelector.innerHTML = '';
      this.createOption(
        this.nonograms[this.level],
        this.templateSelector,
        'template'
      );
    }
  };
  handleSelectGameTemplate = (e) => {
    const { value } = e.target;
    this.name = value;
  };
  handleClick = (e) => {
    if (!this.isTimerActive && this.savedTime === 0) {
      super.play(this.gameTimer);
    }
    if (this.savedTime !== 0) {
      super.play(this.gameTimer, this.savedTime);

      this.savedTime = 0;
    }
    const { target, button } = e;
    this.checkWinnerSquares(target, button);
    button === 2
      ? this.handleBoardItemToggle(target, 'cross', 'active')
      : this.handleBoardItemToggle(target, 'active', 'cross');
  };
  handleBoardItemToggle = (item, aciveClass, removeClass) => {
    item.classList.contains(aciveClass)
      ? item.classList.remove(aciveClass)
      : (item.classList.add(aciveClass), item.classList.remove(removeClass));
  };
  handleRestart = () => {
    this.level = this.nonogram.level;

    this.generateGame();
    this.reset(this.nonogram);
  };
  handleShowResult = () => {
    const score = this.getBestScore();
    if (score) {
      const bestScore = generateResults(score);
      modal.genereateModal(bestScore);
    } else {
      modal.genereateModal('<h3> No Results! :( </h3>');
    }
  };
  handleRandomGame = (e) => {
    e.disabled = true;
    this.reset(this.nonogram);
    this.nonogram = null;
    this.generateGame();
  };
  handleShowAnswer = () => {
    this.board.childNodes.forEach(({ childNodes }) =>
      childNodes.forEach(({ dataset, classList }) => {
        const { isWinner } = dataset;
        classList.add('cross');

        if (isWinner === 'true') {
          classList.add('active');
          classList.remove('cross');

          this.board.onmousedown = null;
          super.stop(this.gameTimer);
        } else {
          classList.remove('active');
        }
      })
    );
  };
  handleSaveGame = () => {
    const savedGame = {
      count: this.count,
      nonogram: this.nonogram,
      userAnswer: this.userAnswer,
      level: this.level,
      crossMatrix: this.crossMatrix,
      savedTime: this.time,
    };

    localStorage.setItem('lastGame', JSON.stringify(savedGame));
  };
  handleLoadGame = () => {
    const lastGame = localStorage.getItem('lastGame');
    super.stop();

    this.generateGame(JSON.parse(lastGame));
    this.loadBoardItems(this.board.childNodes, this.userAnswer, 'active');
    this.loadBoardItems(this.board.childNodes, this.crossMatrix, 'cross');
  };
  loadBoardItems(boardItems, matrix, _class) {
    matrix.forEach((item, row) =>
      item.forEach(
        (el, col) =>
          !!el && boardItems[row].childNodes[col].classList.add(_class)
      )
    );
  }
  handleSoundPlayClick = (type) => {
    const volume = localStorage.getItem('volume');
    if (volume !== 'on') return;
    switch (type) {
      case 'cross':
        return this.crossSound.play();
      case 'paint':
        return this.paintSound.play();
      default:
        return this.clickSound.play();
    }
  };
  /* ==================== CHECKWINNER ==================== */
  checkWinnerSquares(item, status) {
    const { row, col } = item.dataset;
    if (!row & !col) return;

    if (this.userAnswer[row][col] !== 1 && status === 0) {
      this.userAnswer[row][col] = 1;
      this.count += 1;
      this.handleSoundPlayClick('paint');

      if (this.crossMatrix[row][col] === 2) {
        this.handleSoundPlayClick('paint');
        this.crossMatrix[row][col] = 0;
      }
    } else if (this.userAnswer[row][col] === 1) {
      status === 2
        ? this.handleSoundPlayClick('cross')
        : this.handleSoundPlayClick();

      this.userAnswer[row][col] = 0;
      this.count -= 1;
      this.crossMatrix[row][col] = 2;
    } else if (status === 2) {
      this.handleSoundPlayClick('cross');

      this.crossMatrix[row][col] = 2;
    }

    if (this.count === this.winningSquares) this.checkWinner();
  }
  checkWinner() {
    const isWinner =
      JSON.stringify(this.template) === JSON.stringify(this.userAnswer);

    if (isWinner) {
      this.board.onmousedown = null;
      const bestScore = this.getBestScore();
      const score = {
        template: this.nonogram.name,
        time: getTime(this.time),
        level: this.level,
      };
      const winSound = this.createAudio('./src/assets/sounds/win.mp3');
      winSound.play();

      this.saveScore({
        template: this.nonogram.name,
        time: this.time,
        level: this.level,
      });
      const res = generateResults(bestScore, score);
      modal.genereateModal(res);

      super.stop(this.gameTimer);
    }
  }
  saveScore(winner) {
    const score = localStorage.getItem('score');
    const save = (_score = []) => {
      _score.push(winner);
      localStorage.setItem('score', JSON.stringify(_score));
    };
    return !score ? save() : save(JSON.parse(score));
  }
  getBestScore() {
    const score = localStorage.getItem('score');
    if (score) {
      const _score = JSON.parse(score);
      const results = _score
        .sort((a, b) => a.time - b.time)
        .slice(0, 5)
        .map(({ template, time, level }) =>
          Object.assign({}, { template, level, time: getTime(time) })
        );
      return results;
    }
  }
  /* ==================== RESET ==================== */
  reset({ template }) {
    const userAnswer = template.map((el) => el.map(() => 0));
    const crossMatrix = template.map((el) => el.map(() => 0));
    super.stop();

    Object.assign(this, { userAnswer, count: 0, crossMatrix });
  }
}
