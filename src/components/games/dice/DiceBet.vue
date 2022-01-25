<template>
  <div class="bet-block">

    <div class="bet-block-mode">
      <a href="#" @click.prevent="manual = true" :class="{ active: manual }">Manual</a>
      <a href="#" @click.prevent="manual = false" :class="{ active: !manual }">Auto</a>
    </div>

    <div class="bet-block-manual">

      <div class="block-input" :class="{ error: errors.bet }">
        <label>Bet: </label>
        <div class="bet-input-block">
          <div class="error-tooltip" v-show="errors.bet"><span>{{ errors.bet }}</span></div>
          <input type="text" :value="betAmount" @input="inputBet">
        </div>

        <div class="bet-input-buttons">
          <button @click.prevent="buttonBet('min')">MIN</button>
          <button @click.prevent="buttonBet('1/2')">1/2</button>
          <button @click.prevent="buttonBet('x2')">x2</button>
          <button @click.prevent="buttonBet('max')">MAX</button>
        </div>
      </div>


      <div class="bet-input-group">
        <div class="block-input">
          <label>Payout: </label>
          <div class="bet-input-block">
            <input type="text" :value="gamePayout" @input="inputPayout">
          </div>

          <div class="bet-input-buttons">
            <button @click.prevent="buttonChance('max-chance')">MIN</button>
            <button @click.prevent="buttonChance('min-chance')">MAX</button>
          </div>
        </div>

        <div class="block-input" :class="{ error: errors.chance }">
          <label>Chance: </label>
          <div class="bet-input-block">
            <div class="error-tooltip" v-show="errors.chance"><span>{{ errors.chance }}</span></div>
            <input type="text" :value="gameChance" @input="inputChance">
          </div>

          <div class="bet-input-buttons">
            <button @click.prevent="buttonChance('-5')">-5</button>
            <button @click.prevent="buttonChance('+5')">+5</button>
          </div>
        </div>
      </div>

      <div class="block-input block-switch">
        <label>Mode</label>
        <div class="block-switch-block">
          <button @click.prevent="modeBox = false" :class="{ active: !modeBox }">LESS</button>
          <button @click.prevent="modeBox = true" :class="{ active: modeBox }">OVER</button>
        </div>
      </div>


      <div class="block-input" :class="{ error: errors.win }">
        <label>Possible winnings</label>
        <div class="error-tooltip" v-show="errors.win"><span>{{ errors.win }}</span></div>
        <div class="bet-input-text">{{ winAmount.toFixed(decimal) }} <Currency :symbol="userCurrency" :size="20" /></div>
      </div>

      <div class="bet-button">
        <button @click="send">ROLL</button>
      </div>

    </div>
  </div>
</template>

<script>
import Inputs from '../Inputs'
import Currency from '@/components/Currency'
export default {
  name: 'DiceBet',
  components: { Currency },
  props: {
    locked: { type: Boolean },
    position: { type: Number },
    mode: { type: Number },
    bet: { type: Number },
    errors: { type: Object },
  },
  data() {
    return {
      manual: true,
      //decimal: 8,

      gameChance: 0,
      gamePayout: 0,
      minimumChance: 0.01,
      maximumChance: 98,
      minimumPayout: 1.0102,
      maximumPayout: 9900,

      minimumBet: 0.00000100,


    }
  },
  computed: {
    userCurrency: function() {
      return this.$store.getters.getUserCurrency
    },
    decimal: function() {
      return this.$store.getters.getGameDecimal
    },
    betAmount: {
      get: function() {
        return this.bet
      },
      set: function(value) {
        console.log('set bet ', value)
        this.$emit('changeBet', value)
      }
    },
    modeBox: {
      get: function() {
        return this.mode === 1
      },
      set: function(value) {
        this.$emit('changeMode', value === true ? 1 : 0)
      }
    },
    winAmount: function () {
      return Inputs.truncatedDown(this.betAmount * parseFloat(this.gamePayout) - this.betAmount, this.decimal)
    },
  },
  watch: {
    position: function(value) {
      this.gameChance = this.calculateChance()
      this.gamePayout = this.calculatePayout()
    },
    modeBox: function(value) {
      this.inputMode(value)
    }
  },
  created () {
    this.gameChance = this.calculateChance()
    this.gamePayout = this.calculatePayout()
  },
  methods: {
    send: function() {
      this.$emit('sendBet')
    },
    calculateChance: function() {
      if (this.mode === 0) {
        return parseFloat((100 - (9999 - this.position + 1) / 100).toFixed(2))
      } else {
        return parseFloat((100 - this.position / 100).toFixed(2))
      }
    },
    calculatePayout: function() {
      return Inputs.truncatedDown(99 / this.gameChance, 4)
    },

    inputBet: function(e) {
      if (this.locked) return

      const bet = Inputs.keyBet(e, this.minimumBet, this.decimal)
      if (bet.valid === false) return

      let betAmount = bet.value
      betAmount = Inputs.checkMin(betAmount, this.minimumBet)
      betAmount = Inputs.checkMax(betAmount, this.$store.getters.getUserBalance)

      this.betAmount = betAmount
    },
    inputChance: function(e) {
      if (this.locked) return

      const chance = Inputs.keyChance(e, this.minimumChance, 2)
      if (chance.valid === false) return

      this.gameChance = chance.value

      this.gameChance = Inputs.checkMin(this.gameChance, this.minimumChance)
      this.gameChance = Inputs.checkMax(this.gameChance, this.maximumChance)

      this.changeSliderPositionByChance(this.gameChance)
    },
    inputPayout: function(e) {
      if (this.locked) return

      const payout = Inputs.keyPayout(e, this.minimumPayout, 4)
      if (payout.valid === false) return

      this.gamePayout = payout.value

      this.gamePayout = Inputs.checkMin(this.gamePayout, this.minimumPayout)
      this.gamePayout = Inputs.checkMax(this.gamePayout, this.maximumPayout)


      const calcChance = Inputs.truncatedDown(99 / this.gamePayout, 2)
      this.changeSliderPositionByChance(calcChance)
    },
    inputMode: function(value) {
      this.gameChance = this.calculateChance()
      this.gamePayout = this.calculatePayout()

      this.changeSliderPositionByChance(this.gameChance)
    },
    changeSliderPositionByChance: function(value) {
      if (this.mode !== 0) value = 100 - value

      let position = Math.round(value * 100)
      if (this.mode !== 0 && position < 200) position = 200
      if (this.mode === 0 && position > 9800) position = 9800

      this.$emit('position', position)
    },
    buttonBet: function(value) {
      if (value === 'min') {
        this.betAmount = this.minimumBet
      }
      if (value === 'max') {
        this.betAmount = this.$store.getters.getUserBalance
      }
      if (value === '1/2') {
        this.betAmount = this.betAmount / 2
      }
      if (value === 'x2') {
        this.betAmount = this.betAmount * 2
      }
    },
    buttonChance: function(value) {
      if (this.locked) return

      switch (value) {
        case '-5':
          this.gameChance = this.gameChance - 5.0
          break
        case '+5':
          this.gameChance = this.gameChance + 5.0
          break
        case 'max-chance':
          this.gameChance = this.maximumChance
          break
        case 'min-chance':
          this.gameChance = this.minimumChance
          break
      }

      this.gameChance = Inputs.checkMin(this.gameChance, this.minimumChance)
      this.gameChance = Inputs.checkMax(this.gameChance, this.maximumChance)

      this.changeSliderPositionByChance(this.gameChance)
    },

  }
}
</script>

<style scoped>

</style>
