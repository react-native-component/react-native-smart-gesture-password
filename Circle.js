import React, {
    PropTypes,
    Component,
} from 'react'
import {
    StyleSheet,
    View,
} from 'react-native'

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    }
})

//const borderWidth = 1

export default class Circle extends Component {

    static defaultProps = {
        isFill: false,
        backgroundColor: 'transparent',
    }

    static PropTypes = {
        isFill: PropTypes.bool,
        color: PropTypes.string.isRequired,
        radius: PropTypes.number.isRequired,
        borderWidth: PropTypes.number.isRequired,
        backgroundColor: PropTypes.string,
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
        this._diameter = props.radius * 2
    }

    render () {
        return (
            <View
                //onLayout={ (e) => {
                //   //console.log('this._diameter = ' + this._diameter)
                //   //console.log('e.nativeEvent')
                //   //console.log(e.nativeEvent)
                //}}
                style={[
          styles.container,
          this.props.isFill ?
          {backgroundColor: this.props.color, } :
          {borderColor: this.props.color, borderWidth: this.props.borderWidth, backgroundColor: this.props.backgroundColor },
          {width: this._diameter,
           height: this._diameter,
           borderRadius: this.props.radius,
            //left: this.props.position.left - borderWidth,
            //top: this.props.position.top - borderWidth,
            left: this.props.position.left,
            top: this.props.position.top,
            }
        ]}>
                {this.props.children}
            </View>
        )
    }

}