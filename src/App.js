import React, { Component } from 'react'
import './App.css'
import BaseMap from './aMap'
import MarkerFilter from './MarkerFilter'

class App extends Component {
  constructor() {
    super();

    this.state = {
      markers: []
    }

  }

  componentDidMount() {
    //加载地点数据
    fetch('./markers.json', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(res => res.json())
      .then(data => {
        this.setState(state => ({
          markers: data.markers
        }));
      });
  }
  render() {
    return (
      <div className = 'container'>
        <MarkerFilter markers = {this.state.markers}/>
        <div className = 'map'>
          <BaseMap markers = {this.state.markers}/>
        </div>
      </div>
    )
  }
}
export default App;