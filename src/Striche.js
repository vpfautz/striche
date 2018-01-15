import lineIntersect from 'line-intersect';
import React, {Component} from 'react';

const HORIZONTAL_PAD = 50;

class Striche extends Component {
  constructor() {
    super();
    this.state = {
      dragstart: null,
      dragcurr: null,
    }
  }

  componentDidMount() {
    this.paint();
  }

  paint() {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);

    ctx.beginPath();
    for (let i = 0; i < this.props.num; i++) {
      ctx.moveTo(HORIZONTAL_PAD + 2 + i * 15, 40);
      ctx.lineTo(HORIZONTAL_PAD + 12 + i * 15, 10);

      if (this.props.crossed.indexOf(i) !== -1) {
        ctx.moveTo(HORIZONTAL_PAD + 2 + i * 15 - 2, 25);
        ctx.lineTo(HORIZONTAL_PAD + 2 + i * 15 + 13, 25);
      }
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#444';
    ctx.stroke();
    ctx.closePath();

    if (this.state.dragstart && this.state.dragcurr) {
      ctx.beginPath();
      ctx.moveTo(this.state.dragstart.x, this.state.dragstart.y);
      ctx.lineTo(this.state.dragcurr.x, this.state.dragcurr.y);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#bbb';
      ctx.stroke();
      ctx.closePath();
    }
  }

  componentDidUpdate() {
    this.paint();
  }

  onMouseDown(e) {
    if(this.props.dragEnabled) {
      this.refs.canvas.onmousemove = this.onMouseMove.bind(this);
    }
    this.setState({
      dragstart: null,
      dragcurr: null,
    });
  }

  onMouseUp(e) {
    let a = this.props.num + 1;
    let b = -1;
    if (this.state.dragstart && this.state.dragcurr) {
      for (let i = 0; i < this.props.num; i++) {
        let line1 = {start: this.state.dragstart, end: this.state.dragcurr};
        let line2 = {
          start: {x: HORIZONTAL_PAD + 2 + i * 15, y: 40},
          end: {x: HORIZONTAL_PAD + 12 + i * 15, y: 10}
        };
        var result = lineIntersect.checkIntersection(
            line1.start.x, line1.start.y, line1.end.x, line1.end.y,
            line2.start.x, line2.start.y, line2.end.x, line2.end.y);

        if (result.type === 'intersecting') {
          a = Math.min(a, i);
          b = Math.max(b, i);
        }
      }
    }

    this.refs.canvas.onmousemove = null;
    this.setState({
      dragstart: null,
      dragcurr: null,
    });
    if (this.props.onCross && b !== -1) {
      this.props.onCross(a, b)
    }
  }

  onMouseMove(e) {
    if (this.state.dragstart === null) {
      this.setState({
        dragstart: {x: e.offsetX, y: e.offsetY},
        dragcurr: {x: e.offsetX, y: e.offsetY},
      });
    } else {
      this.setState({
        dragcurr: {x: e.offsetX, y: e.offsetY},
      });
    }
  }

  render() {
    return (
      <div>
      <canvas
        ref = 'canvas'
        width = {HORIZONTAL_PAD * 2 + this.props.num * 15}
        height = {50}
        onMouseDown = {this.onMouseDown.bind(this)}
        onMouseUp = {this.onMouseUp.bind(this)} />
    </div>);
  }
}

export default Striche;