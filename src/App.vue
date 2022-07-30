<template>
  <div class="error-wrap" v-if="errorMessage">
    <div class="error-message">{{ errorMessage }}</div>
  </div>
  <div class="main-loader" v-if="mainLoader">
    <div class="main-loader-data">loading...</div>
  </div>

  <Notifications />

  <NavTop />

  <Bet v-if="$store.getters.isModalBet" />

  <div class="game-layout" :class="{ blurred: $store.getters.isModalBet }">
    <router-view/>

    <GameDown />
  </div>

</template>

<script>
import NavTop from '@/components/navigation/NavTop'
import GameDown from '@/components/navigation/GameDown'
import Notifications from '@/components/Notifications'
import Bet from '@/components/stats/Bet'
export default {
  name: 'App',
  components: { Bet, Notifications, GameDown, NavTop },
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

    //const timeStart = new Date().getTime()


    const unwatch = this.$watch(
      () => this.$route,
      (route, prevRoute) => {
        //console.log(new Date().getTime() - timeStart)

        this.$store.commit('socketSetAddress', this.$route.name)
        this.$store.dispatch('socketConnect')
        this.$store.dispatch('setClientSeedAfterBet')
        this.firstLoad = false
        unwatch()
      })
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
        this.$store.commit('setSession', this.session)
        this.$store.commit('setGameDecimal', value.data.decimal)
        this.$store.commit('setUserBalance', value.data.balance)
        this.$store.commit('setUserCurrency', value.data.currency)

        this.$store.commit('setUserAvatar', value.data.avatar !== undefined ? value.data.avatar : this.session)

        this.$store.commit('socketSetAuth')
      }
      this.mainLoader = false
    }
  }
}
</script>
<style lang="scss" src="@/assets/styles/main.scss" />
<style lang="scss" src="@/assets/styles/inputs.scss" />
<style lang="scss" src="@/assets/styles/bet-block.scss" />
