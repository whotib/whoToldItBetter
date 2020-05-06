import React, { Component } from 'react';
import './App.scss';
import Landing from './Landing'
import DisplayingData from './DisplayingData'
import {BrowserRouter as Router, Route } from "react-router-dom";


class App extends Component {


  render(){
    return (
         <Router basename={process.env.PUBLIC_URL}>
              <div className="App">
                  {/* <Landing />   */}
                   {/* <DisplayingData /> */}
              <Route path="/data" component={DisplayingData} />
              <Route exact path="/" component={Landing} />
              </div>
         </Router>
    );
  }
}

export default App;
