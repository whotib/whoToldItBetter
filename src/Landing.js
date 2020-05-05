import React, { Component } from 'react';



class Header extends Component { 
render(){
  return(
    <header>
      <h1> Who told it better?</h1>
      <div className="breakLine"></div>
      <p>The movie or the book?</p>
      <button>continue</button>
    </header>
  )
}

}

export default Header;