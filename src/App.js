import React, { Component } from "react";
import "./App.css";
import axios from 'axios';

const apiEndpoint = 'http://jsonplaceholder.typicode.com/posts';

//parameters are a success callback, and an error callback.
axios.interceptors.response.use(null, error => {
  const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;
  if(!expectedError){
    console.log("logging unexpected error", error);
    alert("An unexpected error has occurred.");
  }

  return Promise.reject(error);
});

class App extends Component {
  state = {
    posts: []
  };


  async componentDidMount() {
    const { data: posts } = await axios.get(apiEndpoint);
    this.setState({ posts });
  }

  handleAdd = async() => {
    const obj = { title: 'a', body: 'b' };
    const { data: post } = await axios.post(apiEndpoint, obj);
    this.setState({ posts: [post, ...this.state.posts] });
  };

  handleUpdate = async post => {
    //put updates all properties, patch updates 1 or more properties.
    post.title = "UPDATED";
    await axios.put(`${apiEndpoint}/${post.id}`, post);
    let posts = [...this.state.posts];
    let index = posts.indexOf(post);
    posts[index] = { ...post };
    this.setState({ posts });
  };

  handleDelete = async post => {
    const originalPosts = this.state.posts;

    const posts = this.state.posts.filter(e => e.id !== post.id);
    this.setState({ posts });
    try{
      await axios.delete(`${apiEndpoint}/${post.id}`);
      //throw new Error("Sorry, something went wrong.");
    }
    catch(ex){
      if(ex.response && ex.response.status === 404)
        alert("This post no longer exists.");

      this.setState({ posts: originalPosts });
    }
  };

  render() {
    return (
      <React.Fragment>
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
