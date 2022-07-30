<template>
  <div class="game-plinko">
    <div class="game-plinko-wrap">

      <div class="game-block">

        <PlinkoField
          :rtp="configRtp"
          :bet="bet"
          :risk="risk"
          :rows="rows"
          :answer-data="answerData"
          :array-risks="arrayRisks"
          :array-rows="arrayRows"
          @changeHoles="changeHoles"
          @changeRisk="changeRisk"
        />

      </div>

      <PlinkoBet
        :locked="loader"
        :bet="bet"
        :risk="risk"
        :rows="rows"
        :array-risks="arrayRisks"
        :array-rows="arrayRows"
        :errors="errors"
        @sendBet="sendBet"
        @changeBet="changeBet"
        @changeRisk="changeRisk"
        @changeRows="changeRows"
      />

    </div>



  </div>
</template>

<script>
import PlinkoBet from '@/components/games/plinko/PlinkoBet'
import PlinkoField from '@/components/games/plinko/PlinkoField'
export default {
  name: 'Plinko',
  components: { PlinkoField, PlinkoBet },
  data() {
    return {
      loader: false,
      bet: 0.1,
      risk: 'mid',
      rows: 16,
      configRtp: 97.0,
      holes: [],
      answerData: {},

      errors: {},

      arrayRisks: ['easy', 'mid', 'hard'],
      arrayRows: [8, 9, 10, 11, 12, 13, 14, 15, 16],
    }
  },
  computed: {
    clientSeed: function() {
      return this.$store.getters.getClientSeed
    },
    socketPlinko: function() {
      return this.$store.getters.subscribeSocketPlinko
    },
    socketPlinkoBet: function() {
      return this.$store.getters.subscribeSocketPlinkoBet
    },
  },
  watch: {
    socketPlinko: function(value) {
      if (value === null) return
      this.receiveSocketPlinko(value)
    },
    socketPlinkoBet: function(value) {
      if (value === null) return
      this.receiveSocketPlinkoBet(value)
    }
  },
  created () {
    this.$store.commit('subscribeSocketPlinko')
    this.$store.commit('subscribeSocketPlinkoBet')
  },
  methods: {
    sendBet: function() {
      if (this.loader) return

      this.errors = {}
      this.loader = true

      this.$store.dispatch('sendSocketPlinkoBet', {
        bet: this.bet,
        holes: this.holes,
        client_seed: this.clientSeed,
      })

      this.$store.dispatch('setClientSeedAfterBet')
    },
    receiveSocketPlinko: function(answer) {
      if (answer.status === 'success') {
        this.configRtp = answer.data.rtp

      } else if (answer.status === 'error') {
        this.$store.dispatch('notification', { type: 'error', text: answer.message, isClose: false, timer: 2000 }).then()
      }
    },
    receiveSocketPlinkoBet: function(answer) {
      if (answer.status === 'success') {
        //console.log(answer.data.data.result)

        this.answerData = answer.data.data.result

      } else if (answer.status === 'error') {
        if (answer.type !== undefined) {
          this.errors[answer.type] = answer.message
        } else {
          this.$store.dispatch('notification', { type: 'error', text: answer.message, isClose: false, timer: 2000 }).then()
        }
      }
      this.loader = false
    },
    changeBet: function(value) {
      this.bet = value
    },
    changeRisk: function(value) {
      this.risk = value
    },
    changeRows: function(value) {
      this.rows = value
    },
    changeHoles: function(value) {
      this.holes = value
    }
  }
}
</script>

<style src="./plinkoEditor.scss" lang="scss" />
<style lang="scss" scoped>
  .game-plinko {
    height: 100%;

    .game-plinko-wrap {
      display: flex;
      justify-content: space-between;
      height: 100%;

      .game-block {
        flex: 1;

        background-color: #0C0E1C;
        background-image: url("./../../../assets/games/plinko/background.svg");
        background-size: cover;


      }
    }
  }
</style>
