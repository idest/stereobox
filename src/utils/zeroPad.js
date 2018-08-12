function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const zeroPad = (num, numZeros) => {
  console.log('num', num);
  if (isNumeric(num) && Math.round(num) !== 0) {
    console.log('zeroPad if');
    const an = Math.abs(num);
    const digitCount = 1 + Math.floor(Math.log(an) / Math.LN10);
    if (digitCount >= numZeros) {
      return num;
    }
    const zeroString = Math.pow(10, numZeros - digitCount)
      .toString()
      .substr(1);
    return num < 0 ? '-' + zeroString + an : zeroString + an;
  } else if (isNumeric(num) && Math.round(num) === 0) {
    console.log('zeroPad else if');
    return Math.pow(10, numZeros)
      .toString()
      .substr(1);
  } else {
    console.log('zeroPad else');
    return num;
  }
};

export default zeroPad;
