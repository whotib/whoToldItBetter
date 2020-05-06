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
      bookInfo: []
      selected: "movie",
      movieArray: [],
      listSelectTitle: "",
      listSelectId: "",
      selectedMovieInfo: {}
    }
  }

  // axios call to TMDB
  movieCall = (userQuery) => {
    axios({
      url: `https://api.themoviedb.org/3/search/movie`,
      method: `GET`,
      responseType: `json`,
      params: {
        api_key: `4f70306aa4e939e1535c12686b6403c7`,
        query: userQuery
      }
    }).then((response) => {
      console.log(response.data.results)
      this.setState({
        movieArray: response.data.results
      })
    })
  }
  
  movieCallTwo = () => {
    console.log(this.state.listSelectId)
    axios({
      url: `https://api.themoviedb.org/3/movie/${this.state.listSelectId}`,
      method: `GET`,
      responseType: `json`,
      params: {
        api_key: `4f70306aa4e939e1535c12686b6403c7`,
      }
    }).then((response) => {
      console.log(response.data)
      this.setState({
        selectedMovieInfo: response.data
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
    if (this.state.userInput !== '' && this.state.selected === "movie") {
      this.movieCall(this.state.userInput)
    } else if (this.state.userInput !== '' && this.state.selected === "book") {
      //console.log("book API call!")
      this.axiosBookCall(this.state.userInput)
    }
  }


  // Grabs user input, which is then used by handleFormSubmit
  handleFormChange = (event) => {
    this.setState({
      userInput: event.target.value
    })
  }


  // Changes the state for the radio buttons in the form
  handleOptionChange = changeEvent => {
    this.setState({
      selected: changeEvent.target.value
    });
  };

  handleTitleOption = (event) => {
    console.log(event.target.value)
    const selectedTitle = event.target.id
    const selectedId = event.target.value
    console.log(event.target.id)
    this.setState({
      listSelectTitle: selectedTitle,
      listSelectId: selectedId
    }, this.movieCallTwo )
  
  }

  render() {
    return (
      <div className="App">
        <h1>Who Told It Better</h1>
        <form onSubmit={this.handleFormSubmit}>
          <label for="movie">Movie</label>
          <input
            type="radio"
            checked={this.state.selected === "movie"}
            name="mediaChoice"
            value="movie"
            id="movie"
            className="radioButtons"
            onChange={this.handleOptionChange} />
          <label for="book">Book</label>
          <input
            type="radio"
            checked={this.state.selected === "book"}
            name="mediaChoice"
            value="book"
            id="book"
            className="radioButtons"
            onChange={this.handleOptionChange} />
          <input
            type="text"
            value={this.state.userInput}
            onChange={this.handleFormChange}
            placeholder="Search"
          />
          <button type="submit" aria-label="Search"> Search </button>
        </form>
        


        {/* WORK IN PROGRESS */}
        <div>
          <ul>
          {
            this.state.selected === "movie" ? 
              <>
                {
                  this.state.movieArray.map((movie)=>{
                    return(
                    <li 
                      key={movie.id}  
                      onClick={this.handleTitleOption}
                      id={movie.title}
                      value={movie.id} 
                    >
                      {movie.title}</li>
                    )
                  })
                }
              </>
              : <li>Book query array goes here</li>
          }
          </ul>
        </div>
        
        
        <ul>
          <li>
            <h2>{this.state.selectedMovieInfo.title}</h2>
            <div>
              <img src={`http://image.tmdb.org/t/p/w500/${this.state.selectedMovieInfo.poster_path}`} alt={`Movie Poster of ${this.state.selectedMovieInfo.title}`} />
            </div>
            <p>Winner?</p>
          </li>

          <li>
            <h2>Book</h2>
            <div>
              <img src="" alt="" />
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

