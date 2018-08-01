export const fixAz = azToFix => {
  let azFix = azToFix;
  if (azToFix < 0) {
    azFix = azToFix + 360;
  } else {
    azFix = azToFix % 360;
  }
  return azFix;
};
export const modAz = (azToMod, newAz) => {
  const azDiff = Math.abs(newAz - azToMod);
  let azMod = azToMod;
  if (azDiff > 180) {
    if (newAz > azToMod) {
      azMod = newAz + (360 - azDiff);
    } else {
      azMod = newAz - (360 - azDiff);
    }
  }
  return azMod;
};
