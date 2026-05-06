import axios from "axios";
import { date } from "quasar";
import { Notify, Loading, QSpinnerIos } from "quasar";

function isObjectEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
async function getRequest(url) {
  if (navigator.onLine) {
    try {
      let data = await axios.get(url);
      return data;
    } catch (error) {
      if (error.toString().includes("Network", 0)) {
        Notify.create({
          message: "Không thể kế nối đến máy chủ !",
          color: "red"
        });
      }
      return null;
    }
  } else {
    Notify.create({
      message: "Không có kết nối Internet !",
      color: "red"
    });
    return null;
  }
}
async function getRequestWithProgressIndicator(url) {
  if (navigator.onLine) {
    Loading.show({
      spinner: QSpinnerIos,
      spinnerSize: "100px"
    });
    try {
      let data = await axios.get(url);
      Loading.hide();
      return data;
    } catch (error) {
      Loading.hide();
      if (error.toString().includes("Network", 0)) {
        Notify.create({
          message: "Không thể kế nối đến máy chủ !",
          color: "red"
        });
      }
      return null;
    }
  } else {
    Notify.create({
      message: "Không có kết nối Internet !",
      color: "red"
    });
    return null;
  }
}
async function postRequest(url, data) {
  if (navigator.onLine) {
    Loading.show({
      spinner: QSpinnerIos,
      spinnerSize: "100px"
    });
    try {
      let response = await axios.post(url, data);
      Loading.hide();
      return response;
    } catch (error) {
      Loading.hide();
      let messageError = JSON.stringify(error.response);
      if (error.toString().includes("Network", 0)) {
        messageError = "Không thể kết nối đến máy chủ";
      }
      if (error.response) {
        if (parseInt(error.response.status) < 500) {
          let errMes = isObjectEmpty(
            error.response.data.meta.messages.message.originalError
          )
            ? error.response.data.meta.messages.message
            : error.response.data.meta.messages.message.originalError.info
                .message;
          Notify.create({
            message: errMes,
            color: "red"
          });
        } else {
          messageError =
            error.response.statusText + " statusCode: " + error.response.status;
          Notify.create({
            message: messageError,
            color: "red"
          });
        }
      } else {
        Notify.create({
          message: messageError,
          color: "red"
        });
      }
      return null;
    }
  } else {
    Notify.create({
      message: "Không có kết nối Internet",
      color: "red"
    });
    return null;
  }
}
async function delRequest(url) {
  if (navigator.onLine) {
    Loading.show({
      spinner:QSpinnerIos,
      spinnerSize:'100px'
    })
    try {
      let response = await axios.delete(url)
      Loading.hide()
      return response
    } catch (error) {
      Loading.hide()
      let messageError = JSON.stringify(error.response)
      if (error.toString().includes('Network', 0)) {
        messageError = 'Không thể kết nối đến máy chủ'
      }
      if (error.response) {
        if (parseInt(error.response.status) < 500) {
          messageError = error.response.data.meta.messages.message + ' statusCode: ' + error.response.status
          Notify.create({
            message: messageError,
            color: 'red'
          })
        } else {
          messageError = error.response.statusText + ' statusCode: ' + error.response.status
          Notify.create({
            message: messageError,
            color: 'red'
          })
        }
      } else {
        Notify.create({
          message: messageError,
          color: 'red'
        })
      }
      return null
    }
  }
  else {
    Notify.create({
      message: 'Không có kết nối Internet',
      color: 'red'
    })
    return null
  }
}
async function putRequest(url, data) {
  if (navigator.onLine) {
    Loading.show({
      spinner: QSpinnerIos,
      spinnerSize: "100px"
    });
    try {
      let response = await axios.put(url, data);
      Loading.hide();
      return response;
    } catch (error) {
      Loading.hide();
      let messageError = JSON.stringify(error.response);
      if (error.toString().includes("Network", 0)) {
        messageError = "Không thể kết nối đến máy chủ";
      }
      if (error.response) {
        if (parseInt(error.response.status) < 500) {
          messageError =
            error.response.data.meta.messages.message +
            " statusCode: " +
            error.response.status;
          Notify.create({
            message: messageError,
            color: "red"
          });
        } else {
          messageError =
            error.response.statusText + " statusCode: " + error.response.status;
          Notify.create({
            message: messageError,
            color: "red"
          });
        }
      } else {
        Notify.create({
          message: messageError,
          color: "red"
        });
      }
      return null;
    }
  } else {
    Notify.create({
      message: "Không có kết nối Internet",
      color: "red"
    });
    return null;
  }
}

const setToken = token => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

function getWeekNumber(inputDate) {
  return date.getWeekOfYear(inputDate);
}

function hierarchySortFunc(a, b) {
  return a.CID > b.CID;
}

function hierarhySort(hashArr, key, result) {
  if (hashArr[key] == undefined) return;
  var arr = hashArr[key].sort(hierarchySortFunc);
  for (var i = 0; i < arr.length; i++) {
    result.push(arr[i]);
    hierarhySort(hashArr, arr[i].CID, result);
  }

  return result;
}

function sortParent(arr) {
  let hashArr = {};
  for (var i = 0; i < arr.length; i++) {
    if (hashArr[arr[i].PARENTID] == undefined) hashArr[arr[i].PARENTID] = [];
    hashArr[arr[i].PARENTID].push(arr[i]);
  }
  let result = hierarhySort(hashArr, 0, []);
  return result;
}

function roundNumber(rnum, rlength) {
  var newnumber =
    Math.round(rnum * Math.pow(10, rlength)) / Math.pow(10, rlength);
  return newnumber;
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function formatDateVN(dateString) {
  let timeStamp = Date.now();
  return date.formatDate(timeStamp, "DD/MM/YYYY");
}

function formatDateOption(dateString, format) {
  let timeStamp = Date.now();
  return date.formatDate(dateString, format);
}

function showLoadingIos(msg) {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: 100,
    spinnerColor: "primary",
    message: msg || "Vui lòng chờ ..."
  });
}

function closeLoading() {
  Loading.hide();
}

function showNotifyValidate(position) {
  Notify.create({
    message: "Vui lòng nhập đầy đủ thông tin !",
    color: "red",
    position: position || "top"
  });
}

function showNotifyError(msg, position) {
  Notify.create({
    message: msg || "Đã xảy ra lỗi !",
    color: "red",
    position: position || "top"
  });
}

function showNotifySuccess(message, position) {
  Notify.create({
    message: message ? message : "Thành công !",
    color: "green",
    position: position || "top"
  });
}
const arrSum = function(arr, keyOfObject) {
  return arr.reduce(function(a, b) {
    return a + b[keyOfObject];
  }, 0);
};
export {
  isObjectEmpty,
  getRequest,
  postRequest,
  delRequest,
  setToken,
  getRequestWithProgressIndicator,
  getWeekNumber,
  putRequest,
  showLoadingIos,
  closeLoading,
  formatDateOption,
  sortParent,
  roundNumber,
  formatNumber,
  formatDateVN,
  showNotifyValidate,
  showNotifySuccess,
  arrSum,
  showNotifyError
};
