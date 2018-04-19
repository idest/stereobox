import { AZValidator } from '../logic/validators';

const clino = (width, height, props) => {
  // Sketch scope
  return function(p5) {
    //Variables scoped within p5
    let az;
    let dip;
    let newDip;
    let dipNeedleAngle;
    //let cardinalLabels;
    let changePlaneState = props.changePlaneState;

    // Make library globally available
    window.p5 = p5;

    // Setup function
    // ==============
    p5.setup = () => {
      p5.angleMode(p5.DEGREES);
      p5.rectMode(p5.CENTER);
      az = props.azimuth;
      dip = props.dip;
      newDip = props.dip;
      dipNeedleAngle = getDipNeedleAngle(az, dip);
    };

    p5.receiveProps = nextProps => {
      dipNeedleAngle = dipNeedleAngle || 0;
      newDip = nextProps.dip;
      az = nextProps.azimuth;
    };

    p5.draw = () => {
      p5.background(props.background || 0);

      // Clinometer size
      let clinoX = width / 2;
      let minAxis = height > width ? width : height;
      let diameterToMinAxisRatio = 0.8;
      let compassMinAxisToClinoMinAxisRatio = minAxis === width ? 1 : 3 / 2;
      let clinoD =
        minAxis * compassMinAxisToClinoMinAxisRatio * diameterToMinAxisRatio;
      let clinoY = (height - clinoD / 2) / 2;

      // Coordinate system
      let mx = p5.map(p5.mouseX, 0, width, -clinoX, width - clinoX);
      let my = p5.map(p5.mouseY, 0, height, -clinoY, height - clinoY);
      let md = p5.dist(clinoX, clinoY, p5.mouseX, p5.mouseY);

      // State change logic
      let mouseIsInsideClino =
        md < clinoD / 2 + clinoD * 0.2 && my > 0 ? true : false;
      if (p5.mouseIsPressed && mouseIsInsideClino) {
        let mouseAngle = getMouseAngle(mx, my);
        let newPlane = getPlaneFromDipNeedleAngle(az, mouseAngle);
        changePlaneState({
          planeAzimuth: newPlane.az,
          planeDip: newPlane.dip,
          lastInput: 'SK'
        });
      }

      // Draw clino
      drawClino(clinoX, clinoY, clinoD, newDip);

      // Development guides
      //let x1 = (width - clinoD) / 2;
      //p5.stroke(255, 0, 0);
      //p5.line(x1, 0, x1, height);
      //p5.line(width - x1, 0, width - x1, height);
      //p5.strokeWeight(0.5);
      //p5.stroke(255);
      //p5.fill(255);
      //p5.text(mx, 30, 50);
      //p5.text(my, 30, 70);
      //p5.text(mouseIsInsideClino, 30, 90);
    };

    const drawClino = (cx, cy, cd, newDip) => {
      let cr = cd / 2;
      // Smooth needle transition
      let newDipNeedleAngle = getDipNeedleAngle(az, newDip);
      dipNeedleAngle = 0.93 * dipNeedleAngle + 0.07 * newDipNeedleAngle;
      // ...
      // Clino coordinates
      p5.push();
      p5.translate(cx, cy);
      let angleToX = a => cr * p5.cos(a);
      let angleToY = a => cr * p5.sin(a);
      // Clino Border
      p5.strokeWeight(2);
      p5.stroke(props.mainColor || 255);
      p5.noFill();
      p5.arc(0, 0, cd, cd, 0, 180, p5.CHORD);
      // Ticks and Labels
      p5.textAlign(p5.CENTER);
      let ticksNumber = 12;
      for (let i = 0; i <= ticksNumber; i++) {
        let tickFraction = 180 / ticksNumber;
        let tickAngle = tickFraction * i;
        // Ticks
        p5.strokeWeight(1);
        let tickX = angleToX(tickAngle);
        let tickY = angleToY(tickAngle);
        p5.line(0.9 * tickX, 0.9 * tickY, tickX, tickY);
        // Labels
        p5.strokeWeight(0.25);
        p5.fill(255);
        p5.textSize(cr * 0.125);
        let tickString =
          tickAngle > 90 ? (180 - tickAngle).toFixed(0) : tickAngle.toFixed(0);
        let rotationAngle = tickAngle - 90;
        p5.push();
        p5.rotate(rotationAngle);
        p5.text(tickString, 0, cr + cr * 0.175);
        p5.pop();
      }
      // Caridnal Labels
      let cardinalSize = cr * 0.3 * 0.5;
      p5.textSize(cardinalSize);
      let cardinalLabels = getCardinalLabels(az, newDip);
      p5.text(cardinalLabels.left, -cr + cr * 0.15, -cr * 0.1);
      p5.text(cardinalLabels.right, cr - cr * 0.15, -cr * 0.1);
      // Needles
      p5.strokeWeight(3);
      // Dip Needle
      p5.stroke(200, 200, 100);
      p5.line(0, 0, angleToX(dipNeedleAngle), angleToY(dipNeedleAngle));
      // Visual Aids
      const firstArcAngle = dipNeedleAngle > 90 ? dipNeedleAngle : 0;
      const secondArcAngle = dipNeedleAngle > 90 ? 180 : dipNeedleAngle;
      p5.noFill();
      p5.arc(0, 0, cd, cd, firstArcAngle, secondArcAngle, p5.OPEN);
      p5.stroke(100, 200, 100);
      p5.line(0, 0, cr * Math.sign(angleToX(dipNeedleAngle)), 0);
      p5.pop();
    };

    const getCardinalLabels = (az, dip) => {
      if (AZValidator(az, dip)) {
        let azimuth = Math.round(az);
        let rightCardinal;
        let leftCardinal;
        if (azimuth === 0 || azimuth === 180 || azimuth === 360) {
          rightCardinal = 'E';
          leftCardinal = 'W';
        } else if (azimuth === 90 || azimuth === 270) {
          rightCardinal = 'N';
          leftCardinal = 'S';
        } else if (
          (azimuth > 0 && azimuth < 90) ||
          (azimuth > 180 && azimuth < 270)
        ) {
          rightCardinal = 'SE';
          leftCardinal = 'NW';
        } else if (
          (azimuth > 90 && azimuth < 180) ||
          (azimuth > 270 && azimuth < 360)
        ) {
          rightCardinal = 'NE';
          leftCardinal = 'SW';
        } else {
          rightCardinal = '';
          leftCardinal = '';
        }
        return { right: rightCardinal, left: leftCardinal };
      } else {
        return { right: '', left: '' };
      }
    };

    const getDipNeedleAngle = (az, dip) => {
      let dipNeedleAngle;
      if (AZValidator(az, dip)) {
        let azimuth = Math.round(az);
        dipNeedleAngle = azimuth >= 90 && azimuth < 270 ? 180 - dip : dip;
      } else {
        dipNeedleAngle = NaN;
      }
      return dipNeedleAngle;
    };

    const getMouseAngle = (xMouse, yMouse) => {
      let tan = yMouse / xMouse || 0;
      let mouseAngle = p5.atan(tan);
      if (xMouse < 0) {
        mouseAngle = 180 + mouseAngle;
      }
      return mouseAngle;
    };

    const getPlaneFromDipNeedleAngle = (az, dipNeedleAngle) => {
      let newAz;
      let newDip;
      if (dipNeedleAngle > 90) {
        newAz = az >= 90 && az < 270 ? az : az + 180;
        newAz = newAz > 360 ? newAz - 360 : newAz;
        newDip = 180 - dipNeedleAngle;
      } else {
        newAz = az >= 90 && az < 270 ? az + 180 : az;
        newAz = newAz > 360 ? newAz - 360 : newAz;
        newDip = dipNeedleAngle;
      }
      return { az: newAz, dip: newDip };
    };
  };
};
export default clino;
