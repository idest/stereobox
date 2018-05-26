const compass = (width, height, props) => {
  // Sketch scope
  return function(p5) {
    // Variables scoped within p5
    let az;
    let newAz;
    let changePlaneState = props.changePlaneState;
    //const modeCheckbox = document.getElementById('modeCheckbox');
    const modeCheckbox = { checked: false };

    // Make library globally available
    window.p5 = p5;

    // Setup function
    //===============
    p5.setup = () => {
      p5.angleMode(p5.DEGREES);
      p5.rectMode(p5.CENTER);
      az = props.azimuth;
      newAz = props.azimuth;
    };

    p5.receiveProps = nextProps => {
      az = az || 0;
      newAz = nextProps.azimuth;
    };

    p5.draw = () => {
      p5.background(props.background || 0);

      // Compass size
      let compassX = width / 2;
      let compassY = height / 2;
      let minAxis = height > width ? width : height;
      let diameterToMinAxisRatio = 0.8;
      let compassD = minAxis * diameterToMinAxisRatio;

      // Coordinate system
      let mx = p5.map(p5.mouseX, 0, width, -compassX, width - compassX);
      let my = -p5.map(p5.mouseY, 0, height, -compassY, height - compassY);
      let md = p5.dist(compassX, compassY, p5.mouseX, p5.mouseY);

      // State change logic
      let mouseIsInsideCompass =
        md < compassD / 2 + compassD * 0.2 ? true : false;
      if (p5.mouseIsPressed && mouseIsInsideCompass) {
        newAz = getMouseAngle(mx, my, modeCheckbox.checked);
        changePlaneState({ planeAzimuth: newAz, lastInput: 'SK' });
      }

      // Draw compass
      drawCompass(compassX, compassY, compassD, newAz, modeCheckbox.checked);

      // Development guides
      //let x1 = (width - compassD) / 2;
      //p5.stroke(255, 0, 0);
      //p5.line(x1, 0, x1, height);
      //p5.line(width - x1, 0, width - x1, height);
      //p5.stroke(255);
      //p5.fill(255);
      //let azString = az;
      //p5.text(azString, 30, 30);
      //p5.text(mx, 30, 50);
      //p5.text(my, 30, 70);
    };

    const drawCompass = (cx, cy, cd, newAz, reflectMode) => {
      let cr = cd / 2;
      // Smooth needle transition
      let azDiff = p5.abs(newAz - az);
      if (azDiff > 180) {
        if (newAz > az) {
          az = newAz + (360 - azDiff);
        } else {
          az = newAz - (360 - azDiff);
        }
      }
      az = 0.93 * az + 0.07 * newAz;
      az = az < 0 ? az + 360 : az;
      az = az > 360 ? az % 360 : az;
      // Compass Coordinates
      p5.push();
      p5.translate(cx, cy);
      let fixAngle = a => (reflectMode ? a + 90 : -a + 90);
      let angleToX = a => cr * p5.cos(fixAngle(a));
      let angleToY = a => -cr * p5.sin(fixAngle(a));
      // Compass Border
      p5.strokeWeight(2);
      p5.stroke(props.mainColor || 255);
      p5.noFill();
      p5.ellipse(0, 0, cd);
      // Ticks and Labels
      p5.textAlign(p5.CENTER);
      let ticksNumber = 24;
      for (let i = 0; i < ticksNumber; i++) {
        let tickFraction = 360 / ticksNumber;
        let tickAngle = reflectMode ? -tickFraction * i : tickFraction * i;
        // Ticks
        p5.strokeWeight(1);
        let tickX = angleToX(tickAngle);
        let tickY = angleToY(tickAngle);
        p5.line(0.9 * tickX, 0.9 * tickY, tickX, tickY);
        // Labels
        p5.strokeWeight(0.25);
        p5.fill(255);
        p5.textSize(cr * 0.125);
        let tickString = p5.abs(tickAngle.toFixed(0));
        if (tickAngle >= 90 && tickAngle <= 270) {
          p5.push();
          p5.rotate(tickAngle - 180);
          p5.text(tickString, 0, cr + cr * 0.175);
          p5.pop();
        } else {
          p5.push();
          p5.rotate(tickAngle);
          p5.text(tickString, 0, -cr - cr * 0.1);
          p5.pop();
        }
      }
      // Cardinal Labels
      let cardinalLabels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      let cardinalSizes = [1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5];
      for (let i = 0; i < cardinalLabels.length; i++) {
        p5.fill(255);
        let cardinalSize = cr * 0.3 * cardinalSizes[i];
        p5.textSize(cardinalSize);
        let cFraction = 360 / cardinalLabels.length;
        p5.textWidth(cardinalLabels[i]); //cardinalWidth
        let cardinalX1 = angleToX(cFraction * i) * 0.7;
        let cardinalY1 = angleToY(cFraction * i) * 0.7 + cardinalSize / 2.5;
        p5.text(cardinalLabels[i], cardinalX1, cardinalY1);
      }
      // Needles
      p5.strokeWeight(3);
      let azNeedleAngle = fixAngle(az);
      let ddNeedleAngle = fixAngle(az + 90);
      // Azimuth Needle
      p5.stroke(255, 125, 125);
      p5.line(0, 0, cr * p5.cos(azNeedleAngle), -cr * p5.sin(azNeedleAngle));
      // Azimuth Needle extension
      p5.stroke(125, 125, 255);
      p5.line(
        0,
        0,
        cr * p5.cos(azNeedleAngle + 180),
        -cr * p5.sin(azNeedleAngle + 180)
      );
      // Dip Direction Needle
      p5.stroke(175, 175, 175);
      p5.line(0, 0, cr * p5.cos(ddNeedleAngle), -cr * p5.sin(ddNeedleAngle));
      p5.pop();
    };

    const getMouseAngle = (xMouse, yMouse, reflectMode) => {
      // reflectMode ? xMouse = -xMouse : pass;
      if (reflectMode) {
        xMouse = -xMouse;
      }
      let tan = xMouse / yMouse || 0;
      let mouseAngle = p5.atan(tan);
      if (yMouse <= 0) {
        mouseAngle = mouseAngle + 180;
      } else if (xMouse < 0) {
        mouseAngle = mouseAngle + 360;
      }
      return mouseAngle;
    };
  };
};
export default compass;
