import { Component, PropsWithChildren } from 'react'
import { View, Image } from '@tarojs/components'
import './avatar.scss'

export default class Avatar extends Component<PropsWithChildren>  {
  render () {
    return (
      <View>
        <Image src='http://storage.360buyimg.com/taro-static/static/images/logo.png' />
      </View>
    )
  }
}
