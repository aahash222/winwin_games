<template>
  <div class="game-wheel">
    <div class="game-wheel-wrap">

      <div class="game-block">

        <WheelLast :bets="lastBets" />

        <WheelField
          :result="result"
          :run="run"
          :config="configSelect"
          :speed="rotationSpeed"

        />


      </div>

      <WheelBet
        :locked="loader"
        :bet="bet"
        :risk="risk"
        :sectors="sectors"
        :arrayRisks="arrayRisks"
        :arraySectors="arraySectors"
        :errors="errors"
        @sendBet="sendBet"
        @changeBet="changeBet"
        @changeRisk="changeRisk"
        @changeSectors="changeSectors"
      />
    </div>
  </div>
</template>

<script>
import WheelBet from '@/components/games/wheel/WheelBet'
import WheelField from '@/components/games/wheel/WheelField'
import WheelLast from '@/components/games/wheel/WheelLast'
export default {
  name: 'Wheel',
  components: { WheelLast, WheelField, WheelBet },
  data() {
    return {
      run: false,

      loader: false,
      bet: 0.1,
      risk: 'mid',
      sectors: 10,
      rotationSpeed: 3, // 3 sec

      errors: {},
      lastBets: [],

      result: -1,

      config: {},
      configSelect: [],
      arraySectors: [10, 20, 30, 40, 50],
      arrayRisks: ['easy', 'mid', 'hard'],

      loadConfig: false,
    }
  },
  computed: {
    clientSeed: function() {
      return this.$store.getters.getClientSeed
    },
    socketWheel: function() {
      return this.$store.getters.subscribeSocketWheel
    },
    socketWheelBet: function() {
      return this.$store.getters.subscribeSocketWheelBet
    },

  },
  watch: {
    socketWheel: function(value) {
      if (value === null) return
      this.receiveSocketWheel(value)
    },
    socketWheelBet: function(value) {
      if (value === null) return
      this.receiveSocketWheelBet(value)
    }
  },
  created () {
    this.$store.commit('subscribeSocketWheel')
    this.$store.commit('subscribeSocketWheelBet')
  },
  methods: {
    sendBet: function() {
      if (this.loader) return

      this.errors = {}
      this.loader = true

      this.result = -1
      this.run = true

      this.$store.dispatch('sendSocketWheelBet', {
        bet: this.bet,
        risk: this.risk,
        sectors: this.sectors,
        client_seed: this.clientSeed,
      })

      this.$store.dispatch('setClientSeedAfterBet')
    },
    receiveSocketWheel: function(answer) {
      if (answer.status === 'success') {
        //this.rtp = answer.data.rtp
        this.config = answer.data.config
        this.$store.commit('setServerSeedHash', answer.data.server_seed_hash)

        this.configSelect = this.config[this.risk][this.sectors]
      }
      this.loader = false
      this.loadConfig = true
    },
    receiveSocketWheelBet: function(answer) {
      if (answer.status === 'success') {
        this.showWheelResult(answer.data.data.result)

        this.$store.commit('setUserBalance', answer.data.balance)
        this.$store.commit('setServerSeedHash', answer.data.server_seed_hash)

        setTimeout(() => {
          this.addNewLastBet(answer.data.uuid, answer.data.data)
        }, this.rotationSpeed * 1000)
      } else if (answer.status === 'error') {
        this.run = false

        if (answer.type !== undefined) {
          this.errors[answer.type] = answer.message
        } else {
          this.$store.dispatch('notification', { type: 'error', text: answer.message, isClose: false, timer: 2000 }).then()
        }
      }
      this.loader = false
    },
    showWheelResult: function(result, hash) {
      this.result = result
      //this.lastResult = [result, hash]
      this.run = false
    },
    changeBet: function(value) {
      this.bet = value
    },
    changeRisk: function(value) {
      this.risk = value
      this.configSelect = this.config[this.risk][this.sectors]
    },
    changeSectors: function(value) {
      this.sectors = value
      this.configSelect = this.config[this.risk][this.sectors]
    },
    addNewLastBet: function(uuid, value) {
      value.uuid = uuid
      this.lastBets.push(value)
      if (this.lastBets.length > 6) {
        this.lastBets.shift()
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .game-wheel {
    height: 100%;

    .game-wheel-wrap {
      display: flex;
      justify-content: space-between;
      height: 100%;

      .game-block {
        flex: 1;

        background-color: #0C0E1C;
        background-image: url("./../../../assets/games/wheel/background.svg");
        background-size: cover;


      }
    }
  }
</style>
