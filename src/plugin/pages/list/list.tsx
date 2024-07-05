import { Component, PropsWithChildren } from 'react'
import { View } from '@tarojs/components'
import {ListItem} from '@/plugin/components/listItem/listItem'
import './list.scss'

export default class List extends Component<PropsWithChildren> {
  state = {
    list: [{
      name: 'A',
      value: '1'
    }, {
      name: 'B',
      value: '2'
    }, {
      name: 'C',
      value: '3'
    }]
  }

  render () {
    return (
      <View>
        {this.state.list.map(item => {
          return <ListItem name={item.name} value={item.value} key={item.name} />
        })}
      </View>
    )
  }
}
