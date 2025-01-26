import { getTime } from '../helpers/getTime';
export default class Timer {
  constructor() {
    this.isTimerActive = false;
    this.time = 0;
    this.timerInterval;
  }
  play(count, savedTime) {
    if (savedTime) this.time = savedTime;
    this.isTimerActive = true;

    this.timerInterval = setInterval(() => {
      this.time += 1005;
      count.innerText = getTime(this.time);
    }, 1000);
  }

  stop() {
    this.time = 0;
    this.isTimerActive = false;
    clearInterval(this.timerInterval);
  }
}
