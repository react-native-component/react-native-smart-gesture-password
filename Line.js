import React, {
    PropTypes,
    Component,
} from 'react'
import {
    StyleSheet,
    View,
} from 'react-native'

import * as Utils from './Utils'

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    }
})

export default class Line extends Component {

    static defaultProps = {
        lineWidth: 1,
    }

    static propTypes = {
        color: PropTypes.string.isRequired,
        lineWidth: PropTypes.number,
        start: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
        }).isRequired,
        end: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
        }).isRequired,
    }

    // 构造
    constructor (props) {
        super(props)
        // 初始状态
        this.state = {}
    }

    render () {
        let transform = Utils.getLineTransform(this.props.start, this.props.end)

        return (
            <View
                style={[styles.container, {
                    backgroundColor: this.props.color,
                    width: transform.distance,
                    height: this.props.lineWidth,
                    left: this.props.start.x,
                    top: this.props.start.y - this.props.lineWidth/2,
                    transform: [{translateX: transform.translateX},
                        {translateY: transform.translateY},
                        {rotateZ: transform.rotateRad + 'rad'}]
                  }]}/>
        )
    }

}