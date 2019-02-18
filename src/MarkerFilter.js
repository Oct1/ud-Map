import React, {Component} from 'react'
import EscapeRegExp from 'escape-string-regexp'
import {event} from './eventEmitter'

class MarkerFilter extends Component {
	constructor() {
		super();
		//搜索内容
		this.state = {
			query: ''
		}
		this.showmarkers = [];
		this.updateQuery = (query, markers) => {
			query = query.trim()
			this.setState({
				query: query
			})
			if (query) {
				{
					//参考https://www.npmjs.com/package/escape-string-regexp
				}
				const match = new RegExp(EscapeRegExp(query), 'i');
				console.log(match)
				this.showmarkers = markers.filter((item) => match.test(item.title));
			}
			event.emit('updateMarkersData', query, this.showmarkers)
		}
		this.handleLiClick = (title, position) => {
			event.emit('choseMarker', title, position)
		    window.scrollTo({
		      left: 0,
		      top: 0,
		      behavior: 'smooth',
		    });
		}
		this.handleKeyPress = (e, title, position) => {
			if (e.key === 'Enter') {
				event.emit('choseMarker', title, position)
			}
		}
	}

	render() {
		const { markers } = this.props;
		const { query } = this.state;
		//筛选内容
		let showmarkersCopy = markers;
		if (query) {
			showmarkersCopy = this.showmarkers;
		}
		return (
			<div className="markerfilter">
				<h1>地址搜索</h1>
				<label htmlFor='filtermarker' className="visibleNone">名称搜索</label>
				<input 
				role='searchbox'
				name='filtermarker'
				type='text'
				placeholder='地点名称'
				value={this.state.query}
				onChange={(event)=>{this.updateQuery(event.target.value,markers)}}
				/>
				<ul>
					{showmarkersCopy.map(item=>(<li key={item.id} role='button' tabIndex='0' onKeyPress={(e)=>{this.handleKeyPress(e,item.title,item.position)}} onClick={()=>{this.handleLiClick(item.title,item.position)}}>{item.title}</li>))}
				</ul>
			</div>
		)
	}
}

export default MarkerFilter;