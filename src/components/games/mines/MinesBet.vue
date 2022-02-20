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

      <div class="block-input" :class="{ error: errors.mines }">
        <label>Mines: </label>
        <div class="bet-input-block">
          <div class="error-tooltip" v-show="errors.mines"><span>{{ errors.mines }}</span></div>
          <select v-model="minesCount">
            <option v-for="i in 24" :key="i" :value="i">{{ i }}</option>
          </select>
        </div>
      </div>


      <div class="bet-button">

        <button v-if="!active" @click="start" :disabled="locked">ROLL</button>

        <button v-if="active" @click="openRandom" class="random">OPEN RANDOM</button>

        <button v-if="active" @click="cashout" :disabled="locked || open === 0" class="cashout">CASHOUT <span v-if="open !== 0">{{ currentPayoutAmount }}<Currency :symbol="userCurrency" :size="16" /><span>(x{{ currentPayout }})</span></span></button>

      </div>
    </div>
  </div>
</template>

<script>
import Inputs from '@/components/games/Inputs'
import Currency from '@/components/Currency'
import betBlock from '@/mixins/bet-block'

export default {
  name: 'MinesBet',
  mixins: [betBlock],
  components: { Currency },
  props: {
    locked: { type: Boolean },
    active: { type: Boolean },
    open: { type: Number },
    bet: { type: Number },
    mines: { type: Number },
    currentPayout: { type: Number },
    currentPayoutAmount: { type: Number },
    errors: { type: Object },
  },
  data() {
    return {
      manual: true,
      minimumBet: 0.00000100,
    }
  },
  computed: {
    userCurrency: function() {
      return this.$store.getters.getUserCurrency
    },
    betAmount: {
      get: function () {
        return this.bet
      },
      set: function (value) {
        this.$emit('changeBet', parseFloat(value))
      }
    },
    minesCount: {
      get: function() {
        return this.mines
      },
      set: function(value) {
        this.$emit('changeMines', parseFloat(value))
      }
    }
  },
  methods: {
    start: function() {
      this.$emit('sendBet')
    },
    cashout: function() {
      this.$emit('sendCashout')
    },
    openRandom: function() {
      this.$emit('openRandom')
    },

  }
}
</script>

<style lang="scss" scoped>
  .bet-block {
    .bet-block-manual {
      .bet-button {
        .random {
          margin-bottom: 10px;
          color: #6871C1;
          background-color: #222646;
          font-size: 16px;
          &:hover {
            color: #fff;
          }
        }
        .cashout {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          > span {
            display: inline-flex;
            align-items: center;

            color: #FFD05B;
            margin-left: 5px;
            font-size: 14px;
            > .currency {
              margin-left: 2px;
            }
            > span {
              margin-left: 5px;
              color: #FFF;
            }
          }

        }
      }
    }
  }
</style>
