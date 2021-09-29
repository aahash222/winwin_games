const moduleStats = {
  state: {
    stats: {
      limit: 20,
    }
  },
  getters: {
    getStatsLimit: state => state.stats.limit,
  }

}

export default moduleStats
