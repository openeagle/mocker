// json格式美化
export const prettyFormat = (value: { [key: string]: any }) => {
  try {
    for (const key in value) {
      if (typeof value[key] === 'function') {
        let str = value[key]
        str = str.toString()
        value[key] = str.replace(/\n/g, '<br/>')
      }
    }
    // 设置缩进为2个空格
    let str = JSON.stringify(value, null, 2)
    str = str.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
    // str = str.replace(/\n/g, '/r')
    return str
  } catch (e) {
    console.error('异常信息:' + e)
  }
}
