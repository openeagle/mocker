import { defineComponent, reactive, ref, PropType } from 'vue'
import { CollapseItem, Button } from 'vant'
import { EaxiosRequestConfig } from '@openeagle/eaxios'
import { request } from '../../request'
import { prettyFormat } from '../utils'
import { CodePreType } from '../type'
import classes from '../index.module.less'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    describe: {
      type: String,
    },
    codePre: {
      type: Object as PropType<CodePreType>,
    },
    api: {
      type: Object as PropType<EaxiosRequestConfig>,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    onClick: {
      type: Function as PropType<(name: string) => void>,
    },
  },
  setup(props, { emit }) {
    const state = reactive<{
      logs: any
    }>({
      logs: {},
    })

    // 发起请求
    const sendRequest = (e: any) => {
      e.stopPropagation()
      request({
        ...props.api,
        data: apiData.value,
        params: apiParams.value,
      }).then((res) => {
        state.logs = res
      })
      emit('click', props.name)
    }

    const apiParams = ref(
      props.api.params ? prettyFormat(props.api.params) : ''
    )
    const apiData = ref(props.api.data ? prettyFormat(props.api.data) : '')

    return () => {
      return (
        <CollapseItem
          is-link={false}
          v-slots={{
            title() {
              return props.title || ''
            },
            label() {
              return props.describe || ''
            },
            value() {
              return (
                <Button type="primary" onClick={sendRequest}>
                  尝试
                </Button>
              )
            },
          }}
          name={props.name}
        >
          {apiData.value ? (
            <>
              <div class={classes.rowText}>请求参数：</div>
              <textarea v-model={apiData.value} class={classes.textarea} />
            </>
          ) : null}
          {apiParams.value ? (
            <>
              <div class={classes.rowText}>请求参数：</div>
              <textarea v-model={apiParams.value} class={classes.textarea} />
            </>
          ) : null}

          <>
            {props.codePre?.name ? (
              <div class={classes.rowText}>{props.codePre?.name}</div>
            ) : null}
            {props.codePre?.code ? (
              <pre
                v-html={prettyFormat(props.codePre?.code)}
                class={classes.textarea}
              />
            ) : null}
          </>

          <div>
            <div class={classes.rowText}>请求结果：</div>
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
