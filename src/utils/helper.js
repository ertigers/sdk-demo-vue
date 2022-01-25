// 存储本地信息
export function setStorage(key, value) {
	if (typeof value == 'object') {
    value = JSON.stringify(value)
  }
  localStorage.setItem(key, value)
}

// 查询本地信息
export function getStorage(key) {
  let value = localStorage.getItem(key)
  let value2 = value
  try {
    value2 = JSON.parse(value)
  } catch(error) {
    value2 = value
  }
  return value2
}