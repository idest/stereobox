import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

class Portal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }
  componentDidMount() {
    document.body.appendChild(this.el);
  }
  componentWillUnmount() {
    document.body.removeChild(this.el);
  }
  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.tooltipWidth = props.width || 256;
    this.tooltipSpace = props.space || 16;
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.el = React.createRef();
  }
  showTooltip() {
    const style = { width: this.tooltipWidth };
    const targetDimensions = this.el.current.getBoundingClientRect();
    style.left =
      targetDimensions.left +
      targetDimensions.width / 2 -
      this.tooltipWidth / 2;
    style.left = Math.max(style.left, this.tooltipSpace);
    style.left = Math.min(
      style.left,
      document.body.clientWidth - this.tooltipWidth - this.tooltipWidth
    );

    if (targetDimensions.top < window.innerHeight / 2) {
      style.top =
        targetDimensions.top + targetDimensions.height + this.tooltipSpace;
    } else {
      style.bottom =
        window.innerHeight - targetDimensions.top + this.tooltipSpace;
    }
    this.setState({ visible: true, style: style });
  }
  hideTooltip() {
    this.setState({ visible: false });
  }
  render() {
    return (
      <TargetSpan
        innerRef={this.el}
        onMouseOver={this.showTooltip}
        onMouseOut={this.hideTooltip}
      >
        {this.props.children}
        {this.state.visible && (
          <Portal>
            <TooltipDiv style={this.state.style}>{this.props.text}</TooltipDiv>
          </Portal>
        )}
      </TargetSpan>
    );
  }
}
const TargetSpan = styled.div`
  cursor: help;
`;

const TooltipDiv = styled.div`
  position: fixed;
  background: ${props => props.theme.bgColorL10};
  color: ${props => props.theme.fgColorD30};
  padding: 6px;
  text-align: center;
  font-size: 0.8em;
  border: 1px solid ${props => props.theme.fgColorD60}
  border-radius: 5px;
`;

export default Tooltip;
