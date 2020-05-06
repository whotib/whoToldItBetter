import React, { Component } from 'react';
import { NavLink} from "react-router-dom";


class Landing extends Component { 
render(){
  return(
    <header>
      <h1> Who told it better?</h1>
      <div className="breakLine"></div>
      <p>The movie or the book?</p>
      <NavLink to="/data">
        <button>continue</button>
      </NavLink>
      
    </header>
  )
}

}

export default Landing;