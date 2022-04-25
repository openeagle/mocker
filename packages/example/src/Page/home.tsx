import { defineComponent, reactive } from 'vue'
import { Collapse, Notify } from 'vant'
import { useRoute } from 'vue-router'
import Header from './components/header'
import RowItem from './components/rowItem'
import classes from './index.module.less'

export default defineComponent({
  setup() {
    const route = useRoute()
    const state = reactive<{
      openVal: string
    }>({
      openVal: (route.query?.type as string | undefined) || 'header',
    })
    if (route.query.type !== undefined) {
      Notify({ type: 'primary', message: '点击【尝试】返回请求结果' })
    }
    const change = (name: string) => {
      state.openVal = name
    }
    return () => {
      return (
        <div class={classes.pageBox}>
          <Collapse v-model={[state.openVal, 'modelValue']} accordion>
            <Header></Header>
            <RowItem
              title={'示例1'}
              describe={
                '有yapi接口，无本地mock配置 -- 直接返回基于yapi生成的mock数据'
              }
              api={{
                url: '/yapiMockApi/base',
                method: 'post',
              }}
              name={'1'}
              onClick={change}
            />
            <RowItem
              title={'示例2'}
              describe={'有yapi接口，本地mock配置 -- 合并yapi生成的mock数据'}
              codePre={{
                name: '本地mock配置：',
                code: require('../../mocker/yapi/merge'),
              }}
              api={{
                url: '/yapiMockApi/merge',
                method: 'post',
              }}
              name={'2'}
              onClick={change}
            />
            <RowItem
              title={'示例3'}
              describe={'有yapi接口，本地mock配置 -- 不合并yapi生成的mock数据'}
              codePre={{
                name: '本地mock配置：',
                code: require('../../mocker/yapi/noMerge'),
              }}
              api={{
                url: '/yapiMockApi/no_merge',
                method: 'post',
              }}
              name={'3'}
              onClick={change}
            />
            <RowItem
              title={'示例4'}
              describe={'无yapi接口，本地mock配置 -- 直接使用本地mock数据'}
              codePre={{
                name: '本地mock配置：',
                code: require('../../mocker/yapi/local'),
              }}
              api={{
                url: '/localMockApi',
                method: 'post',
              }}
              name={'4'}
              onClick={change}
            />
            <RowItem
              title={'示例5'}
              describe={'无yapi接口，无本地mock配置 -- 使用代理转发到真实接口'}
              api={{
                url: '/yapiMockApi/proxy',
                method: 'post',
              }}
              name={'5'}
              onClick={change}
            />
            <RowItem
              title={'示例6'}
              describe={'有yapi接口，使用代理转发到真实接口'}
              codePre={{
                name: '本地mock配置：',
                code: require('../../mocker/yapi/proxyDisabled'),
              }}
              api={{
                url: '/yapiMockApi/proxy_disabled',
                method: 'post',
              }}
              name={'6'}
              onClick={change}
            />
            <RowItem
              title={'示例7'}
              describe={'有yapi接口，response覆盖基于yapi返回的mock数据'}
              api={{
                url: '/yapiMockApi/response',
                method: 'post',
              }}
              name={'7'}
              onClick={change}
            />
            <RowItem
              title={'示例8'}
              describe={'有yapi接口，testcase，多场景示例'}
              codePre={{
                name: '本地mock配置：',
                code: require('../../mocker/yapi/testcase'),
              }}
              api={{
                url: '/yapiMockApi/testcase',
                method: 'post',
              }}
              name={'8'}
              onClick={change}
            />
            <RowItem
              title={'示例9'}
              describe={'有yapi接口，testcase，多场景示例，response统一覆盖'}
              codePre={{
                name: '本地mock配置：',
                code: require('../../mocker/yapi/testcaseResponse'),
              }}
              api={{
                url: '/yapiMockApi/testcase_response',
                method: 'post',
              }}
              name={'9'}
              onClick={change}
            />
            <RowItem
              title={'常用mock语法示例'}
              describe={
                '支持生成随机的文本、数字、布尔值、日期、邮箱、链接、图片、颜色等。'
              }
              codePre={{
                name: '本地mock配置：',
                code: require('../../mocker/yapi/mock'),
              }}
              api={{
                url: '/yapiMockApi/mock',
                method: 'post',
              }}
              name={'10'}
              onClick={change}
            />
          </Collapse>
        </div>
      )
    }
  },
})
