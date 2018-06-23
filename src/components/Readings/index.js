import React from 'react';
import styled, { withTheme } from 'styled-components';
import {
  tryConvert,
  toQDFromAZ,
  toDDFromAZ,
  toAZFromQD,
  toAZFromDD
} from '../../logic/transformations';
import { AZValidator, QDValidator, DDValidator } from '../../logic/validators';
import PlaneReading from './PlaneReading';

class Readings extends React.Component {
  constructor(props) {
    super(props);
    this.onAZChange = this.onAZChange.bind(this);
    this.onQDChange = this.onQDChange.bind(this);
    this.onDDChange = this.onDDChange.bind(this);
    this.AZ = { horizontal: props.azimuth, vertical: props.dip };
    this.QD = tryConvert(
      this.props.azimuth,
      this.props.dip,
      AZValidator,
      toQDFromAZ
    );
    this.DD = tryConvert(
      this.props.azimuth,
      this.props.dip,
      AZValidator,
      toDDFromAZ
    );
  }
  onPlaneChange(
    horizontalReading,
    verticalReading,
    validatorFunction,
    convertFunction,
    source
  ) {
    const convertedValues = tryConvert(
      horizontalReading,
      verticalReading,
      validatorFunction,
      convertFunction
    );
    const azimuth = convertedValues.horizontal;
    const dip = convertedValues.vertical;
    this.props.changePlaneState({
      planeAzimuth: azimuth,
      planeDip: dip,
      lastInput: source
    });
  }
  onAZChange(horizontalReading, verticalReading) {
    this.AZ = { horizontal: horizontalReading, vertical: verticalReading };
    const validated = AZValidator(horizontalReading, verticalReading);
    if (validated) {
      horizontalReading = validated.horizontal;
      verticalReading = validated.vertical;
    } else {
      horizontalReading = NaN;
      verticalReading = NaN;
    }
    this.props.changePlaneState({
      planeAzimuth: horizontalReading,
      planeDip: verticalReading,
      lastInput: 'AZ'
    });
  }
  onQDChange(horizontalReading, verticalReading) {
    this.QD = { horizontal: horizontalReading, vertical: verticalReading };
    this.onPlaneChange(
      horizontalReading,
      verticalReading,
      QDValidator,
      toAZFromQD,
      'QD'
    );
  }
  onDDChange(horizontalReading, verticalReading) {
    this.DD = { horizontal: horizontalReading, vertical: verticalReading };
    this.onPlaneChange(
      horizontalReading,
      verticalReading,
      DDValidator,
      toAZFromDD,
      'DD'
    );
  }
  render() {
    if (this.props.lastInput !== 'QD') {
      this.QD = tryConvert(
        this.props.azimuth,
        this.props.dip,
        AZValidator,
        toQDFromAZ
      );
    }
    if (this.props.lastInput !== 'DD') {
      this.DD = tryConvert(
        this.props.azimuth,
        this.props.dip,
        AZValidator,
        toDDFromAZ
      );
    }
    if (this.props.lastInput !== 'AZ') {
      this.AZ = {
        horizontal: Math.round(this.props.azimuth),
        vertical: Math.round(this.props.dip)
      };
    }
    const verticalColor = this.props.theme.dipColorDe20;
    const horizontalColor = {};
    horizontalColor.AZ = this.props.theme.azColorDe20;
    horizontalColor.DD = this.props.theme.dipDirectionColorDe20;
    horizontalColor.QD =
      this.props.azimuth > 90 && this.props.azimuth < 270
        ? this.props.theme.azExtColorDe20
        : this.props.theme.azColorDe20;
    return (
      <Table className={this.props.className}>
        <PlaneReading
          id="AZ"
          index={0}
          horizontal={this.AZ.horizontal}
          vertical={this.AZ.vertical}
          horizontalColor={horizontalColor.AZ}
          verticalColor={verticalColor}
          name="Azimuth / Dip *"
          onPlaneChange={this.onAZChange}
          tooltip={{
            text: 'According to the right hand rule.'
          }}
        />
        <PlaneReading
          id="DD"
          index={1}
          horizontal={this.DD.horizontal}
          vertical={this.DD.vertical}
          horizontalColor={horizontalColor.DD}
          verticalColor={verticalColor}
          name="Dip Direction / Dip"
          onPlaneChange={this.onDDChange}
        />
        <PlaneReading
          id="QD"
          index={2}
          horizontal={this.QD.horizontal}
          vertical={this.QD.vertical}
          horizontalColor={horizontalColor.QD}
          verticalColor={verticalColor}
          name="Strike / Dip"
          onPlaneChange={this.onQDChange}
        />
      </Table>
    );
  }
}

const Table = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  background-color: ${props => props.theme.bgColor};
  /*border: solid 0.5px ${props => props.theme.bgColorL40};*/
  font-size: 0.9em;
`;

export default withTheme(Readings);
