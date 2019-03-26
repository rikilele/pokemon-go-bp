import React from 'react';

export class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'ブラッキー',
      cp: null,
      pl: null,
      ivS: null,
      ivA: null,
      ivD: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.state);
  }

  render() {
    console.log(this.props.names);
    return (
      <form onSubmit={this.handleSubmit}>
        {/*<SearchBar />*/}
        <div>
          <label htmlFor="pl">
            PL
          </label>
          <input
            id="pl"
            placeholder="1 ~ 40"
            onChange={e => this.setState({pl: e.target.value})}
          />
          OR
          <label htmlFor="cp">
            CP
          </label>
          <input
            id="cp"
            placeholder="10 ~"
            onChange={e => this.setState({cp: e.target.value})}
          />
        </div>
        <div>
          <label htmlFor="ivS">
            HP
          </label>
          <input
            id="ivS"
            placeholder="0 ~ 15"
            onChange={e => this.setState({ivS: e.target.value})}
          />
          <label htmlFor="ivA">
            こうげき
          </label>
          <input
            id="ivA"
            placeholder="0 ~ 15"
            onChange={e => this.setState({ivA: e.target.value})}
          />
          <label htmlFor="ivD">
            ぼうぎょ
          </label>
          <input
            id="ivD"
            placeholder="0 ~ 15"
            onChange={e => this.setState({ivD: e.target.value})}
          />
        </div>
        <button>
          計算する
        </button>
      </form>
    );
  }
}