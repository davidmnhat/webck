import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Tự động tìm token và username trong máy, nếu không có mới để rỗng ''
      token: localStorage.getItem('token') || '',
      username: localStorage.getItem('username') || ''
    };
  }
  setToken = (value) => {
    this.setState({ token: value });
  }
  setUsername = (value) => {
    this.setState({ username: value });
  }
  render() {
    return (
      <MyContext.Provider value={{ 
        token: this.state.token, setToken: this.setToken,
        username: this.state.username, setUsername: this.setUsername
      }}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}
export default MyProvider;