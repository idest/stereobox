import React from 'react';
import Tooltip from '../shared/Tooltip';
import Reading from './Reading';
import Cell from './styled/Cell';
import Span from './styled/Span';

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
    const title = this.props.tooltip ? (
      <TitleSpan>
        <Tooltip width={128} space={8} text={this.props.tooltip.text}>
          {this.props.name}
        </Tooltip>
      </TitleSpan>
    ) : (
      <TitleSpan>{this.props.name}</TitleSpan>
    );
    return (
      <React.Fragment>
        <TitleCell>{title}</TitleCell>
        <Reading
          id={this.props.id}
          azimuth={this.props.azimuth}
          spanRef={this.firstInput}
          value={this.props.horizontal}
          dir="horizontal"
          onValueChange={this.onValueChange}
          color={this.props.horizontalColor}
          tabIndex={this.props.index * 2 + 1}
        />
        <Reading
          id={this.props.id}
          value={this.props.vertical}
          dir="vertical"
          onValueChange={this.onValueChange}
          color={this.props.verticalColor}
          tabIndex={this.props.index * 2 + 2}
        />
        {/*
        <div tabIndex={this.props.index * 3 + 3} onFocus={this.handleFocus} />
        */}
      </React.Fragment>
    );
  }
}

const TitleCell = Cell.extend`
  width: 60%;
  font-size: 0.9em;
`;
const TitleSpan = Span.extend`
  justify-content: left;
  padding-right: 0;
  padding-left: 0.8em;
`;

export default PlaneReading;
