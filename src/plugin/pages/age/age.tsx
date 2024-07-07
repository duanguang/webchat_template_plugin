import { View } from '@tarojs/components'
import { Button } from "@nutui/nutui-react-taro"
import { useRequest } from 'ahooks';
import './age.scss'
import { demoApi } from '@/plugin/api/demo';
import { useEffect } from 'react';
const Index = () => {
  const getDetailRequest = useRequest(async (id: string) => {
    return demoApi.getDetail(id);
  },{
    manual: true,
    onSuccess: async (result) => {
      console.log(result,'res')
    },
  });
  const getProgressListRequset = useRequest(async (params: Parameters<typeof demoApi.getProgressList>[0]) => {
    return demoApi.getProgressList(params);
  },{
    manual: true,
    onSuccess: async (result) => {
      console.log(result,'res1')
    },
  });
  useEffect(() => {
    getDetailRequest.run('166');
    getProgressListRequset.run({
      pageIndex: 1,
      pageSize: 20,
    })
  },[])
  return (
    <View>
      <View className="index">
        欢迎使用 NutUI React 开发 Taro 多端项目。
      </View>
      <View className="index">
        <Button type="primary" className="btn">
          NutUI React Button
        </Button>
      </View>
    </View>
  )
}
export default Index
