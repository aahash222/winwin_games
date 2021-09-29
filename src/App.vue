<template>
  <div class="error-wrap" v-if="errorMessage">
    <div class="error-message">{{ errorMessage }}</div>
  </div>
  <div class="main-loader" v-if="mainLoader">
    <div class="main-loader-data">loading...</div>
  </div>

  <NavTop />

  <div class="game-layout">
    <router-view/>

    <GameDown />
  </div>

</template>

<script>
import NavTop from '@/components/navigation/NavTop'
import GameDown from '@/components/navigation/GameDown'
export default {
  name: 'App',
  components: { GameDown, NavTop },
  data () {
    return {
      mainLoader: true,
      errorMessage: null,
      demo: false,
      session: null,
      language: null,
      returnUrl: null,
      depositUrl: null,
    }
  },
  computed: {
    sessionSocket: function() {
      return this.$store.getters.subscribeSocketSession
    },
    connectSocket: function() {
      return this.$store.getters.getSocketConnected
    },
    closedSocket: function() {
      return this.$store.getters.getSocketClosed
    }
  },
  watch: {
    sessionSocket: function(value) {
      this.receiveSession(value)


    },
    connectSocket: function(value) {
      if (value === true) {
        this.$store.dispatch('sendSocketSession', this.session)
      } else {
        this.mainLoader = true
      }
    },
    closedSocket: function(value) {
      if (value === true) {
        this.errorMessage = 'Connection closed by server'
      }
    }
  },
  created () {
    // this.$store.commit('subscribeSocketSession')

    this.session = this.findGetParameter('session')
    this.demo = this.findGetParameter('demo') === 'true'
    this.language = this.findGetParameter('lang')
    this.returnUrl = this.findGetParameter('return')
    this.depositUrl = this.findGetParameter('deposit')

    this.checkRouteData()
    if (this.errorMessage !== null) return

    console.log('ok')

    this.mainLoader = false

    setTimeout(() => {
      this.$store.dispatch('socketConnect')
    }, 1)
  },
  methods: {
    findGetParameter: function(parameterName) {
      let result = null
      let tmp = []
      location.search
        .substr(1)
        .split('&')
        .forEach(function (item) {
          tmp = item.split('=')
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1])
        })
      return result
    },
    checkRouteData: function() {
      if (this.session === null || this.session.length === 0) {
        this.errorMessage = 'Not enough data to start the game: session'
      }
      if (this.language === null || this.language === 0) {
        this.errorMessage = 'Not enough data to start the game: language'
      }
      if (this.returnUrl === null || this.returnUrl.length === 0) {
        this.errorMessage = 'Not enough data to start the game: return url'
      }
      if (this.demo !== true && (this.depositUrl === null || this.depositUrl.length === 0)) {
        this.errorMessage = 'Not enough data to start the game: deposit url'
      }
    },
    loadSession: function(session) {
      this.axios.post(process.env.VUE_APP_API_PROVIDER + '/session', { session: session })
        .then(response => {
          if (response.data.status === 'success') {
            this.mainLoader = false
          } else {
            this.errorMessage = 'Error load game:' + response.data.message
          }
        })
        .catch(() => {
          this.errorMessage = 'Error load game'
        })
    },
    receiveSession: function(value) {
      if (value.status === 'error') {
        this.errorMessage = value.message
      } else {

        this.$store.commit('setGameDecimal', value.data.decimal)
        this.$store.commit('setUserBalance', value.data.balance)
        this.$store.commit('setUserCurrency', value.data.currency)
      }
      this.mainLoader = false
    }
  }
}
</script>
<style lang="scss" src="@/assets/styles/bet-block.scss" />
<style lang="scss">
  html, body {
    padding: 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #FFF;
    background-color: #0d0e19;
    height: 100%;
  }

  .game-layout {
    margin: 40px 10% 0 10%;
    background-color: #0c0e1c;
    border: 1px solid #3e447c;
    border-radius: 8px;
  }

  .error-wrap {
    position: absolute;
    background-color: #2c3e50;
    z-index: 99999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    //display: flex;
    //justify-content: center;
    //align-items: center;
    color: #fff;
    .error-message {
      display: inline-flex;
      background-color: black;
      padding: 10px 20px;
      border-radius: 6px;
      margin: 20px auto;
    }
  }
  .main-loader {
    position: absolute;
    background-color: #2c3e50;
    z-index: 9999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
