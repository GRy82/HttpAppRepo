import React, { Component } from "react";
import "./App.css";
import http from './services/httpService';
import config from './congif.json';

class App extends Component {
  state = {
    posts: []
  };


  async componentDidMount() {
    const { data: posts } = await http.get(config.apiEndpoint);
    this.setState({ posts });
  }

  handleAdd = async() => {
    const obj = { title: 'a', body: 'b' };
    const { data: post } = await http.post(config.apiEndpoint, obj);
    this.setState({ posts: [post, ...this.state.posts] });
  };

  handleUpdate = async post => {
    //put updates all properties, patch updates 1 or more properties.
    post.title = "UPDATED";
    await http.put(`${config.apiEndpoint}/${post.id}`, post);
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
      await http.delete(`${config.apiEndpoint}/${post.id}`);
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
