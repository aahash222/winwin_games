import { createStore } from 'vuex'
import moduleSocket from '@/store/socket'
import moduleGames from '@/store/games'
import moduleStats from '@/store/stats'
import moduleNotification from '@/store/notification'
import moduleMenu from '@/store/menu'

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
    moduleNotification,
    moduleMenu,
  }
})
