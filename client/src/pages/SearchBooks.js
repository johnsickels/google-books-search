import React, { Component } from "react";
// import SaveBtn from "../components/SaveBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
// import { Link } from "react-router-dom";
import { Container, Row, Col } from "../components/Grid";
// import { List, ListItem } from "../components/List";
// import { Input, FormBtn } from "../components/Form";
import SearchForm from "../components/SearchForm";
import SearchResult from "../components/SearchResult";

class SearchBooks extends Component {
  // create state
  state = {
    search: "",
    books: [],
    error: "",
    message: ""
  };

  // function to take the value of what is entered in the search bar
  handleInputChange = event => {
    this.setState({ search: event.target.value });
  };

  // function to control the submit button of the search form
  handleFormSubmit = event => {
    event.preventDefault();
    // once it clicks it connects to the google book api with the search value
    API.searchBook(this.state.search)
      .then(res => {
        if (res.data.items === "error") {
          throw new Error(res.data.items);
        } else {
          // store responses in an array
          let results = res.data.items
          // map through the array
          console.log(results);
          
          results = results.map(result => {
            // store each book information in a new object
            result = {
              key: result.id,
              id: result.id,
              title: result.volumeInfo.title,
              authors: result.volumeInfo.authors,
              description: result.volumeInfo.description,
              image: result.volumeInfo.imageLinks.thumbnail,
              link: result.volumeInfo.infoLink
            }
            console.log(result);
            
            return result;
          })
          // reset the state of the empty books array to the new array of objects
          this.setState({ books: results, error: "" })
        }
      })
      .catch(err => this.setState({ error: err.items }));
  };

  handleSavedButton = event => {
    console.log(event);
    event.preventDefault();
    console.log(this.state.books);
    let savedBooks = this.state.books.filter(book => book.id === event.target.id)
    savedBooks = savedBooks[0];
    API.saveBook(savedBooks)
      .then(this.setState({ message: alert("Book saved") }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <Container fluid>
        <Jumbotron>
          <h1>Find Your Favorite Books with Google Books API</h1>
        </Jumbotron>
        <Container>
          <Row>
            <Col size="12">
              <SearchForm
                handleFormSubmit={this.handleFormSubmit}
                handleInputChange={this.handleInputChange}
              />
            </Col>
          </Row>
        </Container>
        <br></br>
        <Container>
          <SearchResult 
            books={this.state.books} 
            handleSavedButton={this.handleSavedButton} 
          />
        </Container>
      </Container>
    );
  }
}

export default SearchBooks;
