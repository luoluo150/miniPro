
function requestPostApi(url, params, sourceObj, successFun, failFun, completeFun) {
  requestApi(url, params, 'POST', sourceObj, successFun, failFun, completeFun)
}

function requestGetApi(url, params, sourceObj, successFun, failFun, completeFun) {
  requestApi(url, params, 'GET', sourceObj, successFun, failFun, completeFun)
}

function requestApi(url, params, method, sourceObj, successFun, failFun, completeFun) {
  if (method == 'POST') {
    var contentType = 'application/x-www-form-urlencoded'
  } else {
    var contentType = 'application/json'
  }
  wx.request({
    url: url,
    method: method,
    data: params,
    header: { 'Content-Type': contentType },
    success: function (res) {
      typeof successFun == 'function' && successFun(res.data, sourceObj)
    },
    fail: function (res) {
      typeof failFun == 'function' && failFun(res.data, sourceObj)
    },
    complete: function (res) {
      typeof completeFun == 'function' && completeFun(res.data, sourceObj)
    }
  })
}
module.exports = {
  requestPostApi,
  requestGetApi
}