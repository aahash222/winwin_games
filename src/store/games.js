const moduleGames = {
  state: {
    user: {
      balance: 0,
      currency: null,
    },
    games: {
      decimal: 0,
      names: { 1: 'Dice' },
    }
  },

  getters: {
    getGameDecimal: state => state.games.decimal,
    getUserBalance: state => state.user.balance,
    getUserCurrency: state => state.user.currency
  },
  mutations: {
    setGameDecimal (state, value) {
      state.games.decimal = value
    },
    setUserBalance (state, value) {
      state.user.balance = value
    },
    setUserCurrency (state, value) {
      state.user.currency = value
    }

  }
}

export default moduleGames
