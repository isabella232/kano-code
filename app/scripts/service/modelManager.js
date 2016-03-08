let data = {}

const ModelManager = {
  get (type) {
    return data[type]
  },

  set (type, info) {
    data[type] = info
  },

  unset (type) {
    data[type] = ''
  }
}
export default ModelManager
