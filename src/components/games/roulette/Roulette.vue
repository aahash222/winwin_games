<template>
  <div class="game-roulette">

    <div class="game-roulette-wrap">

      <div class="game-block">

        <RouletteLast
          :bets="lastBets"
        />

        <RouletteWheel
          :result="result"
          :run="running"
          :speed="rotationSpeed"
        />

        <RouletteField
          :result="resultAfter"
          :chip="selectChip"
          :chip-amount="selectChipAmount"
          :chip-variants="chipVariants"
          @update="updateBet"
        />

      </div>

      <RouletteBet
        :locked="loader"
        :errors="errors"
        :total-bet="totalBet"
        :chip-variants="chipVariants"
        @select="changeSelectChip"
        @send="sendBet"
      />

    </div>

  </div>
</template>

<script>
import RouletteBet from '@/components/games/roulette/RouletteBet'
import RouletteWheel from '@/components/games/roulette/RouletteWheel'
import RouletteField from '@/components/games/roulette/RouletteField'
import RouletteLast from '@/components/games/roulette/RouletteLast'
import lastBets from '@/mixins/last-bets'
export default {
  name: 'Roulette',
  components: { RouletteLast, RouletteField, RouletteWheel, RouletteBet },
  mixins: [lastBets],
  data() {
    return {
      loader: false,
      rotationSpeed: 3, // 3 sec
      errors: {},

      selectChips: {},
      selectChip: 0,
      //selectChipAmount: 0.00000001,

      totalBet: 0,

      result: -1,
      resultAfter: -1,
      running: false,

    }
  },
  computed: {
    clientSeed: function() {
      return this.$store.getters.getClientSeed
    },
    socketRoulette: function() {
      return this.$store.getters.subscribeSocketRoulette
    },
    socketRouletteBet: function() {
      return this.$store.getters.subscribeSocketRouletteBet
    },
    decimal: function() {
      return this.$store.getters.getGameDecimal
    },
    chipVariants: function() {
      const ret = []
      for (let i = 0; i < 10; i++) {
        ret.push(1 / Math.pow(10, this.decimal) * Math.pow(10, i))
      }

      return ret
    },
    selectChipAmount: function() {
      return this.chipVariants[this.selectChip]
    }
  },
  watch: {
    socketRoulette: function(value) {
      if (value === null) return
      this.receiveSocketRoulette(value)
    },
    socketRouletteBet: function(value) {
      if (value === null) return
      this.receiveSocketRouletteBet(value)
    }
  },
  created () {
    this.$store.commit('subscribeSocketRoulette')
    this.$store.commit('subscribeSocketRouletteBet')
  },
  methods: {
    sendBet: function() {
      if (this.loader) return

      this.errors = {}
      this.loader = true

      this.$store.dispatch('sendSocketRouletteBet', {
        bets: this.selectChips,
        client_seed: this.clientSeed,
      })

      this.result = -1
      this.resultAfter = -1
      this.running = true

      this.$store.dispatch('setClientSeedAfterBet')
    },
    receiveSocketRoulette: function(answer) {
      if (answer.status === 'success') {
        console.log(answer.data)

        //this.configRtp = answer.data.rtp

      } else if (answer.status === 'error') {
        this.$store.dispatch('notification', { type: 'error', text: answer.message, isClose: false, timer: 2000 }).then()
      }
    },
    receiveSocketRouletteBet: function(answer) {
      if (answer.status === 'success') {

        this.result = answer.data.data.result
        this.$store.commit('setUserBalance', answer.data.balance)
        this.$store.commit('setServerSeedHash', answer.data.server_seed_hash)

        setTimeout(() => {
          this.resultAfter = this.result
          this.addNewLastBet(answer.data.uuid, answer.data.data)
        }, this.rotationSpeed * 1000)

      } else if (answer.status === 'error') {
        if (answer.type !== undefined) {
          this.errors[answer.type] = answer.message
        } else {
          this.$store.dispatch('notification', { type: 'error', text: answer.message, isClose: false, timer: 2000 }).then()
        }
      }
      this.loader = false
      this.running = false
    },
    changeSelectChip: function (value) {
      //console.log('select chip '+value.number+' amount '+value.amount)
      this.selectChip = value.number
      //this.selectChipAmount = value.amount
    },
    updateBet: function(data) {
      this.selectChips = data.bets
      this.totalBet = data.amount

      //this.autoGameStop()
    },
  }
}
</script>

<style lang="scss" scoped>
  .game-roulette {
    height: 100%;

    .game-roulette-wrap {
      display: flex;
      justify-content: space-between;
      height: 100%;

      .game-block {
        flex: 1;

        background-color: #0C0E1C;
        background-image: url("./../../../assets/games/roulette/background.svg");
        background-size: cover;


      }
    }
  }
</style>
