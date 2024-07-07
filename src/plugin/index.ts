import Taro from "@tarojs/taro"

export function sayHello() {
  console.log('Hello plugin!')
  Taro.showToast({
    title:'Hello plugin!'
  })
}

export const answer = 42
