import React, { Component } from 'react';
import CircleTicks from './shared/CircleTicks';
import NeedleLogic from './shared/NeedleLogic';
import Needle from './shared/Needle';
import CompassCardinalPoints from './CompassCardinalPoints';
import styled, { withTheme } from 'styled-components';

class Compass extends Component {
  constructor(props) {
    super(props);
    this.preventSVGDrag = this.preventSVGDrag.bind(this);
  }
  preventSVGDrag(e) {
    e.preventDefault();
  }
  render() {
    const { radius: r, azimuth } = this.props;
    return (
      <Svg viewBox="0 0 100 100" onDragStart={this.preventSVGDrag}>
        <g id="compassGroup" transform="translate(50,50)">
          <CompassCircle cx="0" cy="0" r={r} />
          <StyledCircleTicks
            step={Math.PI / 6}
            length={4}
            radius={r}
            rotation={-90}
            label={step => ((180 * step) / Math.PI).toFixed(0)}
          />
          <StyledCircleTicks step={Math.PI / 18} length={2} radius={r} />
          <StyledCardinalPoints
            labels={['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']}
            fontSizes={[12, 6]}
            radius={0.65 * r}
          />
          <NeedleLogic
            onNeedleDrag={this.props.onNeedleDrag}
            onNeedleBackgroundClick={this.props.onNeedleBackgroundClick}
            needleCenterInSVGCoords={{ x: 50, y: 50 }}
            path={`M0,0 m ${r + 8},0
              a1,1 0 0 0 ${-2 * (r + 8)},0
              a1,1 0 0 0 ${2 * (r + 8)},0`}
          >
            <Needle
              id="azimuthExt"
              color={this.props.theme.azExtColor}
              angle={(Math.PI * azimuth) / 180 + Math.PI / 2}
              length={r}
            />
            <Needle
              id="azimuth"
              color={this.props.theme.azColor}
              angle={(Math.PI * azimuth) / 180 - Math.PI / 2}
              length={r}
            />
            <Needle
              id="dipDirection"
              color={this.props.theme.dipDirectionColor}
              angle={(Math.PI * azimuth) / 180}
              length={r * 0.5}
            />
          </NeedleLogic>
          <CenterCircle strokeWidth="0.75" r="1.2" cx="0" cy="0" />
        </g>
      </Svg>
    );
  }
}

const Svg = styled.svg`
  width: 100%;
  height: 100%;
`;
const CompassCircle = styled.circle`
  stroke: ${props => props.theme.fgColorD20};
  fill: transparent;
`;

const StyledCircleTicks = styled(CircleTicks)`
  stroke: ${props => props.theme.fgColorD20};
  fill: ${props => props.theme.fgColorD20};
`;

const StyledCardinalPoints = styled(CompassCardinalPoints)`
  stroke: ${props => props.theme.fgColorD20};
  fill: ${props => props.theme.fgColorD20};
`;

const CenterCircle = styled.circle`
  stroke: ${props => props.theme.bgColorD2};
  fill: ${props => props.theme.fgColorD20};
`;

export default withTheme(Compass);
