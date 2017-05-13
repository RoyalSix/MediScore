import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as map from './map.js';

class App extends Component {
  componentDidMount(){
    map.initMap();
  }
  render() {
    return (
      <div className="App">
        <div style={{display:'flex', justifyContent:'flex-end'}}>
        <div id="map" style={{backgroundColor:'black', height:500, width:500, margin:50}}>
        </div>
        </div>
      </div>
    );
  }
}

export default App;


//lat long score name