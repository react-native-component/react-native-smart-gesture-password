import React, {
    Component,
} from 'react'
import {
    StyleSheet,
    View,
} from 'react-native'

import PropTypes from 'prop-types'

import Circle from './Circle'

export default class Point extends Component {

    static defaultProps = {
        isActive: false,
        isWarning: false,
    }

    static propTypes = {
        index: PropTypes.number.isRequired,
        radius: PropTypes.number.isRequired,
        borderWidth: PropTypes.number.isRequired,
        isActive: PropTypes.bool.isRequired,
        isWarning: PropTypes.bool.isRequired,
        backgroundColor: PropTypes.string,
        color: PropTypes.string.isRequired,
        activeColor: PropTypes.string.isRequired,
        warningColor: PropTypes.string.isRequired,
        position: PropTypes.shape({
            left: PropTypes.number.isRequired,
            top: PropTypes.number.isRequired,
        }).isRequired,
    }

    // 构造
    constructor (props) {
        super(props)
        // 初始状态
        this.state = {}

        this._outerCircleRadius = props.radius
        this._outerCirclePosition = props.position
        this._innerCircleRadius = this._outerCircleRadius / 3
        this._innerCirclePosition = {
            left: this._innerCircleRadius * 2 - props.borderWidth,
            top: this._innerCircleRadius * 2 - props.borderWidth,
        }

    }

    render () {
        this._color = this.props.isWarning ?
            this.props.warningColor :
            ( this.props.isActive ? this.props.activeColor : this.props.color )

        return (
            <Circle
                backgroundColor={this.props.backgroundColor}
                color={this._color}
                radius={this.props.radius}
                borderWidth={this.props.borderWidth}
                position={this._outerCirclePosition}>
                { (this.props.isActive || this.props.isWarning) ? (
                    <Circle
                        isFill={true}
                        color={this._color}
                        radius={this._innerCircleRadius}
                        borderWidth={this.props.borderWidth}
                        position={this._innerCirclePosition}
                    />
                ) : null}
            </Circle>
        )
    }

}
