function AZValidator(az, dip) {
  let azPattern = /^\d{1,3}$|^\d{1,3}\.\d+$/;
  let dipPattern = /^\d{1,2}$|^\d{1,2}\.\d+$/;
  //function test() {
  //  return true;
  //}
  //let azPattern = { test: test };
  //let dipPattern = { test: test };
  if (azPattern.test(az) && dipPattern.test(dip)) {
    az = parseFloat(az);
    dip = parseFloat(dip);
    let azimuthValidator = !Number.isNaN(az) && (az >= 0 && az <= 360);
    let dipValidator = !Number.isNaN(dip) && (dip >= 0 && dip <= 90);
    if (azimuthValidator && dipValidator) {
      return { horizontal: az, vertical: dip };
    }
  }
  return false;
}

function QDValidator(qd, qdDip) {
  let strikePattern = /^[NSEW]\d{0,2}[NSEW]$/i;
  let dipPattern = /^\d{1,2}[NSEW]{1,2}$/i;
  if (strikePattern.test(qd) && dipPattern.test(qdDip)) {
    let strikeSense = qd.match(/[NSEW]/gi).join('');
    let dipSense = qdDip.match(/[NSEW]{1,2}/i)[0];
    let strike = parseFloat(qd.match(/(?!^)\d{0,2}/)[0]);
    let dip = parseFloat(qdDip.match(/\d{1,2}/)[0]);
    let strikeSenseValidator = /N[SEW]|EW/i.test(strikeSense);
    let dipSenseValidator = /[NS][EW]|[NSEW]/i.test(dipSense);
    let strikeValidator = Number.isNaN(strike) || (strike >= 0 && strike <= 90);
    let dipValidator = dip >= 0 && dip <= 90;
    if (
      strikeSenseValidator &&
      strikeValidator &&
      dipSenseValidator &&
      dipValidator
    ) {
      return {
        horizontal: { strikeSense: strikeSense, strike: strike },
        vertical: { dipSense: dipSense, dip: dip }
      };
    }
  }
  return false;
}

function DDValidator(dipDirection, dip) {
  let dipDirectionPattern = /^\d{1,3}$/;
  let dipPattern = /^\d{1,2}$/;
  //function test() {
  //  return true;
  //}
  //let dipDirectionPattern = { test: test };
  //let dipPattern = { test: test };
  if (dipDirectionPattern.test(dipDirection) && dipPattern.test(dip)) {
    let dd = parseFloat(dipDirection);
    let d = parseFloat(dip);
    let dipDirectionValidator = !Number.isNaN(dd) && (dd >= 0 && dd <= 360);
    let dipValidator = !Number.isNaN(d) && (d >= 0 && d <= 90);
    if (dipDirectionValidator && dipValidator) {
      return { horizontal: dd, vertical: d };
    }
  }
  return false;
}

export { AZValidator, QDValidator, DDValidator };
