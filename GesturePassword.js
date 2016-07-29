/*
 * A smart gesture password locker for react-native apps
 * https://github.com/react-native-component/react-native-smart-sudoku-grid/
 * Released under the MIT license
 * Copyright (c) 2016 react-native-component <moonsunfall@aliyun.com>
 */

import React, {
    PropTypes,
    Component,
} from 'react'
import {
    PanResponder,
    Dimensions,
    StyleSheet,
    View,
    Text,
} from 'react-native'

import * as Utils from './Utils'
import Point from './Point'
import Line from './Line'
import Arrow from './Arrow'

const padding = 8
const borderWidth = 1
const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    }
})

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window')

export default class GesturePassword extends Component {

    static defaultProps = {
        pointBackgroundColor: 'transparent',
        gestureAreaLength: 222,
        color: '#A9A9A9',
        activeColor: '#00AAEF',
        warningColor: 'red',
        warningDuration: 0,
        isWarning: false,
        showArrow: true,
        allowCross: true,
    }

    static PropTypes = {
        pointBackgroundColor: PropTypes.string,
        gestureAreaLength: PropTypes.number,
        color: PropTypes.color,
        activeColor: PropTypes.color,
        warningColor: PropTypes.color,
        warningDuration: PropTypes.number,
        topComponent: PropTypes.element,
        bottomComponent: PropTypes.element,
        isWarning: PropTypes.bool,
        showArrow: PropTypes.bool,
        allowCross: PropTypes.bool,
        onStart: PropTypes.func,
        onReset: PropTypes.func,
        onFinish: PropTypes.func,
    }

    // 构造
    constructor (props) {
        super(props)

        // 初始状态
        this.state = {
            isWarning: false,
            points: [],
            lines: [],
            arrows: [],
        }

        this._gestureAreaMarginHorizontal = (deviceWidth - props.gestureAreaLength) / 2
        this._gestureAreaLeft = 0
        this._gestureAreaTop = 0
        this._pointRadius = (props.gestureAreaLength - padding * 2) / 8
        this._currentPoint = null
        this._currentLine = null
        this._timer = null
        this._sequence = []
    }

