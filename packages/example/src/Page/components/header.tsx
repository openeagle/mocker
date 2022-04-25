import { defineComponent, reactive } from 'vue'
import { Button, CollapseItem } from 'vant'
import classes from '@/Page/index.module.less'
import { prettyFormat } from '@/Page/utils'

export default defineComponent({
  setup() {
    const state = reactive<{
      logs: any
    }>({
      logs: require('../../../http.mock.config'),
    })

    return () => {
      return (
        <CollapseItem
          is-link={false}
          v-slots={{
            title() {
              return <div style={{ fontWeight: 'bold' }}>当前示例配置如下</div>
            },
          }}
          name={'header'}
        >
          <div>
            <pre
              class={classes.textarea}
              v-html={
                Object.keys(state.logs).length > 0
                  ? prettyFormat(state.logs)
                  : ''
              }
            />
          </div>
        </CollapseItem>
      )
    }
  },
})
