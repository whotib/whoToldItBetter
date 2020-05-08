import React, { Component } from 'react';
import { NavLink} from "react-router-dom";


class Landing extends Component { 
render(){
  return(
    <header>
      <div className="hContainer 
      wrapper">
        <h1> Who told it better?</h1>
        <div className="lineWSubtitle">
          <div className="breakLine"></div>
          <p>The movie or the book?</p>
        </div>
        <NavLink to="/data" className="hButton">
          <button className="landingButton">continue</button>
        </NavLink>
      </div>
    </header>
  )
}

}

export default Landing;