    componentWillMount () {

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: this._onTouchStart,
            onPanResponderMove: this._onTouchMove,
            onPanResponderRelease: this._onTouchEnd,
            onPanResponderTerminationRequest: () => false,
        })

    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            isWarning: nextProps.isWarning
        });
    }

    render () {
        return (
            <View style={[this.props.style, styles.container]} {...this._panResponder.panHandlers} >
                {this.props.topComponent}
                <View onLayout={this._onLayout}
                      style={{
                          overflow: 'hidden',
                          width: this.props.gestureAreaLength,
                          height: this.props.gestureAreaLength,
                          marginHorizontal: this._gestureAreaMarginHorizontal,}}>
                    {this._renderLines()}
                    {this._renderPoints()}
                    {this.props.showArrow ? this._renderArrows() : null}
                </View>
                {this.props.bottomComponent}
            </View>
        )
    }

    componentWillUnMount () {
        if (this._timer != null) {
            clearTimeout(this._timer)
            this._timer = null
        }
    }

    _onLayout = (e) => {
        this._gestureAreaLeft = e.nativeEvent.layout.x
        this._gestureAreaTop = e.nativeEvent.layout.y
        this._initializePoints()
    }

    _renderArrows () {
        return this.state.arrows.map((arrow, index) => {
            if (this.state.isWarning) {
                arrow.color = this.props.warningColor
            }
            return (
                <Arrow
                    key={'arrow-' + index}
                    width={this._pointRadius / 3}
                    color={arrow.color}
                    start={{
                        x: arrow.start.x - this._gestureAreaLeft,
                        y: arrow.start.y - this._gestureAreaTop,
                    }}
                    end={{
                        x: arrow.end.x - this._gestureAreaLeft,
                        y: arrow.end.y - this._gestureAreaTop,
                    }}/>
            )
        })
    }

    _renderPoints () {
        return this.state.points.map((point, index) => {
            return (
                <Point
                    key={'point-' + index}
                    radius={this._pointRadius}
                    borderWidth={borderWidth}
                    backgroundColor={this.props.pointBackgroundColor}
                    color={this.props.color}
                    activeColor={this.props.activeColor}
                    warningColor={this.props.warningColor}
                    isActive={point.isActive}
                    isWarning={point.isActive ? this.state.isWarning : false}
                    index={point.index}
                    position={point.position}/>
            )
        })
    }

    _renderLines () {
        return this.state.lines.map((line, index) => {
            if (this.state.isWarning) {
                line.color = this.props.warningColor
            }
            return (
                <Line
                    key={'line-' + index}
                    color={line.color}
                    start={{
                        x: line.start.x - this._gestureAreaLeft,
                        y: line.start.y - this._gestureAreaTop,
                    }}
                    end={{
                        x: line.end.x - this._gestureAreaLeft,
                        y: line.end.y - this._gestureAreaTop,
                    }}/>
            )
        })
    }

    _initializePoints () {
        //avoid repeat invoking(for android)
        if(this.state.points.length) {
            return
        }

        let points = []
        for (let i = 0; i < 9; i++) {
            let left = this._pointRadius * 3 * (i % 3) + padding
            let top = this._pointRadius * 3 * Math.floor(i / 3) + padding
            points.push({
                index: i,
                position: {
                    left: left,
                    top: top,
                },
                origin: {
                    x: this._gestureAreaLeft + left + this._pointRadius,
                    y: this._gestureAreaTop + top + this._pointRadius,
                },
                isActive: false,
                isWarning: false,
            })
        }
        this.setState({
            points,
        })
    }

    _getTouchPoint (location) {
        for (let point of this.state.points) {
            if (Utils.isPointInPath(location, point.origin, this._pointRadius)) {
                return point
            }
        }
        return null
    }

    _addSequence (index) {
        if (~this._sequence.findIndex((item) => item === index)) {
            return
        }
        this._sequence.push(index)
    }

    _addArrow (arrow) {
        this.state.arrows.push(arrow)
        let arrows = this.state.arrows
        this.setState({
            arrows
        })
    }

    _addLine (line) {
        this.state.lines.push(line)
        let lines = this.state.lines
        this.setState({
            lines
        })
    }

    _updateLine (start, end) {
        this._currentLine.start = start
        this._currentLine.end = end

        let lines = this.state.lines
        this.setState({
            lines
        })
    }

    _setToActive (point) {
        point.isActive = true
        this.setState({
            points: this.state.points,
        })
    }

    _reset () {
        let points = this.state.points.map((point, index) => {
            point.isActive = false
            return point
        })
        this.setState({
            isWarning: false,
            points: points,
            lines: [],
            arrows: [],
        })

        this._sequence = []
        this._currentPoint = null
        this._currentLine = null

        if (this.props.onReset) {
            this.props.onReset()
        }
    }

    _onTouchStart = (e, gestureState) => {
        if (this.props.onStart) {
            this.props.onStart()
        }

        if (this._timer != null) {
            clearTimeout(this._timer)
            this._timer = null
        }

        this._reset()
        let location = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
        }
        let point = this._getTouchPoint(location)
        if (point == null) {
            return
        }

        this._addSequence(point.index)
        this._setToActive(point)
        this._currentPoint = point


    }

    _onTouchMove = (e, gestureState) => {
        let location = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
        }
        let point = this._getTouchPoint(location)

        if (point == null) {
            if (this._currentLine == null) {
                return
            }
            this._updateLine(this._currentPoint.origin, location)
        }
        else {
            if (this._currentLine == null) {

                let line = {
                    start: point.origin,
                    end: location,
                    color: this.props.activeColor,
                }
                this._addLine(line)
                this._currentLine = line

                if (this._currentPoint != null) {
                    return
                }
                this._addSequence(point.index)
                this._setToActive(point)
                this._currentPoint = point
            }
            else {
                if (point === this._currentPoint) {
                    this._updateLine(point.origin, location)
                    return
                }

                if (~this._sequence.findIndex((item) => item === point.index)) {
                    this._updateLine(this._currentPoint.origin, location)
                    return
                }

                if (!this.props.allowCross) {
                    let crossPoint = Utils.getCrossPoint(this.state.points, this._currentPoint, point, this._pointRadius)
                    if (crossPoint != null) {
                        this._addSequence(crossPoint.index)
                        this._setToActive(crossPoint)
                    }
                }

                this._updateLine(this._currentPoint.origin, point.origin)
                let arrow = {
                    start: this._currentPoint.origin,
                    end: point.origin,
                    color: this.props.activeColor,
                }
                this._addArrow(arrow)
                let line = {
                    start: point.origin,
                    end: location,
                    color: this.props.activeColor,
                }
                this._addLine(line)
                this._currentLine = line

                this._addSequence(point.index)
                this._setToActive(point)
                this._currentPoint = point
            }
        }

    }

    _onTouchEnd = (e, gestureState) => {
        if (this._sequence.length == 0) {
            return
        }

        let points = this.state.points
        let lines = this.state.lines
        lines.pop()

        this.setState({
            lines,
            points,
        })

        let password = Utils.getPassword(this._sequence)
        if (this.props.onFinish) {
            this.props.onFinish(password)
        }

        if (this.props.warningDuration > 0) {
            this._timer = setTimeout(() => {
                this._reset()
            }, this.props.warningDuration)
        }
        else {
            this._reset()
        }
    }

}
