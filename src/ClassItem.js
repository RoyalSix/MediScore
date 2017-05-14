import React, { Component } from 'react';
import Draggable from 'react-draggable';
const GRID_SIZE = 100

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: null
        }
        this.handleStop = this.handleStop.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.yPosition) this.setState({ position: { y: nextProps.yPosition, x: 0 } })
        this.setState({ position: null })
    }
    handleStop(element) {
        var newIndex = parseInt(element.y / 80);
        if (newIndex < 0) newIndex = 1;
        if (newIndex > 4) newIndex = 4;
        console.log(newIndex);
        this.props.newIndex(newIndex, this.props.title)
    }
    render() {
        return (
            <div onMouseUp={this.handleStop} style={{ top:this.props.yPosition, backgroundColor: 'grey', height: 50, width: 300, borderWidth: 2, borderRadius: 5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="handle" style={{ fontSize: 20 }}>{this.props.title.toUpperCase()}</div>
            </div>
        );
    }
}