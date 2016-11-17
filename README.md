# react-native-smart-gesture-password

[![npm](https://img.shields.io/npm/v/react-native-smart-gesture-password.svg)](https://www.npmjs.com/package/react-native-smart-gesture-password)
[![npm](https://img.shields.io/npm/dm/react-native-smart-gesture-password.svg)](https://www.npmjs.com/package/react-native-smart-gesture-password)
[![npm](https://img.shields.io/npm/dt/react-native-smart-gesture-password.svg)](https://www.npmjs.com/package/react-native-smart-gesture-password)
[![npm](https://img.shields.io/npm/l/react-native-smart-gesture-password.svg)](https://github.com/react-native-component/react-native-smart-gesture-password/blob/master/LICENSE)

A smart gesture password locker for react-native apps, written in JS for cross-platform support.
It works on iOS and Android.

This component is compatible with React Native 0.25 and newer.

## Preview

![react-native-smart-gesture-password-preview-ios][1]
![react-native-smart-gesture-password-preview-android][2]

## Installation

```
npm install react-native-smart-gesture-password --save
```

## Full Demo

see [ReactNativeComponentDemos][0]

## Usage

Install the GesturePassword from npm with `npm install react-native-smart-gesture-password --save`.
Then, require it from your app's JavaScript files with `import GesturePassword from 'react-native-smart-gesture-password'`.

```js
import React, {
    Component,
} from 'react'
import {
    StyleSheet,
    Alert,
    View,
    Text,
    Dimensions,
} from 'react-native'

import GesturePassword from '../../react-native-smart-gesture-password'
import Button from '../../react-native-smart-button'

export default class gesturePasswordDemo extends Component {

    // 构造
    constructor (props) {
        super(props);
        // 初始状态
        this.state = {
            isWarning: false,
            message: 'Verify your gesture password',
            messageColor: '#A9A9A9',
            password: '',
            thumbnails: [],
        };
        this._cachedPassword = ''
    }

    componentDidMount () {
        this._cachedPassword = '13457' //get cached gesture password
    }

    render () {
        return (
            <GesturePassword
                style={{paddingTop: 20 + 44,}}
                pointBackgroundColor={'#F4F4F4'}
                isWarning={this.state.isWarning}
                color={'#A9A9A9'}
                activeColor={'#00AAEF'}
                warningColor={'red'}
                warningDuration={1500}
                allowCross={true}
                topComponent={this._renderDescription()}
                bottomComponent={this._renderActions()}
                onFinish={this._onFinish}
                onReset={this._onReset}
            />
        )
    }

    _renderThumbnails () {
        let thumbnails = []
        for (let i = 0; i < 9; i++) {
            let active = ~this.state.password.indexOf(i)
            thumbnails.push((
                <View
                    key={'thumb-' + i}
                    style={[
                        {width: 8, height: 8, margin: 2, borderRadius: 8, },
                        active ? {backgroundColor: '#00AAEF'} : {borderWidth: 1, borderColor: '#A9A9A9'}
                    ]}
                />
            ))
        }
        return (
            <View style={{width: 38, flexDirection: 'row', flexWrap: 'wrap'}}>
                {thumbnails}
            </View>
        )
    }

    _renderDescription = () => {
        return (
            <View style={{height: 158, paddingBottom: 10, justifyContent: 'flex-end', alignItems: 'center',}}>
                {this._renderThumbnails()}
                <Text
                    style={{fontFamily: '.HelveticaNeueInterface-MediumP4', fontSize: 14, marginVertical: 6, color: this.state.messageColor}}>{this.state.message}</Text>
            </View>
        )
    }

    _renderActions = () => {
        return (
            <View
                style={{position: 'absolute', bottom: 0, flex:1, justifyContent: 'space-between', flexDirection: 'row', width: Dimensions.get('window').width, }}>
                <Button
                    style={{ margin: 10, height: 40, justifyContent: 'center', }}
                    textStyle={{fontSize: 14, color: '#A9A9A9'}}>
                    Forget password
                </Button>
                <Button
                    style={{ margin: 10, height: 40, justifyContent: 'center', }}
                    textStyle={{fontSize: 14, color: '#A9A9A9'}}>
                    Login other accounts
                </Button>
            </View>
        )
    }

    _onReset = () => {
        let isWarning = false
        //let password = ''
        let message = 'Verify your gesture password'
        let messageColor = '#A9A9A9'
        this.setState({
            isWarning,
            //password,
            message,
            messageColor,
        })
    }

    _onFinish = (password) => {
        if (password === this._cachedPassword) {
            let isWarning = false
            let message = 'Verify succeed'
            let messageColor = '#00AAEF'
            this.setState({
                isWarning,
                password,
                message,
                messageColor,
            })
        }
        else {
            let isWarning = true
            let message
            let messageColor = 'red'
            if (password.length < 4) {
                message = 'Need to link at least 4 points'
            }
            else {
                message = 'Verify failed'
            }
            this.setState({
                isWarning,
                password,
                message,
                messageColor,
            })
        }
        Alert.alert('password is ' + password)
    }

}
```

## Props

Prop                 | Type    | Optional | Default      | Description
-------------------- | ------- | -------- | ------------ | -----------
pointBackgroundColor | string  | Yes      | 'transparent'| determine bgcolor of gesture point
gestureAreaLength    | number  | Yes      | 222          | determine width and height of gesture area
color                | string  | Yes      | '#A9A9A9'    | determine color of normal gesture point
activeColor          | string  | Yes      | '#00AAEF'    | determine color of active gesture point
warningColor         | string  | Yes      | 'red'        | determine color of warning gesture point
lineColor            | string  | Yes      |              | determine color of line, if does not set this, the color of line will be the same as gesture point
lineWidth            | string  | Yes      | 1            | determine width of line
warningDuration      | number  | Yes      | 1500         | determine duration when gesture status is warning
topComponent         | element | Yes      |              | determine the presentation above gesture area
bottomCompont        | element | Yes      |              | determine the presentation below gesture area
isWarning            | bool    | Yes      | false        | determine gesture warning status
showArrow            | bool    | Yes      | true         | determine whether show arrow in point
allowCross           | bool    | Yes      | true         | determine whether allow a line cross a point
onStart              | func    | Yes      |              | determine the listener which is called before gesture is granted
onReset              | func    | Yes      |              | determine the listener which is called after gesture is reseted
onFinish             | func    | Yes      |              | determine the listener which is called after gesture actions is finished

[0]: https://github.com/cyqresig/ReactNativeComponentDemos
[1]: http://cyqresig.github.io/img/react-native-smart-gesture-password-preview-ios-v1.0.0.gif
[2]: http://cyqresig.github.io/img/react-native-smart-gesture-password-preview-android-v1.0.0.gif