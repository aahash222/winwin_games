import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'
import VueNativeSock from 'vue-native-websocket-vue3'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(VueAxios, axios)
app.use(VueNativeSock, 'wss://127.0.0.1', {
  store: store,
  format: 'json',
  connectManually: true,

  passToStoreHandler: function (eventName, event) {
    // console.log('event', event)
    if (!eventName.startsWith('SOCKET_')) { return }
    const target = eventName.toUpperCase()
    let msg = event

    if (this.format === 'json' && event.data) {
      msg = JSON.parse(event.data)
      if (msg.action) {

        if ('socket_' + msg.action in this.store._actions) {
          this.store.dispatch('socket_' + msg.action, msg.data).then()
          return
        }

        if ('SOCKET_' + msg.action in this.store._mutations) {
          this.store.commit('SOCKET_' + msg.action, msg.data)
          return
        }
      }
    }

    this.store.commit(target, msg)
  }
})

app.mount('#app')

export default app
