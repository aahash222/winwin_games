export default {

  methods: {
    printTimeFull: function(value) {
      if (!value) return 'none'
      if (String(value).length === 13) {
        value = Math.round(value / 1000)
      }
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const date = new Date(value * 1000)
      const year = date.getFullYear()
      const month = date.getMonth()
      let day = date.getDate()
      let hour = date.getHours()
      let minute = date.getMinutes()
      if (day < 10) day = '0' + day
      if (hour < 10) hour = '0' + hour
      if (minute < 10) minute = '0' + minute

      return day + ' ' + monthNames[month] + ' ' + year + ' ' + hour + ':' + minute
    }
  }
}
