import React, { Component } from 'react';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';
import * as map from './map.js';
import * as api from './api.js';
var ReactGridLayout = require('react-grid-layout');
const CLASS_ITEMS = [
  'imagingefficiency',
  'timelyeffectivecare',
  'totalperformance'
]

const buttonStyle = {
  alignItems: 'center', justifyContent: 'center', display: 'flex', fontSize: 22, border: 'solid', borderWidth: 2, borderColor: 'grey', opacity: .9
  , backgroundColor: 'white', borderRadius: 3
}
const CLASS_ITEM_PADDING = 50;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: null,
      classifier: {
        'imagingefficiency': 1,
        'timelyeffectivecare': 2,
        'totalperformance': 3
      },
      zip_code: null
    }
    this.onDragStop = this.onDragStop.bind(this);
    this.getLocations = this.getLocations.bind(this);
    this.plotData = this.plotData.bind(this);
  }
  componentDidMount() {
    map.initMap(null, (zip_code) => {
      this.setState({ zip_code:zip_code.results["0"].address_components[5].short_name })
    });
  }

  onDragStop(layout) {
    var classifier = {};
    for (var classItem of layout) {
      classifier[classItem.i] = (classItem.y / 2) + 1;
    }
    this.setState({ classifier })
  }
  renderClassItems() {
    // layout is an array of objects, see the demo for more complete usage
    var layout = [];
    var renderItems = [];
    for (var classItem of CLASS_ITEMS) {
      layout.push({ i: classItem, x: 0, y: 0, w: 1, h: 2 })
      renderItems.push(<div style={buttonStyle} key={classItem}>
        <div>{classItem.toUpperCase()}</div>
      </div>)
    }
    return (
      <ReactGridLayout onDragStop={this.onDragStop} isResizable={false} className="layout" layout={layout} cols={1} rowHeight={30} width={500}>
        {renderItems}
      </ReactGridLayout>
    )
  }
  getLocations() {
    fetch(`http://mediscore.herokuapp.com/api/hospitals?zip=90650&imagingefficiency=${this.state.classifier.imagingefficiency}&timelyeffectivecare=${this.state.classifier.timelyeffectivecare}&totalperformance=${this.state.classifier.totalperformance}`).then((response) => response.json()).then((jsonObj) => {
      this.plotData(jsonObj);
    })
  }

  plotData(data) {
    for (var hospital of data) {
      map.setMarker(hospital)
    }
    map.setMapFromMarker(data);
  }
  render() {
    return (
      <div style={{ backgroundColor: "#4990E2", height: '100vh', overflow: 'hidden' }} className="App">
        <div style={{ padding: 50, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ paddingLeft: 50, }}>
            {this.renderClassItems()}
            <button onClick={this.getLocations} style={{ height: 75, width: 482, marginLeft: 11, textAlign: 'center', fontSize: 22, opacity: .9, backgroundColor: 'white' }}>SUBMIT</button>
          </div>
          <div id="map" style={{ alignSelf: 'flex-end', backgroundColor: 'black', height: 400, width: 500 }} />
        </div>

      </div>
    );
  }
}

export default App;


//lat long score name