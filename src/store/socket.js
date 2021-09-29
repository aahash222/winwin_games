import main from '../main'

const moduleSocket = {
  state: {
    socket: {
      // Connection Status
      isConnected: false,
      isAuthSocket: false,
      isClosed: false,

      // Reconnect error
      reconnectError: false,
      // Heartbeat message sending time
      heartBeatInterval: 5000,

      // Heartbeat timer
      heartBeatTimer: 0,

      socketTimeout: null,
      socketPingTimer: 0,
      socketPing: 0,

      subscribes: {
        session: null,
        dice: null,
      }
    }
  },
  getters: {
    getSocketConnected: state => state.socket.isConnected,
    getSocketClosed: state => state.socket.isClosed,
    getSocketPing: state => state.socket.socketPing,

    subscribeSocketSession: state => state.socket.subscribes.session,
    subscribeSocketDice: state => state.socket.subscribes.dice,
  },
  actions: {
    socketConnect: () => {
      main.config.globalProperties.$connect()
    },

    sendSocketSession: (context, session) => {
      main.config.globalProperties.$socket.sendObj({ action: 'session', data: { session: session, time: (new Date()).getTime() } })
    },
    sendSocketDice: (context, data) => {
      main.config.globalProperties.$socket.sendObj({ action: 'dice', data: data })
    },
    sendSocketPong: () => {
      main.config.globalProperties.$socket.sendObj({ action: 'pong' })
    },

    socket_ping: (context, data) => {
      context.commit('socketSetPing', data)
      context.commit('socketActive')
      context.dispatch('sendSocketPong').then()
    },

  },

  mutations: {
    socketSetPing: (state, value) => {
      state.socket.socketPing = (new Date().getTime()) - value
    },
    socketActive: (state) => {
      clearTimeout(state.socket.socketTimeout)

      state.socket.socketTimeout = setTimeout(() => {
        main.config.globalProperties.$disconnect()

        console.log('socket no ping')
      }, 35000)
    },

    subscribeSocketSession: state => { state.socket.subscribes.session = null },
    subscribeSocketDice: state => { state.socket.subscribes.dice = null },

    SOCKET_session (state, data) {
      state.socket.subscribes.session = data
    },
    SOCKET_dice (state, data) {
      state.socket.subscribes.dice = data
    },
    SOCKET_disconnect (state) {
      clearTimeout(state.socket.socketTimeout)
      state.socket.isAuthSocket = false
      state.socket.isConnected = false
      state.socket.isClosed = true

      main.config.globalProperties.$disconnect()
    },
    SOCKET_ONOPEN (state, event) {
      console.info('socket open')
      main.config.globalProperties.$socket = event.currentTarget

      state.socket.isAuthSocket = false
      state.socket.isConnected = true

      clearTimeout(state.socket.socketTimeout)

      state.socket.socketTimeout = setTimeout(() => {
        main.config.globalProperties.$disconnect()

        console.log('socket no ping after connect')
      }, 35000)
    },
    SOCKET_ONCLOSE (state, event) {
      console.log('socket closed ', event)
      if (state.socket.isClosed) return
      clearTimeout(state.socket.socketTimeout)

      state.socket.isAuthSocket = false
      state.socket.isConnected = false

      setTimeout(() => main.config.globalProperties.$connect(), 3000)
    },
    SOCKET_ONERROR (state, event) {
      console.error('socket server error ', event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message) {
      console.log('socket message ', message)
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT (state, count) {
      console.info('socket reconnect ', count)
    },
    SOCKET_RECONNECT_ERROR () {
      console.log('socket reconnect error')
    },
  },

}
export default moduleSocket
