import { createStore } from 'vuex'
import moduleSocket from '@/store/socket'
import moduleGames from '@/store/games'
import moduleStats from '@/store/stats'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    moduleSocket,
    moduleGames,
    moduleStats,
  }
})
