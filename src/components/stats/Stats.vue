<template>
  <div class="stats">

    <div v-if="loader">loading...</div>
    <div v-else>

      <StatsLine :transactions="transactions" />
    </div>

  </div>
</template>

<script>
import StatsLine from '@/components/stats/StatsLine'
export default {
  name: 'Stats',
  components: { StatsLine },
  data () {
    return {
      loader: true,
      connection: null,
      transactions: [],
    }
  },
  computed: {
    statsLimit: function() {
      return this.$store.getters.getStatsLimit
    }
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
      //console.log(value.length)
      this.transactions = value
    },
    addLogTransaction: function(value) {
      if (this.transactions.length >= this.statsLimit) {
        this.transactions.pop()
      }
      this.transactions.unshift(value)
    }
  }
}
</script>

<style lang="scss" scoped>
  .stats {
    //margin: 5px 0;
  }
</style>
