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
      bookInfo: {},
      movieInfo: {}
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
      console.log(response.data.results)
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
      url: "https://proxy.hackeryou.com",
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
        const toJson = JSON.parse(
          convert.xml2json(res.data, { compact: true, spaces: 4 })
        );
        const booksResult = toJson.GoodreadsResponse.search.results.work;
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
    if (this.state.userInput !== "") {
      this.movieCall(this.state.userInput);
      this.axiosBookCall(this.state.userInput);
    } else {
      console.log('This didnt work')
    }
  };

  // Grabs user input, which is then used by handleFormSubmit
  handleFormChange = (event) => {
    this.setState({
      userInput: event.target.value,
    });
  };

  handleTitleOption = (event) => {
    console.log(event.target.attributes)
    this.setState({
      movieInfo: {
        title: event.target.attributes[0].value,
        id: event.target.attributes[1].value,
        image: event.target.attributes[2].value,
        rating: event.target.attributes[3].value
      }
    })
    const selectedTitle = event.target.attributes[0].value;
    const selectedId = event.target.value;
    this.secondCall(selectedTitle, selectedId);
  };

  handleTitleBookOption =(event) => {
    this.setState({
      bookInfo: {
        title: event.target.attributes[0].value,
        image: event.target.attributes[1].value, 
        rating: event.target.attributes[2].value
      }
    })
  }

  secondCall = (title, id) => {
    this.movieCallTwo(id);
  };

  render() {
    return (
         <main>
              <div className="mContainer">
                   <div className="mTitles">
                        <h1>Who Told It Better</h1>
                        <div className="breakLine"></div>
                   </div>

                   <p>
                        Please input your selected title. You'll be presented
                        with two lists. Please select the matching titles from
                        each lists.
                   </p>

                   <form onSubmit={this.handleFormSubmit}>
                        <input
                             type="text"
                             value={this.state.userInput}
                             onChange={this.handleFormChange}
                             placeholder="Title"
                        />
                        <button
                             type="submit"
                             aria-label="Search"
                             className="mButton"
                        >
                             Search
                        </button>
                   </form>

                   <ul className="movieUl">
                        <h3 id="movieList">Movie List</h3>
                        {this.state.movieArray.slice([0], [5]).map((movie) => {
                             return (
                                  <li key={movie.id} className="movieLi">
                                       <button
                                            onClick={this.handleTitleOption}
                                            value={movie.id}
                                            data-title={movie.title}
                                            data-id={movie.id}
                                            data-poster={movie.poster_path}
                                            data-rating={movie.vote_average}
                                            aria-labelledby="movieList"
                                       >
                                            {movie.title}
                                       </button>
                                  </li>
                             );
                        })}
                        ;
                   </ul>

                   <ul className="bookUl">
                        <h3 id="bookList">Book List</h3>
                        {this.state.bookArray.slice([0], [5]).map((book) => {
                             return (
                                  <li key={book.id._text} className="bookLi">
                                       <button
                                            onClick={this.handleTitleBookOption}
                                            data-title={
                                                 book.best_book.title._text
                                            }
                                            data-value={
                                                 book.best_book.title.text
                                            }
                                            data-image={
                                                 book.best_book.image_url._text
                                            }
                                            data-rating={
                                                 book.average_rating._text
                                            }
                                            aria-labelledby="bookList"
                                       >
                                            {book.best_book.title._text}
                                       </button>
                                  </li>
                             );
                        })}
                   </ul>

                   <div className="moviePoster">
                        <h2>{this.state.selectedMovieInfo.title}</h2>
                        <div className="imgContainer">
                             <img
                                  src={`http://image.tmdb.org/t/p/w500/${this.state.selectedMovieInfo.poster_path}`}
                                  alt={`Movie Poster of ${this.state.selectedMovieInfo.title}`}
                             />
                        </div>
                        <p>Rating: </p>
                   </div>

                   <div className="bookCover">
                        <h2>{this.state.bookInfo.title}</h2>
                        <div className="imgContainer">
                             <img
                                  src={this.state.bookInfo.image}
                                  alt={`Book cover for ${this.state.bookInfo.title}`}
                             />
                        </div>
                        <p>Rating: {this.state.bookInfo.rating}</p>
                   </div>
              </div>
         </main>
    );
  }
}

export default DisplayingData;

