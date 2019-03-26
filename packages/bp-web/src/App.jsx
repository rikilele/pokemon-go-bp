import React from 'react';
import {
  buildCPMTable,
  calcBP,
  fetchBaseStats,
  CP_MAX_GREAT,
  CP_MAX_ULTRA,
} from 'shared';

import baseStats from './stats.json';
import { Form } from './Form/Form';

export class App extends React.Component {

  static cpm = buildCPMTable();

  constructor(props) {
    super(props);
    this.state = { bp: null };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(params) {
    const {
      name,
      cp,
      pl,
      ivS,
      ivA,
      ivD,
    } = params;
    const {
      baseS,
      baseA,
      baseD,
    } = baseStats[name];
    const bp = calcBP(baseS, baseA, baseD, parseInt(ivS, 10), parseInt(ivA, 10), parseInt(ivD, 10), App.cpm[parseInt(pl, 10)], CP_MAX_GREAT);
    this.setState({bp});
  }

  render() {
    return (
      <div>
        <h1>Pokemon GO BP</h1>
        <Form
          names={Object.keys(baseStats)}
          onSubmit={this.handleSubmit}
        />
        <button> {this.state.bp} </button>
      </div>
    );
  }
}
