import React, { Component } from 'react';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';
import * as map from './map.js';
import * as api from './api.js';
import ClassItem from './ClassItem';
var ReactGridLayout = require('react-grid-layout');
const CLASS_ITEMS = [
  'Mortality',
  'Malpractice',
  'Quality Performance',
  'Physician'
]
const CLASS_ITEM_PADDING = 50;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: null,
      heights: [],
      classItems: CLASS_ITEMS
    }
    this.handleStop = this.handleStop.bind(this);
  }
  componentDidMount() {
    map.initMap();
  }
  handleStop(newIndex, title) {
    var newClassItems = JSON.parse(JSON.stringify(this.state.classItems))
    for (var item in newClassItems) {
      var currIndex = newClassItems[item].index;
      if (currIndex <= newIndex) {
        newClassItems[item].index -= 1;
      }
    }
    newClassItems[title].index = newIndex;
    this.setState({ classItems: newClassItems })
  }
  renderClassItems() {
    // layout is an array of objects, see the demo for more complete usage
    var layout = [];
    var renderItems = [];

    for (var classItem of CLASS_ITEMS) {
      layout.push({ i: classItem, x: 0, y: 0, w: 1, h: 2 })
      renderItems.push(<div style={{ alignItems:'center', justifyContent:'center', display:'flex', fontSize:22, border: 'solid', borderWidth: 2, borderColor: 'black', backgroundColor: 'grey', borderRadius: 3 }} key={classItem}>
        <div>{classItem.toUpperCase()}</div>
      </div>)
    }
    return (
      <ReactGridLayout isResizable={false} className="layout" layout={layout} cols={1} rowHeight={30} width={500}>
        {renderItems}
      </ReactGridLayout>
    )
  }
  render() {
    return (
      <div style={{backgroundColor:"#4990E2" }} className="App">
        <div style={{ padding: 50, display: 'flex', justifyContent: 'space-between', }}>
          <div style={{ paddingLeft: 50 }}>
            {this.renderClassItems()}
          </div>
          <div id="map" style={{ alignSelf: 'flex-end', backgroundColor: 'black', height: 500, width: 500 }} />
        </div>
      </div>
    );
  }
}

export default App;


//lat long score name