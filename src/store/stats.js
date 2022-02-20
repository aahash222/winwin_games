const moduleStats = {
  state: {
    stats: {
      limit: 10,
      limitUser: 10,
      transactions: [],
      userTransactions: [],
    }
  },
  getters: {
    getStatsLimit: state => state.stats.limit,
    getStatsTransactions: state => state.stats.transactions,
    getStatsUserTransactions: state => state.stats.userTransactions,
  },
  mutations: {

  },
  actions: {
    statsLoadTransactions ({ state, rootState }, transactions) {
      state.stats.transactions = transactions
    },
    statsAddTransactions ({ state, rootState, rootGetters }, value) {
      if (state.stats.transactions.length >= state.stats.limit) {
        state.stats.transactions.pop()
      }
      state.stats.transactions.unshift(value)

      if (rootGetters.getSession === value.session) {
        if (state.stats.userTransactions.length >= state.stats.limitUser) {
          state.stats.userTransactions.pop()
        }
        state.stats.userTransactions.unshift(value)
      }
    }
  }

}

export default moduleStats
