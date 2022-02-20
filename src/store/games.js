const moduleGames = {
  state: {
    session: null,
    user: {
      balance: 0,
      currency: null,
      avatar: null,
    },
    games: {
      decimal: 0,
      names: { 1: 'Dice', 2: 'Mines', 3: 'Plinko', 4: 'Tower' },
    },
    serverSeedHash: '',
    clientSeed: localStorage.getItem('clientSeed') || null,
    clientSeedMode: localStorage.getItem('clientSeedMode') || 'random',
  },

  getters: {
    getSession: state => state.session,
    getGameDecimal: state => state.games.decimal,
    getGameNames: state => state.games.names,
    getUserBalance: state => state.user.balance,
    getUserCurrency: state => state.user.currency,
    getUserAvatar: state => state.user.avatar,
    getClientSeed: state => state.clientSeed,
    getServerSeedHash: state => state.serverSeedHash,
    isClientSeedRandom: state => state.clientSeedMode === 'random',
  },
  mutations: {
    setSession (state, value) {
      state.session = value
    },
    setGameDecimal (state, value) {
      state.games.decimal = value
    },
    setUserBalance (state, value) {
      state.user.balance = value
    },
    setUserCurrency (state, value) {
      state.user.currency = value
    },
    setUserAvatar (state, value) {
      state.user.avatar = value
    },
    setClientSeed (state, value) {
      state.clientSeed = value
    },
    setServerSeedHash (state, value) {
      state.serverSeedHash = value
    },
    setClientSeedRandom (state) {
      let result = ''
      const length = 32
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const charactersLength = characters.length
      for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength))

      state.clientSeed = result
    },
    setClientSeedMode (state, value) {
      if (value === 'manual') {
        localStorage.setItem('clientSeed', state.clientSeed)
        localStorage.setItem('clientSeedMode', 'manual')
      } else {
        localStorage.removeItem('clientSeed')
        localStorage.setItem('clientSeedMode', 'random')
      }
      state.clientSeedMode = value
    }
  },
  actions: {
    setClientSeedAfterBet: (context) => {
      if (context.getters.isClientSeedRandom === true) {
        context.commit('setClientSeedRandom')
      }
    },
  }
}

export default moduleGames
