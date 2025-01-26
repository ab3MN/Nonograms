export const getTime = (ms) => {
  let hour = Math.floor(ms / 3_600_00);
  if (hour >= 0 && hour < 9) hour = '0' + hour;

  let min = Math.floor(ms / 60_000);
  min = convertTime(min);

  let sec = Math.floor(ms / 1_000);
  sec = convertTime(sec);

  const time = `${hour}:${min}:${sec}`;

  return time;
};

function convertTime(time) {
  let _time = time;
  if (_time > 60) _time = _time % 60;
  if (_time === 60) _time = 0;
  if (_time >= 0 && _time < 10) _time = '0' + _time;
  return _time;
}
