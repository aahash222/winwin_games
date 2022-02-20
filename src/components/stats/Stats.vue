<template>
  <div class="stats">

    <div v-if="loader">loading...</div>
    <div v-else class="stats-wrap">

      <StatsLine
        @click="openList = true"
        class="stats-line-block"
      />

      <transition name="slide-fade">
        <StatsList
          id="statsList"
          v-if="openList"
          @close="openList = false"
        />
      </transition>
    </div>

  </div>
</template>

<script>
import StatsLine from '@/components/stats/StatsLine'
import StatsList from '@/components/stats/StatsList'
export default {
  name: 'Stats',
  components: { StatsList, StatsLine },
  data () {
    return {
      loader: true,
      openList: false,
      connection: null,
    }
  },
  computed: {
    statsLimit: function() {
      return this.$store.getters.getStatsLimit
    },
    transaction: function() {
      return this.$store.getters.getStatsTransactions
    }
  },
  watch: {
    openList: function(value) {
      if (value === true) {
        setTimeout(() => {
          window.addEventListener('click', this.statsListClick)
        }, 10)
      } else {
        window.removeEventListener('click', this.statsListClick)
      }
    }
  },
  beforeUnmount () {
    window.removeEventListener('click', this.statsListClick)
  },
  created () {
    this.connectStatsServer()
  },
  methods: {
    connectStatsServer: function() {
      this.loader = true
      this.connection = new WebSocket(process.env.VUE_APP_WS_STATS)

      this.connection.onmessage = (event) => {
        const message = JSON.parse(event.data)

        switch (message.action) {
          case 'load':
            this.loadTransactions(message.data)
            break
          case 'log':
            this.addLogTransaction(message.data)
            break
          case 'ping':
            this.sendStatsPong()
            break
          default:
            console.log('Stats server message: ', message)
        }
      }

      this.connection.onopen = () => {
        // console.log(event)
        console.log('Successfully connected to Stats server...')
        this.loader = false
      }

      this.connection.onclose = () => {
        console.log('Disconnected from Stats server...')
        setTimeout(() => {
          console.info('Reconnect to Stats server...')
          this.connectStatsServer()
        }, 1000)
      }

      this.connection.onerror = (event) => {
        console.error('Error connect to Stats server...', event)
      }
    },
    sendStatsPong: function() {
      this.connection.send(JSON.stringify({ action: 'pong' }))
    },
    loadTransactions: function(value) {
      this.$store.dispatch('statsLoadTransactions', value.reverse())
    },
    addLogTransaction: function(value) {
      this.$store.dispatch('statsAddTransactions', value)
    },
    statsListClick: function(e) {
      const menu = document.getElementById('statsList')
      if (menu.contains(e.target) === false) {
        this.openList = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .stats {
    //margin: 5px 0;

    .slide-fade-enter-active {
      transition: all 0.3s ease-out;
    }

    .slide-fade-leave-active {
      transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
      transform: translateY(100%);
      opacity: 0;
    }

    .stats-wrap {
      position: relative;

      .stats-line-block {
        cursor: pointer;
      }
    }
  }
</style>
