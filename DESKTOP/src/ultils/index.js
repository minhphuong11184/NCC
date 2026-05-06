import axios from 'axios'
import { date } from 'quasar'
import { Notify,Loading,QSpinnerIos,Dialog } from 'quasar'
import { uuid } from 'uuidv4';
import store from '../store'
function isObjectEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true
}
function generateUUID(){
  return uuid()
}
async function getRequest(url) {
  if (navigator.onLine) {
    try {
      const data = await axios.get(url)
      // console.log(data)
      // console.log(data.meta.messages.message)
      // if (data.meta.messages.message==='Giải mã token không thành công, hoặc mã đã hết hạn') {
      //   showSessionDialog()
      // }
      return data 
    } catch (error) {
      if (error.toString().includes('Network', 0)) {
        Notify.create({
          message: 'Không thể kế nối đến máy chủ !',
          color: 'red'
        })
      }
      return null
    }
  } else {
    Notify.create({
      message: 'Không có kết nối Internet !',
      color: 'red'
    })
    return null
  }
}
async function getRequestWithProgressIndicator(url) {
  if (navigator.onLine) {
    Loading.show({
      spinner:QSpinnerIos,
      spinnerSize:'100px'
    })
    try {
      let data = await axios.get(url)
      Loading.hide()
      return data
    } catch (error) {
      Loading.hide()
      if (error.toString().includes('Network', 0)) {
        Notify.create({
          message: 'Không thể kế nối đến máy chủ !',
          color: 'red'
        })
      }
      return null
    }
  } else {
    Notify.create({
      message: 'Không có kết nối Internet !',
      color: 'red'
    })
    return null
  }
}
async function postRequestWithoutProgress(url, data) {
  let response = {
    data:{
      meta:{
        success:false,
        messages:{
          message:''
        }
      },
      data:[]
    }
  }
  if (navigator.onLine) {
    try {
      response = await axios.post(url, data)
      return response
    } catch (error) {
      if (error.toString().includes('Network', 0)) {
        let messageError = 'Không thể kết nối đến máy chủ'
        response.data.meta.messages.message = messageError
      }
      if (error.response) {
        response.data.meta.messages.message = error?.response?.data?.meta?.messages?.message?.originalError?.info?.message 
        || error?.response?.data?.meta?.messages?.message || error?.response?.data?.meta?.message
      }
    }
  }
  else {
    response.data.meta.messages.message = 'Không có kết nối Internet !'
  }
  return response
}
async function postRequest(url, data) {
  if (navigator.onLine) {
    Loading.show({
      spinner:QSpinnerIos,
      spinnerSize:'100px'
    })
    try {
      let response = await axios.post(url, data)
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
          let errMes = ''
          if (!isObjectEmpty(error.response.data.meta.messages)) {
            if (!isObjectEmpty(error.response.data.meta.messages.message)) {
              if (!isObjectEmpty(error.response.data.meta.messages.message.originalError)) {
                errMes = error.response.data.meta.messages.message.originalError.info.message
              }else{
                errMes = error.response.data.meta.messages.message
              }
            }else{
              errMes = error.response.data.meta.messages.message
            }
          } else {
            errMes = 'Đã xảy ra lỗi '+JSON.stringify(error.response.data.meta)
          }
          // isObjectEmpty(error.response.data.meta.messages.message.originalError) 
          // ? error.response.data.meta.messages.message  : error.response.data.meta.messages.message.originalError.info.message
          Notify.create({
            message: errMes,
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
      spinner:QSpinnerIos,
      spinnerSize:'100px'
    })
    try {
      let response = await axios.put(url, data)
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
function showConfirmDialog(onOk,onCancel,title,message){
  Dialog.create({
    title:title || 'Bạn đã chắc chắn ?',
    message: message || '&@^&*#^!*#^!',
    cancel:true,
    persistent:true,
    ok:'Đồng ý',
    cancel:'Hủy',
    transitionShow:'scale-up',
    transitionHide:'slide-down',

  }).onOk(()=>{
    onOk()
  })
  .onCancel(()=>{
    onCancel()
  })
}
function showSessionDialog(){
  Dialog.create({
    title:'Phiên đăng nhập đã hết hạn',
    message:'Vui lòng đăng nhập lại',
    cancel:false,
    persistent:true,
    ok:'Đồng ý',
    cancel:'Hủy',
    transitionShow:'scale-up',
    transitionHide:'slide-down',

  }).onOk(()=>{
    store.dispatch('base/SET_LOGOUT')
  })
}
function showLoadingIos(msg){
  Loading.show({
    spinner:QSpinnerIos,
    spinnerSize:100,
    spinnerColor:'primary',
    message: msg || 'Vui lòng chờ ...'
  })
}
function closeLoading(){
  Loading.hide()
}
const setToken = (token)=>{
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
const setBaseUrl = (baseURL)=>{
    axios.defaults.baseURL=baseURL
}
function getWeekNumber(inputDate) {
  return  date.getWeekOfYear(inputDate)
}

function randomTo(to){
  return Math.floor(Math.random() * to);
}

function hierarchySortFunc(a,b ) {
  return a.CID > b.CID;
}
function hierarhySort(hashArr, key, result) {

  if (hashArr[key] == undefined) return;
  var arr = hashArr[key].sort(hierarchySortFunc);
  for (var i=0; i<arr.length; i++) {
    result.push(arr[i]);
    hierarhySort(hashArr, arr[i].CID, result);
  }

  return result;
}
const thangs = [
  {name:'Tháng 1',id:1},
  {name:'Tháng 2',id:2},
  {name:'Tháng 3',id:3},
  {name:'Tháng 4',id:4},
  {name:'Tháng 5',id:5},
  {name:'Tháng 6',id:6},
  {name:'Tháng 7',id:7},
  {name:'Tháng 8',id:8},
  {name:'Tháng 9',id:9},
  {name:'Tháng 10',id:10},
  {name:'Tháng 11',id:11},
  {name:'Tháng 12',id:12},
]
const nams=[
  {name:'2019',id:2019},
  {name:'2020',id:2020},
  {name:'2021',id:2021},
  {name:'2022',id:2022},
  {name:'2023',id:2023},
  {name:'2024',id:2024},
  {name:'2025',id:2025},
]
function sortParent(arr){
  let hashArr = {};
  for (var i=0; i<arr.length; i++) {
    if (hashArr[arr[i].PARENTID] == undefined) hashArr[arr[i].PARENTID] = [];
    hashArr[arr[i].PARENTID].push(arr[i]);
  }
  let result = hierarhySort(hashArr, 0, []);
  return result
}
function roundNumber(rnum, rlength) {
  var newnumber = Math.round(rnum*Math.pow(10,rlength))/Math.pow(10,rlength);
    return newnumber; 
}
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
function formatDateVN(dateString){
  return date.formatDate(dateString, 'DD/MM/YYYY')
}
function formatDateAny(dateString,format){
  return date.formatDate(dateString,format)
}
function formatDateISO(dateString){
  return date.formatDate(dateString, 'YYYY-MM-DD')
}
function getFisrtDayOfMonth(dateString){
  const today = new Date()
  return date.startOfDate(today,'month')
}
function showNotifyValidate(){
  Notify.create({
    message:'Vui lòng nhập đầy đủ thông tin !',
    color:'red'
  })
}
function showNotifySuccess(message){
  Notify.create({
    message: message ? message : 'Thành công !',
    color:'green'
  })
}
function showNotifyError(message){
  Notify.create({
    message: message ? message : 'Đã xảy ra lỗi #9999 !',
    color:'red'
  })
}
const arrSum = function(arr,keyOfObject){
  return arr.reduce(function(a,b){
    return a + b[keyOfObject]
  }, 0);
}
function list_to_tree(list) {
  var map = {}, node, roots = [], i;
  for (let i = 0; i < list.length; i += 1) {
      map[list[i].id] = i; // initialize the map
      list[i].items = []; // initialize the children
  }
  for (let i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parentId !== null) {
          // if you have dangling branches check that map[node.parentId] exists
          list[map[node.parentId]].items.push(node);
      } else {
          roots.push(node);
      }
  }
  return roots
}
function formatDateTimeVN(dateTime){
  let formatVN;
  if(dateTime != null){
    const dayTime = dateTime.split("-")[2]
    const month = dateTime.split("-")[1]
    const year = dateTime.split("-")[0]
    const day = dayTime.split("T")[0]
    const time = dayTime.split("T")[1]
    const hour = time.split(":")[0]
    const minute = time.split(":")[1]
    const second = time.split(":")[2].split('.')[0]
    formatVN = `${day}/${month}/${year}`+" "+ (time == '00:00:00.000Z' ? '':`${hour}:${minute}:${second}`)
  }else{
    formatVN = ''
  }
  return formatVN
}
function formatDateVNTD(dateTime){
  let formatVN;
  if(dateTime != null){
    const dayTime = dateTime.split("-")[2]
    const month = dateTime.split("-")[1]
    const year = dateTime.split("-")[0]
    const day = dayTime.split("T")[0]
    const time = dayTime.split("T")[1]
    formatVN = `${year}-${month}-${day}`+" "
  }else{
    formatVN = ''
  }
  return formatVN
}
export {list_to_tree, isObjectEmpty,getRequest,postRequest,setToken,getRequestWithProgressIndicator
   ,getWeekNumber,putRequest,sortParent,roundNumber,formatNumber,formatDateVN,showNotifyValidate,showNotifySuccess,arrSum,setBaseUrl,
   delRequest,generateUUID,showNotifyError,formatDateISO,getFisrtDayOfMonth,formatDateAny,thangs,nams,showLoadingIos,closeLoading,
   showConfirmDialog,randomTo,postRequestWithoutProgress,formatDateTimeVN,formatDateVNTD}