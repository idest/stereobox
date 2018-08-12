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
import Header from '../styled/Header';
import WithDescription from '../shared/WithDescription';
import { HelpConsumer } from '../App.js';
import enMessages from '../../locales/readings/en/messages.json';
import esMessages from '../../locales/readings/es/messages.json';
import enHelp from '../../locales/readings/en/help.md';
import esHelp from '../../locales/readings/es/help.md';

const messages = {
  en: enMessages,
  es: esMessages
};

const help = {
  en: enHelp,
  es: esHelp
};

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
    const { locale } = this.props;
    return (
      <HelpConsumer>
        {showHelp => (
          <div>
            <Header showOrder={showHelp} order="B)">
              {messages[locale].title}
            </Header>
            <WithDescription text={help[locale]} show={showHelp}>
              <Table className={this.props.className}>
                <PlaneReading
                  id="AZ"
                  index={0}
                  horizontal={this.AZ.horizontal}
                  vertical={this.AZ.vertical}
                  horizontalColor={horizontalColor.AZ}
                  verticalColor={verticalColor}
                  name={messages[locale].azName}
                  onPlaneChange={this.onAZChange}
                  horizontalDigits="3"
                  verticalDigits="2"
                  tooltip={{
                    text: messages[locale].azTooltip
                  }}
                />
                <PlaneReading
                  id="QD"
                  index={1}
                  horizontal={this.QD.horizontal}
                  vertical={this.QD.vertical}
                  horizontalColor={horizontalColor.QD}
                  verticalColor={verticalColor}
                  name={messages[locale].qdName}
                  onPlaneChange={this.onQDChange}
                />
                <PlaneReading
                  id="DD"
                  index={2}
                  horizontal={this.DD.horizontal}
                  vertical={this.DD.vertical}
                  horizontalColor={horizontalColor.DD}
                  verticalColor={verticalColor}
                  name={messages[locale].ddName}
                  onPlaneChange={this.onDDChange}
                  horizontalDigits="3"
                  verticalDigits="2"
                />
              </Table>
            </WithDescription>
          </div>
        )}
      </HelpConsumer>
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
