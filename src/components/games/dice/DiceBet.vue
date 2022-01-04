<template>
  <div class="bet-block">

    <div class="bet-block-mode">
      <a href="#" @click.prevent="manual = true" :class="{ active: manual }">Manual</a>
      <a href="#" @click.prevent="manual = false" :class="{ active: !manual }">Auto</a>
    </div>

    <div class="bet-block-manual">

      <div class="bet-input">
        <label>Bet: </label>
        <div class="bet-input-block">
          <input type="text" v-model.trim="betAmount">
        </div>

        <div class="bet-input-buttons">
          <button @click.prevent="buttonBet('min')">MIN</button>
          <button @click.prevent="buttonBet('1/2')">1/2</button>
          <button @click.prevent="buttonBet('x2')">x2</button>
          <button @click.prevent="buttonBet('max')">MAX</button>
        </div>
      </div>


      <div class="bet-input-group">
        <div class="bet-input">
          <label>Payout: </label>
          <div class="bet-input-block">
            <input type="text" v-model.trim="payout">
          </div>

          <div class="bet-input-buttons">
            <button>MIN</button>
            <button>MIN</button>
          </div>
        </div>

        <div class="bet-input">
          <label>Chance: </label>
          <div class="bet-input-block">
            <input type="text" v-model.trim="chance">
          </div>

          <div class="bet-input-buttons">
            <button>MIN</button>
            <button>MIN</button>
          </div>
        </div>
      </div>

      <div class="bet-input bet-switch">
        <label>Mode</label>
        <div class="bet-switch-block">
          <button @click.prevent="modeBox = false" :class="{ active: !modeBox }">LESS</button>
          <button @click.prevent="modeBox = true" :class="{ active: modeBox }">OVER</button>
        </div>
      </div>


      {{ bet }} {{betAmount}}
      <div>Chance: {{chance}}</div>



      <div class="bet-button">
        <button @click="send">ROLL</button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'DiceBet',
  props: {
    position: { type: Number },
    mode: { type: Number },
    bet: { type: Number },
  },
  data() {
    return {
      // bet: 0.10,
      manual: true,
      payOutValue: 0,
    }
  },
  computed: {
    chance: {
      get: function() {
        if (this.mode === 0) {
          return (100 - (9999 - this.position + 1) / 100).toFixed(2)
        } else {
          return (100 - this.position / 100).toFixed(2)
        }
      },
      set: function(value) {
        if (this.mode === 0) {

          this.$emit('position', value * 100)
        }
      }
    },
    payout: {
      get: function() {
        return this.payOutValue
      },
      set: function(value) {
        console.log('set payout')

        this.payOutValue = value
        if (this.mode === false) {
          this.chance = 100.0 - (9999 - this.position + 1) / 100
        } else {
          this.chance = 100.0 - this.position / 100
        }
      }
    },
    betAmount: {
      get: function() {
        return this.bet
      },
      set: function(value) {
        //this.bet = parseFloat(value)
        this.$emit('changeBet', parseFloat(value))
      }
    },
    modeBox: {
      get: function() {
        return this.mode === 1
      },
      set: function(value) {
        this.$emit('changeMode', value === true ? 1 : 0)
      }
    }
  },
  methods: {
    send: function() {
      this.$emit('sendBet')
    },
    buttonBet: function(value) {
      if (value === 'max') {
        this.betAmount = this.$store.getters.getUserBalance
      }
      if (value === '1/2') {
        this.betAmount = this.betAmount / 2
      }
      if (value === 'x2') {
        this.betAmount = this.betAmount * 2
      }
    }
  }
}
</script>

<style scoped>

</style>
