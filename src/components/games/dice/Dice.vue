<template>
  <!--
  <div class="game-dice" id="DiceScreen" :style="{'min-height': screenHeight + 'px'}">
  -->
  <div class="game-dice" id="DiceScreen">

    <div class="game-dice-wrap">
      <div class="game-block">

        <DiceLast
          :bets="lastBets"
        />

        <div class="dice-central">

          <div class="dice-result">
            <div>{{ resultPrint[0] }}</div>
            <div>{{ resultPrint[1] }}</div>
            <div>{{ resultPrint[2] }}</div>
            <div>{{ resultPrint[3] }}</div>
          </div>

          <div class="slider-wrap">
            <DiceSlider
              :start-position="selectPosition"
              :mode="mode"
              :result="result"
              @position="setSelectPosition"
            />
          </div>

        </div>

        <div></div>

      </div>

      <DiceBet
        :bet="bet"
        :position="selectPosition"
        :mode="mode"
        :errors="errors"
        @changeBet="changeBet"
        @changeMode="changeMode"
        @sendBet="sendBet"
        @position="setSelectPosition"
      />
    </div>

  </div>
</template>

<script>
import DiceSlider from '@/components/games/dice/DiceSlider'
import random from '@/mixins/random'
import DiceBet from '@/components/games/dice/DiceBet'
import DiceLast from '@/components/games/dice/DiceLast'
export default {
  name: 'Dice',
  components: { DiceLast, DiceBet, DiceSlider },
  mixins: [random],
  data () {
    return {
      screenHeight: 0,
      selectPosition: 5000,
      bet: 0.1,
      mode: 0,
      result: -1,
      //clientSeed: null,
      lastBets: [],
      resultPrint: [0, 0, 0, 0],
      animationRoll: null,

      errors: {}
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
    clientSeed: function() {
      return this.$store.getters.getClientSeed
    },
    socketDice: function() {
      return this.$store.getters.subscribeSocketDice
    },
    socketDiceBet: function() {
      return this.$store.getters.subscribeSocketDiceBet
    }
  },
  watch: {
    socketDice: function(data) {
      if (data === null) return

      this.receiveDiceAnswer(data)
    },
    socketDiceBet: function(data) {
      if (data === null) return

      this.receiveBetAnswer(data)
      this.$store.commit('subscribeSocketDiceBet')
    }
  },
  mounted () {
    const elem = document.getElementById('DiceScreen')
    const screenWidth = elem.clientWidth

    this.screenHeight = Math.floor(screenWidth / 16 * 9)
  },
  created () {
    this.$store.commit('subscribeSocketDice')
    //this.clientSeed = this.getRandomString(32)
  },


  methods: {
    setSelectPosition: function(value) {
      console.log('set position: ', value)
      this.selectPosition = value
    },
    changeBet: function(value) {
      this.bet = value
    },
    changeMode: function(value) {
      console.log('change to ', value)
      this.mode = value
    },
    sendBet: function() {
      this.errors = {}
      this.startAnimationRoll()
      this.$store.dispatch('sendSocketDiceBet', { position: this.selectPosition, mode: this.mode, bet: this.bet, client_seed: this.clientSeed })

      //this.clientSeed = this.getRandomString(32)
      this.$store.dispatch('setClientSeedAfterBet')
    },
    receiveDiceAnswer: function(answer) {
      console.log('socket dice answer')
      console.log(answer)

      if (answer.status === 'success') {
        this.$store.commit('setServerSeedHash', answer.data.server_seed_hash)
      } else if (answer.status === 'error') {
        this.$store.dispatch('notification', { type: 'error', text: answer.message, isClose: false, timer: 2000 }).then()
      }
    },
    receiveBetAnswer: function(answer) {
      console.log('receive ', answer)

      this.stopAnimationRoll()

      if (answer.status === 'success') {
        this.result = answer.data.data.result
        this.resultPrint = this.printResult(this.result)
        this.$store.commit('setUserBalance', answer.data.balance)
        this.$store.commit('setServerSeedHash', answer.data.server_seed_hash)

        this.addNewLastBet(answer.data.uuid, answer.data.data)
      } else if (answer.status === 'error') {
        if (answer.type !== undefined) {
          this.errors[answer.type] = answer.message
        } else {
          this.$store.dispatch('notification', { type: 'error', text: answer.message, isClose: false, timer: 2000 }).then()
        }
      }
    },
    addNewLastBet: function(uuid, value) {
      value.uuid = uuid
      this.lastBets.push(value)
      if (this.lastBets.length > 6) {
        this.lastBets.shift()
      }
    },
    printResult: function(value) {
      const one = Math.floor(value / 1000)
      const two = Math.floor((value - one * 1000) / 100)
      const three = Math.floor((value - (one * 1000) - (two * 100)) / 10)
      const four = value - (one * 1000) - (two * 100) - (three * 10)

      return [one, two, three, four]
    },
    getRandom: function () {
      return Math.ceil(Math.random() * (9 - 1) + 1)
    },
    startAnimationRoll: function() {
      this.animationRoll = setInterval(() => {
        this.resultPrint = [this.getRandom(), this.getRandom(), this.getRandom(), this.getRandom()]
      }, 20)
    },
    stopAnimationRoll: function() {
      clearInterval(this.animationRoll)
    }
  }
}
</script>

<style lang="scss" scoped>
  .game-dice {
    //width: 80vw;
    //margin: 0 auto;
    height: 100%;

    .game-dice-wrap {
      display: flex;
      justify-content: space-between;
      height: 100%;


      .game-block {
        flex: 1;

        background-color: #0C0E1C;
        background-image: url("./../../../assets/games/dice/dice_background.svg");
        background-size: cover;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        > div {
          flex: 1;
        }

        .dice-central {

          .dice-result {
            margin: 50px 0;
            display: flex;
            justify-content: center;

            > div {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0 5px;
              width: 80px;
              height: 80px;
              background-image: url("./../../../assets/games/dice/dice_planet.svg");
              font-size: 44px;
              font-family: 'Muller', 'Roboto', sans-serif;
              font-weight: 700;
            }
          }

          .slider-wrap {
            display: flex;
            justify-content: center;
            margin: 20px 0;
          }
        }
      }
    }
  }
</style>
