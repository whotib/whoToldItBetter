import React, { Component } from 'react';
import axios from 'axios';
import Qs from "qs";
import convert from 'xml-js'

// var xml =
//   '<?xml version="1.0" encoding="utf-8"?>' +
//   '<note importance="high" logged="true">' +
//   "    <title>Happy</title>" +
//   "    <todo>Work</todo>" +
//   "    <todo>Play</todo>" +
//   "</note>";
// var result1 = convert.xml2json(xml, { compact: true, spaces: 4 });
// var result2 = convert.xml2json(xml, { compact: false, spaces: 4 });
// console.log(result1, "\n", result2);

class DisplayingData extends Component {

  constructor() {
    super();
    this.state = {
      anArray: [],
      userInput: "",
      movieInfo: [],
      bookInfo: []
    }
  }

  // axios call to TMDB
  axiosMovieCall = (userQuery) => {
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
      this.setState({
        movieInfo: response.data.results
      })
    })
  }

  // axios call to Goodreads
  axiosBookCall = (userQ) => {
    axios({
      method: "GET",
      url: "http://proxy.hackeryou.com",
      dataType: "json",
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: "brackets" });
      },
      params: {
        reqUrl: `https://www.goodreads.com/search.xml`,
        params: {
          key: `PPD00ZRT7jL7X8jXfJmmQ`,
          q: userQ,
        },
      },
      xmlToJSON: true,
    })
      .then((res) => {
        const toJson = JSON.parse(convert.xml2json(res.data, {compact: true,spaces: 4,}));
        // console.log(toJson.GoodreadsResponse.search.results.work[0].best_book.title)
        const booksResult = toJson.GoodreadsResponse.search.results.work;

        booksResult.map((book)=>{
          // console.log(book)
          console.log("title",book.best_book.title._text)
          console.log("image",book.best_book.image_url._text);
          console.log("publication year", book.original_publication_year._text)
          console.log("rating", book.average_rating._text)
        })

      })
      .catch((res) => {
        console.log(res);
      });
  }

  // for when form submits, pass userInput through to axios
  handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(this.state.userInput)
    if (this.state.userInput !== '') {
      this.axiosMovieCall(this.state.userInput)
      this.axiosBookCall(this.state.userInput)
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

