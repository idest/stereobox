/*!
 * Project: react-p5-wrapper https://github.com/NeroCor/react-p5-wrapper
 * Copyright (c) 2016 Andreas Wolf
 * License (MIT) https://github.com/NeroCor/react-p5-wrapper/blob/master/LICENSE
 */

import React from 'react';
import p5 from 'p5';

export default class P5Wrapper extends React.Component {
  componentDidMount() {
    this.canvas = new p5(this.props.sketch, this.wrapper);
    if (this.canvas.myCustomRedrawAccordingToNewPropsHandler) {
      this.canvas.myCustomRedrawAccordingToNewPropsHandler(this.props);
    }
  }

  componentWillReceiveProps(newprops) {
    if (this.props.sketch !== newprops.sketch) {
      this.wrapper.removeChild(this.wrapper.childNodes[0]);
      this.canvas = new p5(newprops.sketch, this.wrapper);
    }
    if (this.canvas.myCustomRedrawAccordingToNewPropsHandler) {
      this.canvas.myCustomRedrawAccordingToNewPropsHandler(newprops);
    }
  }

  render() {
    return <div ref={wrapper => (this.wrapper = wrapper)} />;
  }
}
