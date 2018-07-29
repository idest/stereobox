function toAZFromQD(qd, qdDip) {
  let strikeSense = qd.strikeSense;
  let strike = qd.strike;
  let dipSense = qdDip.dipSense;
  let dip = qdDip.dip;
  let az;
  if (/NS/i.test(strikeSense) && (/E/i.test(dipSense) || /W/i.test(dipSense))) {
    az = /E/i.test(dipSense) ? 0 : 180;
  } else if (
    /EW/i.test(strikeSense) &&
    (/S/.test(dipSense) || /N/i.test(dipSense))
  ) {
    az = /S/i.test(dipSense) ? 90 : 270;
  } else if (
    /NE/i.test(strikeSense) &&
    (/SE/i.test(dipSense) || /NW/i.test(dipSense))
  ) {
    az = /SE/i.test(dipSense) ? strike : 180 + strike;
  } else if (
    /NW/i.test(strikeSense) &&
    (/NE/i.test(dipSense) || /SW/i.test(dipSense))
  ) {
    az = /NE/i.test(dipSense) ? 360 - strike : 180 - strike;
  } else {
    console.log('toAZFromQD else case fired, investigate!');
    return { horizontal: NaN, vertical: NaN };
  }
  dip = Number.isNaN(az) ? NaN : dip;
  return { horizontal: az, vertical: dip };
}

function toAZFromDD(dd, dip) {
  let az;
  if (dd >= 0 && dd < 90) {
    az = dd + 270;
  } else if (dd >= 90 && dd < 360) {
    az = dd - 90;
  } else {
    console.log('toAZFromDD else case fired, investigate!');
    return { horizontal: NaN, vertical: NaN };
  }
  return { horizontal: az, vertical: dip };
}

function toQDFromAZ(az, dip) {
  az = Math.round(az);
  dip = Math.round(dip);
  let strike;
  let dipSense;
  if (az === 0 || az === 180 || az === 360) {
    strike = 'NS';
    dipSense = az === 180 ? 'W' : 'E';
  } else if (az === 90 || az === 270) {
    strike = 'EW';
    dipSense = az === 90 ? 'S' : 'N';
  } else if (az > 0 && az < 90) {
    strike = 'N' + az.toFixed(0) + 'E';
    dipSense = 'SE';
  } else if (az > 90 && az < 180) {
    strike = 'N' + (180 - az).toFixed(0) + 'W';
    dipSense = 'SW';
  } else if (az > 180 && az < 270) {
    strike = 'N' + (az - 180).toFixed(0) + 'E';
    dipSense = 'NW';
  } else if (az > 270 && az < 360) {
    strike = 'N' + (360 - az).toFixed(0) + 'W';
    dipSense = 'NE';
  } else {
    console.log('toQDFromAZ else case fired, investigate!');
    return { horizontal: NaN, vertical: NaN };
  }
  return { horizontal: strike, vertical: dip + dipSense };
}

function toDDFromAZ(az, dip) {
  az = Math.round(az);
  dip = Math.round(dip);
  let dipDirection;
  if (az >= 270 && az <= 360) {
    dipDirection = az - 270;
  } else if (az >= 0 && az < 270) {
    dipDirection = az + 90;
  } else {
    console.log('toDDFromAZ else case fired, investigate!');
    return { horizontal: NaN, vertical: NaN };
  }
  return { horizontal: dipDirection, vertical: dip };
}

function tryConvert(horizontal, vertical, validatorFunction, convertFunction) {
  const validated = validatorFunction(horizontal, vertical);
  if (validated) {
    return convertFunction(validated.horizontal, validated.vertical);
  } else {
    console.log('Validation error');
  }
  return { horizontal: NaN, vertical: NaN };
}

export { tryConvert, toQDFromAZ, toDDFromAZ, toAZFromQD, toAZFromDD };
