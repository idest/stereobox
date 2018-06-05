import React from 'react';
import {
  tryConvert,
  toQDFromAZ,
  toDDFromAZ,
  toAZFromQD,
  toAZFromDD
} from '../../logic/transformations';
import { AZValidator, QDValidator, DDValidator } from '../../logic/validators';
import styled from 'styled-components';

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
    return (
      <ControlsTable>
        <PlaneReading
          index={0}
          horizontal={this.AZ.horizontal}
          vertical={this.AZ.vertical}
          name="Azimuth / Dip (RHR)"
          onPlaneChange={this.onAZChange}
        />
        <PlaneReading
          index={1}
          horizontal={this.QD.horizontal}
          vertical={this.QD.vertical}
          name="Strike / Dip"
          onPlaneChange={this.onQDChange}
        />
        <PlaneReading
          index={2}
          horizontal={this.DD.horizontal}
          vertical={this.DD.vertical}
          name="Dip Direction / Dip"
          onPlaneChange={this.onDDChange}
        />
      </ControlsTable>
    );
  }
}

class ControlsTable extends React.Component {
  render() {
    return (
      <Table>
        <Cell />
        <Cell>
          <Span>Horizontal</Span>
        </Cell>
        <Cell>
          <Span>Vertical</Span>
        </Cell>
        {this.props.children}
      </Table>
    );
  }
}

class PlaneReading extends React.Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.firstInput = React.createRef();
  }
  onValueChange(dir, value) {
    let horizontalReading = this.props.horizontal;
    let verticalReading = this.props.vertical;
    if (dir === 'horizontal') {
      horizontalReading = value;
    } else if (dir === 'vertical') {
      verticalReading = value;
    }
    this.props.onPlaneChange(horizontalReading, verticalReading);
  }
  handleFocus(e) {
    this.firstInput.current.focus();
  }
  render() {
    return (
      <React.Fragment>
        <Cell>
          <Span>{this.props.name}</Span>
        </Cell>
        <Reading
          spanRef={this.firstInput}
          tabIndex={this.props.index * 3 + 1}
          value={this.props.horizontal}
          dir="horizontal"
          onValueChange={this.onValueChange}
        />
        <Reading
          tabIndex={this.props.index * 3 + 2}
          value={this.props.vertical}
          dir="vertical"
          onValueChange={this.onValueChange}
        />
        <div tabIndex={this.props.index * 3 + 3} onFocus={this.handleFocus} />
      </React.Fragment>
    );
  }
}

class Reading extends React.Component {
  constructor(props) {
    super(props);
    this.turnEditableOn = this.turnEditableOn.bind(this);
    this.turnEditableOff = this.turnEditableOff.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = { isEditable: false };
  }
  turnEditableOn() {
    this.setState({ isEditable: true });
  }
  turnEditableOff() {
    this.setState({ isEditable: false });
  }
  handleFocus(e) {
    e.target.select();
  }
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.turnEditableOff();
    }
  }
  handleChange(e) {
    this.props.onValueChange(this.props.dir, e.target.value);
  }
  render() {
    const value = Number.isNaN(this.props.value) ? '' : this.props.value;
    const reading = this.state.isEditable ? (
      <Input
        autoFocus
        onFocus={this.handleFocus}
        onChange={this.handleChange}
        onBlur={this.turnEditableOff}
        onKeyPress={this.handleKeyPress}
        type="text"
        tabIndex={this.props.tabIndex}
        value={value}
      />
    ) : (
      <Span
        innerRef={this.props.spanRef}
        onClick={this.turnEditableOn}
        tabIndex={this.props.tabIndex}
        onFocus={this.turnEditableOn}
      >
        {value}
      </Span>
    );
    return <Cell>{reading}</Cell>;
  }
}
export default Readings;

const Table = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding-bottom: 20px;
  background-color: black;
`;

const Cell = styled.div`
  box-sizing: border-box;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
  list-style: none;
  border: solid 1px gray;
  background-color: black;
  color: white;
  text-align: center;
  width: 33.3%; /* 3 columns */
`;
const Span = styled.span`
  display: block;
  padding: 0.8em 1.2em;
  height: 100%;
`;

const Input = styled.input`
  text-align: center;
  box-sizing: border-box;
  font-size: 1em;
  border: 1px solid blue;
  width: 100%;
  height: 100%;
`;
