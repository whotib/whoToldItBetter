import React, { Component } from 'react';
import './App.scss';
import Header from './Landing'
import DisplayingData from './DisplayingData'


class App extends Component {


  render(){
    return (
      <div className="App">
        <Header/>
        <DisplayingData/>
      </div>
    );
  }
}

export default App;
