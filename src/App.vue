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
      firstLoad: true,
    }
  },
  computed: {
    sessionSocket: function() {
      return this.$store.getters.subscribeSocketSession
    },
    connectedSocket: function() {
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
    connectedSocket: function(value) {
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
    },
    $route: function(value) {
      if (this.firstLoad) return
      this.changeGame(value)
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

    this.mainLoader = false

    setTimeout(() => {
      this.$store.commit('socketSetAddress', this.$route.name)
      this.$store.dispatch('socketConnect')
      this.firstLoad = false
    }, 1)
  },
  methods: {
    changeGame: function(data) {
      console.log('Change game to ', this.$route.name)

      this.$store.dispatch('socketDisconnect').then(() => {
        this.$store.commit('socketSetAddress', this.$route.name)
        this.$store.dispatch('socketConnect')
      })
    },
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

        this.$store.commit('socketSetAuth')
      }
      this.mainLoader = false
    }
  }
}
</script>
<style lang="scss" src="@/assets/styles/bet-block.scss" />
<style lang="scss">
  //@import url('https://fonts.cdnfonts.com/css/bahnschrift');

  @font-face {
    font-family: 'GolosUIWebBold';
    src:
      url('/static/fonts/Golos-UI_Bold.woff2') format('woff2'),
      url('/static/fonts/Golos-UI_Bold.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'Muller';
    src: local('Muller Bold'), local('Muller-Bold'),
    url('/static/fonts/MullerBold.woff2') format('woff2'),
    url('/static/fonts/MullerBold.woff') format('woff'),
    url('/static/fonts/MullerBold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
  }

  html, body {
    padding: 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
  }
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #FFF;
    background-color: #131525;
    height: 100%;

    display: flex;
    flex-direction: column;
  }

  #app, input, button {
    font-family: 'GolosUIWebBold', 'Roboto', Arial, sans-serif;
    font-weight: 600;
  }
  button, a {
    transition: .3s ease;
  }
  button {
    outline: none;
    border: 0;
  }
  .game-layout {
    //margin: 40px 10% 0 10%;
    //background-color: #080911;
    //border: 1px solid #1A1D33;
    //border-radius: 8px;
    height: 100%;
    display: flex;
    flex-direction: column;
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
