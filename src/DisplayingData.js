import React, { Component } from 'react';
import axios from 'axios';
import Qs from "qs";
import convert from 'xml-js'


class DisplayingData extends Component {
  constructor() {
    super();
    this.state = {
      Array: [],
      userInput: "",
      selected: "movie",
      movieArray: [],
      selectedMovieInfo: {},
      bookArray: [],
      bookInfo: ''
    };
  }

  // axios call to TMDB
  movieCall = (userQuery) => {
    axios({
      url: `https://api.themoviedb.org/3/search/movie`,
      method: `GET`,
      responseType: `json`,
      params: {
        api_key: `4f70306aa4e939e1535c12686b6403c7`,
        query: userQuery,
      },
    }).then((response) => {
      this.setState({
        movieArray: response.data.results,
      });
    });
  };

  movieCallTwo = (id) => {
    axios({
      url: `https://api.themoviedb.org/3/movie/${id}`,
      method: `GET`,
      responseType: `json`,
      params: {
        api_key: `4f70306aa4e939e1535c12686b6403c7`,
      },
    }).then((response) => {
      this.setState({
        selectedMovieInfo: response.data,
      });
    });
  };

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
        // console.log(res)
        const toJson = JSON.parse(
          convert.xml2json(res.data, { compact: true, spaces: 4 })
        );
        // console.log(toJson.GoodreadsResponse)
        console.log(
          toJson.GoodreadsResponse.search.results.work[0].best_book.title
        );
        const booksResult = toJson.GoodreadsResponse.search.results.work;
        // console.log(booksResult);
        return this.setState({
          bookArray: booksResult,
        });
      })
      .catch((res) => {
        console.log("no book response");
      });
  };

  // for when form submits, pass userInput through to axios
  handleFormSubmit = (event) => {
    event.preventDefault();
    if (this.state.userInput !== "" && this.state.selected === "movie") {
      this.movieCall(this.state.userInput);
    } else if (this.state.userInput !== "" && this.state.selected === "book") {
      this.axiosBookCall(this.state.userInput);
    }
  };

  // Grabs user input, which is then used by handleFormSubmit
  handleFormChange = (event) => {
    this.setState({
      userInput: event.target.value,
    });
  };

  // Changes the state for the radio buttons in the form
  handleOptionChange = (changeEvent) => {
    this.setState({
      selected: changeEvent.target.value,
    });
  };

  handleTitleOption = (event) => {
    const selectedTitle = event.target.id;
    const selectedId = event.target.value;
    this.secondCall(selectedTitle, selectedId);
  };
  handleTitleBookOption =(event) => {
    this.setState({
      bookInfo: event.target.attributes[0].title
      // {title: event.target.attributes[0].data-title,
      // ratings: event.target.attributes[2].data-rating,
      // image: event.target.attributes[1].data-image
      // }
    },
    )
    // this.movieCall(event.target.id);
  }

  secondCall = (title, id) => {
    this.movieCallTwo(id);
    this.axiosBookCall(title);
  };

  render() {
    return (
      <div className="App">
        <h1>Who Told It Better</h1>
        <form onSubmit={this.handleFormSubmit}>
          <label htmlFor="movie">Movie</label>
          <input
            type="radio"
            checked={this.state.selected === "movie"}
            name="mediaChoice"
            value="movie"
            id="movie"
            className="radioButtons"
            onChange={this.handleOptionChange}
          />
          <label htmlFor="book">Book</label>
          <input
            type="radio"
            checked={this.state.selected === "book"}
            name="mediaChoice"
            value="book"
            id="book"
            className="radioButtons"
            onChange={this.handleOptionChange}
          />
          <input
            type="text"
            value={this.state.userInput}
            onChange={this.handleFormChange}
            placeholder="Search"
          />
          <button type="submit" aria-label="Search">
            {" "}
            Search{" "}
          </button>
        </form>

        {/* WORK IN PROGRESS */}
        <div>
          <ul>
            {this.state.selected === "movie" ? (
              <>
                {/* {this.state.movieArray.slice([0],[4])} */}
                {this.state.movieArray.slice([0], [5]).map((movie) => {
                  return (
                    <li
                      key={movie.id}
                      onClick={this.handleTitleOption}
                      id={movie.title}
                      value={movie.id}
                    >
                      {movie.title}
                    </li>
                  );
                })}
                ;
                {this.state.bookArray.slice([0], [5]).map((book) => {
                  return (
                    <li key={book.id._text}>
                      <button
                        onClick={this.handleTitleBookOption}
                        datatitle={book.best_book.title._text}
                        data-value={book.best_book.title.text}
                        data-image={book.best_book.image_url._text}
                        data-rating={book.average_rating._text}
                      >
                        {book.best_book.title._text}
                      </button>
                    </li>
                  );
                })}
              </>
            ) : (
              <>
                {this.state.bookArray.slice([0], [5]).map((book) => {
                  return (
                    <li key={book.id._text}>
                      <button
                        onClick={this.handleTitleBookOption}
                        datatitle={book.best_book.title._text}
                        data-value={book.best_book.title.text}
                        data-image={book.best_book.image_url._text}
                        data-rating={book.average_rating._text}
                      >
                        {book.best_book.title._text}
                      </button>
                    </li>
                  );
                })}
                {this.state.movieArray.slice([0], [5]).map((movie) => {
                  return (
                    <li
                      key={movie.id}
                      onClick={this.handleTitleOption}
                      id={movie.title}
                      value={movie.id}
                    >
                      {movie.title}
                    </li>
                  );
                })}
                ;
              </>
            )}
          </ul>
        </div>

        <ul>
          <li>
            <h2>{this.state.selectedMovieInfo.title}</h2>
            <div>
              <img
                src={`http://image.tmdb.org/t/p/w500/${this.state.selectedMovieInfo.poster_path}`}
                alt={`Movie Poster of ${this.state.selectedMovieInfo.title}`}
              />
            </div>
            <p>Winner?</p>
          </li>

          <li>
              <h2>{this.state.bookInfo}</h2>
            <div>
              {/* <img
                src={this.state.bookArray.best_book.image_url._text}
                alt={`Book cover for ${this.state.bookArray.best_book.title._text}`} */}
              {/* /> */}
            </div>
            <p>Loser?</p>
          </li>
        </ul>
        {/* WORK IN PROGRESS */}
      </div>
    );
  }
}

export default DisplayingData;

