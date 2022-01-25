const moduleNotification = {
  state: {
    notifications: {
      index: 0,
      data: []
    },
  },
  getters: {
    getNotificationData: state => state.notifications.data,
    getNotificationIndex: state => state.notifications.index,
  },
  mutations: {
    notification: (state, data) => state.notifications.data.unshift(data),
    notificationIndex: state => state.notifications.index++,
    closeNotification: (state, index) => {
      for (let i = 0; i < state.notifications.data.length; i++) {
        if (state.notifications.data[i].index === index) {
          state.notifications.data.splice(i, 1)
          i--
        }
      }
    },
  },
  actions: {
    notification: (context, data) => {
      data.index = context.getters.getNotificationIndex + 1
      context.commit('notificationIndex')
      context.commit('notification', data)
      if (data.timer !== false) {
        setTimeout(function () {
          context.commit('closeNotification', data.index)
        }, data.timer)
      }
    },
  }

}

export default moduleNotification
