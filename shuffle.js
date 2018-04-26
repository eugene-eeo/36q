/**
 * Randomize the order of the elements in a given array.
 * @param {Array} arr - The given array.
 * @param {Function} rng - Specifies a custom random number generator.
 * @returns {Array}
 */
function shuffle(arr, rng) {
  var len = arr.length,
      random,
      temp;

  while (len) {
    random = Math.floor(rng() * len);
    len -= 1;
    temp = arr[len];
    arr[len] = arr[random];
    arr[random] = temp;
  }

  return arr;
}
