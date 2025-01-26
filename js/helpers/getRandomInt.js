export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function getRandomDifferentItem(data, id = null) {
  const item = data[getRandomInt(data.length)];
  return item.id === id ? getRandomDifferentItem(data, id) : item;
}
