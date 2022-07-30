import main from '../main'

const moduleSocket = {
  state: {
    socket: {
      address: '',
      // Connection Status
      isConnected: false,
      isAuthSocket: false,
      isClosed: false,
      isReload: false,

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
        server_seed_next: null,

        dice: null,
        dice_bet: null,

        mines: null,
        mines_bet: null,
        mines_select: null,
        mines_cashout: null,

        plinko: null,
        plinko_bet: null,

        tower: null,
        tower_bet: null,
        tower_select: null,
        tower_cashout: null,

        wheel: null,
        wheel_bet: null,

        roulette: null,
        roulette_bet: null,
      }
    }
  },
  getters: {
    getSocketConnected: state => state.socket.isConnected,
    getSocketClosed: state => state.socket.isClosed,
    getSocketPing: state => state.socket.socketPing,

    subscribeSocketSession: state => state.socket.subscribes.session,
    subscribeSocketServerSeedNext: state => state.socket.subscribes.server_seed_next,

    subscribeSocketDice: state => state.socket.subscribes.dice,
    subscribeSocketDiceBet: state => state.socket.subscribes.dice_bet,

    subscribeSocketMines: state => state.socket.subscribes.mines,
    subscribeSocketMinesBet: state => state.socket.subscribes.mines_bet,
    subscribeSocketMinesSelect: state => state.socket.subscribes.mines_select,
    subscribeSocketMinesCashout: state => state.socket.subscribes.mines_cashout,

    subscribeSocketPlinko: state => state.socket.subscribes.plinko,
    subscribeSocketPlinkoBet: state => state.socket.subscribes.plinko_bet,

    subscribeSocketTower: state => state.socket.subscribes.tower,
    subscribeSocketTowerBet: state => state.socket.subscribes.tower_bet,
    subscribeSocketTowerSelect: state => state.socket.subscribes.tower_select,
    subscribeSocketTowerCashout: state => state.socket.subscribes.tower_cashout,

    subscribeSocketWheel: state => state.socket.subscribes.wheel,
    subscribeSocketWheelBet: state => state.socket.subscribes.wheel_bet,

    subscribeSocketRoulette: state => state.socket.subscribes.roulette,
    subscribeSocketRouletteBet: state => state.socket.subscribes.roulette_bet,
  },
  actions: {
    socketConnect: (context) => {
      console.log('connecting to socket by code: ', context.state.socket.address)
      main.config.globalProperties.$connect(context.state.socket.address)
    },
    socketDisconnect: (context) => {
      context.commit('SOCKET_disconnect', true)
    },

    sendSocketSession: (context, session) => {
      const data = { session: session, time: (new Date()).getTime() }
      context.commit('socketSend', { action: 'session', data: data })
    },

    sendSocketServerSeedNext: (context) => { context.commit('socketSend', { action: 'server_seed_next' }) },

    sendSocketDiceBet: (context, data) => { context.commit('socketSend', { action: 'dice_bet', data: data }) },

    sendSocketMinesBet: (context, data) => { context.commit('socketSend', { action: 'mines_bet', data: data }) },
    sendSocketMinesSelect: (context, data) => { context.commit('socketSend', { action: 'mines_select', data: data }) },
    sendSocketMinesCashout: (context, data) => { context.commit('socketSend', { action: 'mines_cashout', data: data }) },

    sendSocketPlinkoBet: (context, data) => { context.commit('socketSend', { action: 'plinko_bet', data: data }) },

    sendSocketTowerBet: (context, data) => { context.commit('socketSend', { action: 'tower_bet', data: data }) },
    sendSocketTowerSelect: (context, data) => { context.commit('socketSend', { action: 'tower_select', data: data }) },
    sendSocketTowerCashout: (context, data) => { context.commit('socketSend', { action: 'tower_cashout', data: data }) },

    sendSocketWheelBet: (context, data) => { context.commit('socketSend', { action: 'wheel_bet', data: data }) },

    sendSocketRouletteBet: (context, data) => { context.commit('socketSend', { action: 'roulette_bet', data: data }) },

    sendSocketPong: (context) => {
      context.commit('socketSend', { action: 'pong', data: null })
    },

    socket_ping: (context, data) => {
      context.commit('socketSetPing', data)
      context.commit('socketActive')
      context.dispatch('sendSocketPong').then()
    },

  },

  mutations: {
    socketSend: (state, { action, data }) => {
      if (action !== 'pong') console.log('send to socket ', action)
      main.config.globalProperties.$socket.sendObj({ action: action, data: data })
    },
    socketSetAddress: (state, game) => {
      switch (game) {
        case 'Dice':
          state.socket.address = process.env.VUE_APP_WS_DICE
          break
        case 'Mines':
          state.socket.address = process.env.VUE_APP_WS_MINES
          break
        case 'Plinko':
          state.socket.address = process.env.VUE_APP_WS_PLINKO
          break
        case 'Tower':
          state.socket.address = process.env.VUE_APP_WS_TOWER
          break
        case 'Wheel':
          state.socket.address = process.env.VUE_APP_WS_WHEEL
          break
        case 'Roulette':
          state.socket.address = process.env.VUE_APP_WS_ROULETTE
          break
        case 'Hilo':
          state.socket.address = process.env.VUE_APP_WS_HILO
          break
      }
      console.log('set socket address: ', game, state.socket.address)
    },
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

    socketSetAuth: state => { state.socket.isAuthSocket = true },

    subscribeSocketSession: state => { state.socket.subscribes.session = null },
    subscribeSocketServerSeedNext: state => { state.socket.subscribes.server_seed_next = null },

    subscribeSocketDice: state => { state.socket.subscribes.dice = null },
    subscribeSocketDiceBet: state => { state.socket.subscribes.dice_bet = null },

    subscribeSocketMines: state => { state.socket.subscribes.mines = null },
    subscribeSocketMinesBet: state => { state.socket.subscribes.mines_bet = null },
    subscribeSocketMinesSelect: state => { state.socket.subscribes.mines_select = null },
    subscribeSocketMinesCashout: state => { state.socket.subscribes.mines_cashout = null },

    subscribeSocketPlinko: state => { state.socket.subscribes.plinko = null },
    subscribeSocketPlinkoBet: state => { state.socket.subscribes.plinko_bet = null },

    subscribeSocketTower: state => { state.socket.subscribes.tower = null },
    subscribeSocketTowerBet: state => { state.socket.subscribes.tower_bet = null },
    subscribeSocketTowerSelect: state => { state.socket.subscribes.tower_select = null },
    subscribeSocketTowerCashout: state => { state.socket.subscribes.tower_cashout = null },

    subscribeSocketWheel: state => { state.socket.subscribes.wheel = null },
    subscribeSocketWheelBet: state => { state.socket.subscribes.wheel_bet = null },

    subscribeSocketRoulette: state => { state.socket.subscribes.roulette = null },
    subscribeSocketRouletteBet: state => { state.socket.subscribes.roulette_bet = null },

    SOCKET_session (state, data) { state.socket.subscribes.session = data },
    SOCKET_server_seed_next (state, data) { state.socket.subscribes.server_seed_next = data },

    SOCKET_dice (state, data) { state.socket.subscribes.dice = data },
    SOCKET_dice_bet (state, data) { state.socket.subscribes.dice_bet = data },

    SOCKET_mines (state, data) { state.socket.subscribes.mines = data },
    SOCKET_mines_bet (state, data) { state.socket.subscribes.mines_bet = data },
    SOCKET_mines_select (state, data) { state.socket.subscribes.mines_select = data },
    SOCKET_mines_cashout (state, data) { state.socket.subscribes.mines_cashout = data },

    SOCKET_plinko (state, data) { state.socket.subscribes.plinko = data },
    SOCKET_plinko_bet (state, data) { state.socket.subscribes.plinko_bet = data },

    SOCKET_tower (state, data) { state.socket.subscribes.tower = data },
    SOCKET_tower_bet (state, data) { state.socket.subscribes.tower_bet = data },
    SOCKET_tower_select (state, data) { state.socket.subscribes.tower_select = data },
    SOCKET_tower_cashout (state, data) { state.socket.subscribes.tower_cashout = data },

    SOCKET_wheel (state, data) { state.socket.subscribes.wheel = data },
    SOCKET_wheel_bet (state, data) { state.socket.subscribes.wheel_bet = data },

    SOCKET_roulette (state, data) { state.socket.subscribes.roulette = data },
    SOCKET_roulette_bet (state, data) { state.socket.subscribes.roulette_bet = data },

    SOCKET_disconnect (state, reload) {
      clearTimeout(state.socket.socketTimeout)
      state.socket.isAuthSocket = false
      state.socket.isConnected = false
      if (reload === true) {
        state.socket.isReload = true
      } else {
        state.socket.isClosed = true
      }

      main.config.globalProperties.$disconnect()
    },
    SOCKET_ONOPEN (state, event) {
      console.info('socket open ', event.currentTarget.url)
      main.config.globalProperties.$socket = event.currentTarget

      state.socket.isAuthSocket = false
      state.socket.isConnected = true

      //state.socket.isReload = false
      state.socket.isClosed = false

      clearTimeout(state.socket.socketTimeout)

      state.socket.socketTimeout = setTimeout(() => {
        main.config.globalProperties.$disconnect()

        console.log('socket no ping after connect')
      }, 35000)
    },
    SOCKET_ONCLOSE (state, event) {
      if (state.socket.isClosed) return
      if (state.socket.isReload) {
        state.socket.isReload = false
        return
      }

      console.log('socket closed ', event)
      clearTimeout(state.socket.socketTimeout)

      state.socket.isAuthSocket = false
      state.socket.isConnected = false

      setTimeout(() => {
        if (state.socket.isConnected) return

        console.log('connecting to socket by disconnect')
        main.config.globalProperties.$connect(state.socket.address)
      }, 3000)
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
