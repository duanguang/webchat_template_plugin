import { Component, PropsWithChildren } from 'react'
import { View } from '@tarojs/components'
import './listItem.scss'

interface IListItem {
  name: string,
  value: string
}

export const ListItem = (props:IListItem) => {
  return (
    <View>
      <View>name: {props.name}</View>
      <View>value: {props.value}</View>
    </View>
  )
}
// export default class ListItem extends Component<IListItem, any> {
//   render () {
//     const { name, value } = this.props
//     return (
//       <View>
//         <View>name: {name}</View>
//         <View>value: {value}</View>
//       </View>
//     )
//   }
// }
