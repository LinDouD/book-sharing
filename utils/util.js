const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const current = date => {
  var nowTime = new Date()
  var nowTimeYear = nowTime.getFullYear()
  var nowTimeMonth = nowTime.getMonth() + 1
  var nowTimeDay = nowTime.getDate()
  var pre = date.split(' ')
  const year = pre[0].split('-')[0]
  const month = pre[0].split('-')[1]
  const day = pre[0].split('-')[2]
  const hour = pre[1].split(':')[0]
  const minute = pre[1].split(':')[1]

  if (nowTimeYear == year && nowTimeMonth == month && nowTimeDay == day) {
    return [hour, minute].map(formatNumber).join(':')
  } else {
    return [month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
  }


}

const lcurrent = date => {
  var nowTime = new Date()
  var nowTimeYear = nowTime.getFullYear()
  var nowTimeMonth = nowTime.getMonth() + 1
  var nowTimeDay = nowTime.getDate()

  var pre = date.split('.')[0].split('T')
  const year = pre[0].split('-')[0]
  const month = pre[0].split('-')[1]
  const day = pre[0].split('-')[2]
  const hour = pre[1].split(':')[0]
  const minute = pre[1].split(':')[1]

  if (nowTimeYear == year && nowTimeMonth == month && nowTimeDay == day) {
    return [hour, minute].map(formatNumber).join(':')
  } else if (nowTimeYear == year){
    return [month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
  }else{
    [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }


}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTimen(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  current: current,
  lcurrent: lcurrent,
  formatTimen: formatTimen
}
