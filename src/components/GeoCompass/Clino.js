import React, { Component } from 'react';
import CircleTicks from './shared/CircleTicks';
import NeedleLogic from './shared/NeedleLogic';
import Needle from './shared/Needle';
import ClinoCardinalTags from './ClinoCardinalTags';
import styled, { withTheme } from 'styled-components';

class Clino extends Component {
  constructor(props) {
    super(props);
    this.preventSVGDrag = this.preventSVGDrag.bind(this);
    this.viewBoxHeight = this.props.clinoToCompassRatio * 100;
    this.clinoDY = (this.viewBoxHeight - this.props.radius) / 2;
  }
  preventSVGDrag(e) {
    e.preventDefault();
  }
  render() {
    const { radius: r, azimuth, dipNeedleAngle } = this.props;
    const centerColor =
      azimuth >= 90 && azimuth < 270
        ? this.props.theme.azColor
        : this.props.theme.azExtColor;
    return (
      <Svg
        viewBox={`0 0 100 ${this.viewBoxHeight}`}
        onDragStart={this.preventSVGDrag}
        style={{ width: '100%', height: '100%' }}
      >
        <g id="clinoGroup" transform={`translate(50,${this.clinoDY})`}>
          <ClinoPath d="M0,0 m-40,0 a1,1 0 0 0 80,0 l-80,0" />
          <StyledCircleTicks
            step={Math.PI / 6}
            maxAngle={Math.PI}
            length={4}
            radius={r}
            label={step =>
              ((180 * Math.atan(Math.abs(Math.tan(step)))) / Math.PI).toFixed(0)
            }
          />
          <StyledCircleTicks
            step={Math.PI / 18}
            maxAngle={Math.PI}
            length={2}
            radius={r}
          />
          <StyledCardinalTags azimuth={azimuth} radius={r} />
          <NeedleLogic
            onNeedleDrag={this.props.onNeedleDrag}
            onNeedleBackgroundClick={this.props.onNeedleBackgroundClick}
            needleCenterInSVGCoords={{ x: 50, y: this.clinoDY }}
            path={`M0,0 l${r + 8},0 a1,1 0 0 1 ${-2 * (r + 8)},0 Z`}
          >
            <Needle
              id="dip"
              color={this.props.theme.dipColor}
              angle={(Math.PI * dipNeedleAngle) / 180}
              length={r}
            />
            <Needle
              id="dip"
              color={this.props.theme.dipDirectionColor}
              angle={dipNeedleAngle > 90 ? Math.PI : dipNeedleAngle * 0}
              length={0.5 * r}
            />
          </NeedleLogic>
          <circle
            stroke={this.props.theme.bgColorD2}
            fill={centerColor}
            strokeWidth="0.75"
            r="1.2"
            cx="0"
            cy="0"
          />
        </g>
      </Svg>
    );
  }
}
const Svg = styled.svg`
  width: 100%;
  height: 100%;
`;

const ClinoPath = styled.path`
  stroke: ${props => props.theme.fgColorD20};
  fill: transparent;
`;

const StyledCircleTicks = styled(CircleTicks)`
  stroke: ${props => props.theme.fgColorD20};
  fill: ${props => props.theme.fgColorD20};
`;

const StyledCardinalTags = styled(ClinoCardinalTags)`
  stroke: ${props => props.theme.fgColorD20};
  fill: ${props => props.theme.fgColorD20};
`;

export default withTheme(Clino);
