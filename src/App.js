import React, { Component } from 'react'
import './App.css'
import BaseMap from './aMap'
import MarkerFilter from './MarkerFilter'

class App extends Component {
  constructor() {
    super();

    this.state = {
      markers: [],
      showOrHide: 'show'
    }

    this.toggleControl = () => {
        this.setState(state => ({
          showOrHide: (state.showOrHide === 'show') ? 'hide' : 'show'
        }))
    }

    // //窗口的变化
    // this.windowChange = () => {
    //   if (window.innerWidth <= 600 && this.state.showOrHide === 'show') {
    //     this.setState(state => ({
    //       showOrHide: 'hide'
    //     }))
    //   } else if (window.innerWidth > 600 && this.state.showOrHide === 'hide') {
    //     this.setState(state => ({
    //       showOrHide: 'show'
    //     }))
    //   }
    // }

  }

  componentDidMount() {
    //参考https://www.cnblogs.com/ganmy/p/6846628.html
    // window.addEventListener('resize', this.windowChange)

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
  //组件销毁后移除监听器
  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.windowChange)
  // }

  //className={`container ${this.state.showOrHide}`}
  render() {
    return (
      <div className={`container ${this.state.showOrHide}`}>
        <MarkerFilter markers = {this.state.markers}/>
        <div className = 'map'>
          {
            <div className='toggleBar' >
              <button className='toggleBtn' onClick={this.toggleControl}>Navigation</button>
            </div>
          }
          <BaseMap markers = {this.state.markers}/>
        </div>
      </div>
    )
  }
}
export default App;