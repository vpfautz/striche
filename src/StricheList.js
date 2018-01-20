import React, { Component } from 'react';
import './StricheList.css';
import Striche from "./Striche";
import {get} from "./solve";
import {Button} from "reactstrap";


class StricheList extends Component {
  constructor() {
    super();
    this.state = {
      config: this.getNewConfig(),
      info: "",
      dragEnabled: true,
    };
  }

  handleCross(row, a, b) {
    if(this.addCross(row, a, b)) {
      this.setState({dragEnabled: false});
      setTimeout(this.ai.bind(this), 100);
    }
  }

  addCross(row, a, b) {
    let newConfig = JSON.parse(JSON.stringify(this.state.config))
    for(let i=a;i<=b;i++) {
      if(newConfig[row].crossed.indexOf(i) !== -1) {
        this.setState({info: "Illegal move!"});
        setTimeout(() => {
          this.setState({info: ""});
        }, 2000);
        return false;
      }
      newConfig[row].crossed.push(i);
    }

    this.setState({
      config: newConfig,
      info: "",
    });

    return true;
  }

  ai() {
    let config = [];
    let back_index = [];
    for(let row in this.state.config) {
      let {num,crossed} = this.state.config[row];
      let curr=null;
      for(let i=0;i<num;i++){
        if(crossed.indexOf(i) === -1 && curr === null) {
          curr = i;
        } else if(crossed.indexOf(i) !== -1 && curr != null){
          config.push(i-curr);
          back_index.push({row, offset: curr});
          curr = null;
        }
      }
      if(curr != null){
        config.push(num-curr);
        back_index.push({row, offset: curr});
      }
    }

    if(config.length === 0) {
      console.log("You lost!");
      this.setState({info: "You lost!"});
      return;
    }

    let result = get(config);
    if(!result) {
      console.log("I lost :(");
      this.setState({info: "You won!"});
      return
    } else {
      for(let i in config) {
        if(config[i] === result.prev) {
          let {row, offset} = back_index[i];
          this.addCross(row, offset + result.a, offset + result.b);
          break;
        }
      }
      this.setState({ dragEnabled: true });
    }
  }

  handleRestart() {
    this.setState({
      config: this.getNewConfig(),
      info: "",
      dragEnabled: true,
    });
  }

  handleReplay() {
    this.setState({
      config: this.state.config.map(c => {return {num:c.num, crossed: []}}),
      info: "",
      dragEnabled: true,
    });
  }

  getNewConfig() {
    let n = Math.round(Math.random() * 4 + 2);
    let config = [];
    for(let i=0;i<n;i++){
      config.push({
        num: Math.round(Math.random() * 8 + 1),
        crossed: [],
      });
    }

    return config;
  }

  render() {
    let list = this.state.config.map((x,row) =>
      <Striche
        key={row}
        num={x.num}
        crossed={x.crossed}
        onCross={(a,b) => this.handleCross(row, a, b)}
        dragEnabled={this.state.dragEnabled} />
    );
    let info = this.state.info ? <div>{this.state.info}</div> : "";
    return (
      <div className="StricheList">
        <div className="elements">
          {list}
        </div>
        {info}
        <Button color="primary" className="margin" onClick={this.handleRestart.bind(this)}>restart</Button>
        {" "}
        <Button color="primary" className="margin" onClick={this.handleReplay.bind(this)}>replay</Button>
      </div>
    );
  }
}

export default StricheList;
