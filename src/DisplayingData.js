import React, { Component } from 'react';
import axios from 'axios';



class DisplayingData extends Component {

  constructor() {
    super();
    this.state = {
      anArray: [],
      userInput: "",
    }
  }

  // axios call to TMDB
  axiosCall = (userQuery) => {
    axios({
      url: `https://api.themoviedb.org/3/search/movie`,
      method: `GET`,
      responseType: `json`,
      params: {
        api_key: `4f70306aa4e939e1535c12686b6403c7`,
        query: userQuery
      }
    }).then((response) => {
      console.log(response)
    })
  }

  // for when form submits, pass userInput through to axios
  handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(this.state.userInput)
    if (this.state.userInput !== '') {
      this.axiosCall(this.state.userInput)
    }
  }

  // Grabs user input, which is then used by handleFormSubmit
  handleFormChange = (event) => {
    this.setState({
      userInput: event.target.value
    })
  }


  render() {
    return (
      <div className="App">
        <h1>Who Told It Better</h1>
        <form onSubmit={this.handleFormSubmit}>
          <input
            type="text"
            value={this.state.userInput}
            onChange={this.handleFormChange}
            placeholder="Search"
          />
          <button type="submit" aria-label="Search"> Search </button>
        </form>
      </div>
    );
  }
}

export default DisplayingData;
