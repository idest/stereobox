import React from 'react';
import Tooltip from '../Gui/Tooltip';
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
          tabIndex={this.props.index * 3 + 1}
          value={this.props.horizontal}
          dir="horizontal"
          onValueChange={this.onValueChange}
          color={this.props.horizontalColor}
        />
        <Reading
          id={this.props.id}
          tabIndex={this.props.index * 3 + 2}
          value={this.props.vertical}
          dir="vertical"
          onValueChange={this.onValueChange}
          color={this.props.verticalColor}
        />
        <div tabIndex={this.props.index * 3 + 3} onFocus={this.handleFocus} />
      </React.Fragment>
    );
  }
}

const TitleCell = Cell.extend`
  width: 55%;
  font-size: 0.8em;
`;
const TitleSpan = Span.extend`
  justify-content: left;
  padding-right: 0;
`;

export default PlaneReading;
