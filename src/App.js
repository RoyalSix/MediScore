import React, { Component } from 'react';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';
import * as map from './map.js';
import * as api from './api.js';
var ReactGridLayout = require('react-grid-layout');
const STATIC_ZIPCODE = 90023;

const buttonStyle = {
  alignItems: 'center', justifyContent: 'center', display: 'flex', fontSize: 19, border: 'solid', borderWidth: 2, borderColor: 'grey', opacity: .9
  , backgroundColor: 'white', borderRadius: 3
}
const CLASS_ITEM_PADDING = 50;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: null,
      classifiers: [
        {
          key: 'imagingefficiency',
          title: 'Imaging Efficiency',
          value:1
        },
        {
          key: 'timelyeffectivecare',
          title: 'Timely Effective Care',
          value:2
        },
        {
          key: 'totalperformance',
          title: 'Total Performance',
          value:3
        },
        {
          key: 'consumerrating',
          title: 'Consumer Rating',
          value:4
        }
      ],
      classifier:'imagingefficiency',
      zip_code: null
  }
    this.onDragStop = this.onDragStop.bind(this);
this.getLocations = this.getLocations.bind(this);
this.plotData = this.plotData.bind(this);
  }
componentDidMount() {
  map.initMap(null, (zip_code) => {
    this.setState({ zip_code: zip_code.results["0"].address_components[5].short_name })
  });
}

onDragStop(layout) {
  var classifier = {};
  for (var classItem of layout) {
    if ((classItem.y / 2) == 1) return this.setState({classifier:classItem.i})
  }
}
renderClassItems() {
  // layout is an array of objects, see the demo for more complete usage
  var layout = [];
  var renderItems = [];
  var i = 0;
  for (var classItem of this.state.classifiers) {
    layout.push({ i: 'val_' + i, x: 0, y: i, w: 1, h:1, static:true })
    renderItems.push(<div style={buttonStyle} key={'val_' + i}>
      <div>{i + 1}</div>
    </div>)
    layout.push({ i: classItem.key, x: 2, y: i, w: 4, h:1 })
    renderItems.push(<div style={buttonStyle} key={classItem.key}>
      <div>{classItem.title.toUpperCase()}</div>
    </div>)
    i++;
  }
      layout.push({ i: 'button', x: 0, y:this.state.classifiers.length, w: 5, h:1, static:true })
    renderItems.push(<div style={buttonStyle} key={'button'}>
      <button style={{height:'100%', width:'100%', backgroundColor:'white', opacity:.9, fontSize: 19, }} onClick={this.getLocations}>SUBMIT</button>
    </div>)
  return (
    <ReactGridLayout 
     onDragStop={this.onDragStop} isResizable={false} className="layout" layout={layout} cols={5} rowHeight={60} width={450}>
      {renderItems}
    </ReactGridLayout>
  )
}
getLocations() {
  fetch(`http://mediscore.herokuapp.com/api/hospitals?zip=${STATIC_ZIPCODE}&user-input=${this.state.classifier}`).then((response) => response.json()).then((jsonObj) => {
    this.plotData(jsonObj);
    this.setState({})
  })
}

getHospitalNames() {
  
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
    <center style={{color:'white', fontSize:30, fontWeight:100, marginTop:20}}>MediScore</center>
      <div style={{ padding: 50, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ paddingLeft: 50, }}>
          {this.renderClassItems()}
        </div>
        <div id="map" style={{ alignSelf: 'flex-end', backgroundColor: 'black', height: 338, width: 600}} />
      </div>

    </div>
  );
}
}

export default App;


//lat long score name