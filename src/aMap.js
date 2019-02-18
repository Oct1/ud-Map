import React, { Component } from 'react'
import { Map,Marker,InfoWindow } from 'react-amap'
import { event } from './eventEmitter'
import { _fetch } from './_fetch'
class BaseMap extends Component {
  constructor() {
    super();
    this.state = {
      query: '',
      targetTitle: '',
      targetPos: {},
      targetCont: {},
      infowindowVisible: false
    }
    //地图初始化
    this.mapOptions = {
      key: 'd37b536c885f47a0dce802939a0fb64d',
      center: {
            latitude: 30.248006,
            longitude: 120.21321
      },
      zoom: 10,
      plugins: ['ToolBar'],
      markerEvents: {
        click: (e) => {
          console.log(e)
          const pos = {};
          pos.longitude = e.lnglat.lng;
          pos.latitude = e.lnglat.lat;
          this.handleMarkerClick(e.target.F.extData, pos);
        }
      },
      infowindow: {
        size: {
          width: 200,
          height: 150
        },
        windowEvents: {
          close: () => {
            this.setState(state => ({
              targetTitle: '',
              targetPos: {},
              infowindowVisible: !this.state.infowindowVisible
            }))
          }
        }
      }
    }

    //经过筛选的markers数据获取
    this.showmarkers = [];


    this.recieveMarkers = (query, data) => {
      this.setState({
        query: query
      })
      this.showmarkers = data;
    }
    this.handleMarkerClick = (title, pos) => {
      this.setState(state => ({
        targetTitle: title,
        targetPos: pos,
        infowindowVisible: true,
        targetCont: {}
      }));
      this.getWikiData(title)
    }
    event.on('updateMarkersData', this.recieveMarkers)
    event.on('choseMarker', this.handleMarkerClick)


    //参考 https://blog.csdn.net/qq_32623363/article/details/76785368
    this.getWikiData = (title) => {
        _fetch(fetch(`https://zh.wikipedia.org/w/api.php?action=query&list=search&srsearch=${title}&prop=info&inprop=url&utf8=&format=json&origin=*`, {
          method: 'GET',
          headers: new Headers({
            'Api-User-Agent': 'Example/1.0'
          })
        }),200) 
        .then(function(response) {
          if (response.ok) {
            return response.json();
          }
        })
        .then(data => {
          console.log(data)
          this.setState(state => ({
            targetCont: {
              title: data.query.search[0].title,
              intro: data.query.search[0].snippet
            }
          }))
        })
        //网络故障
        .catch(error => {
          this.setState(state => ({
            targetCont: {
              errorinfo: '网络连接错误'
            }
          }))
        })
    }
  }

  render() {
    const {markers} = this.props;
    const mapOptions = this.mapOptions;
    const {query,targetTitle,targetPos,targetCont,infowindowVisible} = this.state;
    let infoWindow;
    //数据请求错误 存在errorinfo
    if (Object.keys(targetCont).length) {
      if ('errorinfo' in targetCont) {
        infoWindow =
          `<div class="infowindow">
            <h1>${targetTitle}</h1>
            <h2>数据请求失败！</h2>
            <p>失败原因：${targetCont.errorinfo}</p>
          </div>`
      } else {
        console.log(targetCont.title)
        infoWindow =
          `<div class="infowindow">
            <h1>${targetTitle}</h1>
            <h2>维基百科：<a href='https://zh.wikipedia.org/wiki/${targetCont.title}' target='_blank'>${targetCont.title}</a></h2>
            <p>简介：${targetCont.intro}</p>
          </div>`
      }
    }

    let showmarkersCopy = markers;
    if (query) {
      showmarkersCopy = this.showmarkers;
    }
    return (
      <Map 
        amapkey={mapOptions.key}
        zoom={mapOptions.zoom}
        center={mapOptions.center}
        plugins={mapOptions.plugins}
      >
            {showmarkersCopy.map(item=>(
                <Marker
                  position={item.position}
                  key={item.id}
                  extData={item.title}
                  events={mapOptions.markerEvents}
                />
            ))}
              <InfoWindow
                  position={targetPos}
                  visible={infowindowVisible}
                  content={infoWindow}
                  size={mapOptions.infowindow.size}
                  events={mapOptions.infowindow.windowEvents}
                />
          </Map>
    )
  }
}

export default BaseMap;