<template>
  <div class="game-dice">
    <div class="game-dice-wrap">
      <div class="game-block">
        <p>dice game</p>
        <p>Result: {{result}}</p>

        <p>client seed: {{clientSeed}}</p>

        <div class="slider-wrap">
          <DiceSlider :start-position="selectPosition" :mode="mode" @position="setSelectPosition" />
        </div>

        <div>Slider: {{selectPosition}} Mode: <input type="checkbox" v-model="modeBox"> {{mode}}</div>


      </div>

      <DiceBet
        :bet="bet"
        :position="selectPosition"
        :mode="mode"
        @changeBet="changeBet"
        @sendBet="sendBet"
      />
    </div>

  </div>
</template>

<script>
import DiceSlider from '@/components/games/dice/DiceSlider'
import random from '@/mixins/random'
import DiceBet from '@/components/games/dice/DiceBet'
export default {
  name: 'Dice',
  components: { DiceBet, DiceSlider },
  mixins: [random],
  data () {
    return {
      selectPosition: 5000,
      bet: 0.1,
      mode: 0,
      result: 0,
      clientSeed: null,
    }
  },
  computed: {
    modeBox: {
      get: function() {
        return this.mode !== 0
      },
      set: function(value) {
        this.mode = value === true ? 1 : 0
      }
    },

    socketDice: function() {
      return this.$store.getters.subscribeSocketDice
    }
  },
  watch: {
    socketDice: function(data) {
      if (data === null) return

      this.receiveBetAnswer(data)
      this.$store.commit('subscribeSocketDice')
    }
  },
  created () {
    this.$store.commit('subscribeSocketDice')
    this.clientSeed = this.getRandomString(32)
  },


  methods: {
    setSelectPosition: function(value) {
      this.selectPosition = value
    },
    changeBet: function(value) {
      this.bet = value
    },
    sendBet: function() {
      this.$store.dispatch('sendSocketDice', { position: this.selectPosition, mode: this.mode, bet: this.bet, client_seed: this.clientSeed })

      this.clientSeed = this.getRandomString(32)
    },
    receiveBetAnswer: function(answer) {
      console.log('receive ', answer)

      if (answer.status === 'success') {
        this.result = answer.data.data.result
        this.$store.commit('setUserBalance', answer.data.balance)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .game-dice {
    //width: 80vw;
    //margin: 0 auto;

    .game-dice-wrap {
      display: flex;
      justify-content: space-between;


      .game-block {
        flex: 1;

        .slider-wrap {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }
      }
    }
  }
</style>
