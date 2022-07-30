<template>
  <div class="bet-block">

    <div class="bet-block-mode">
      <a href="#" @click.prevent="manual = true" :class="{ active: manual }">Manual</a>
      <a href="#" @click.prevent="manual = false" :class="{ active: !manual }">Auto</a>
    </div>

    <div class="bet-block-manual">

      <div class="block-input block-input-first" :class="{ error: errors.bet }">
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

      <div class="block-input block-switch">
        <label>Risk:</label>
        <div class="block-switch-block">
          <button v-for="(item, key) in arrayRisks" :key="key" @click.prevent="riskValue = item" :class="{ active: riskValue === item }">{{ item.toUpperCase() }}</button>
        </div>
      </div>

      <div class="block-input">
        <label>Rows: </label>
        <div class="bet-input-block">
          <select v-model="rowsValue">
            <option v-for="i in arrayRows" :key="i" :value="i">{{ i }}</option>
          </select>
        </div>
      </div>

      <div class="bet-button">
        <button @click="send" :disabled="locked">ROLL</button>
      </div>
    </div>

  </div>
</template>

<script>
import betBlock from '@/mixins/bet-block'
export default {
  name: 'PlinkoBet',
  mixins: [betBlock],
  props: {
    locked: { type: Boolean },
    bet: { type: Number },
    risk: { type: String },
    rows: { type: Number },

    arrayRisks: { type: Array },
    arrayRows: { type: Array },
    errors: { type: Object },
  },
  data() {
    return {
      manual: true,
      minimumBet: 0.00000100,
    }
  },
  computed: {
    betAmount: {
      get: function () {
        return this.bet
      },
      set: function (value) {
        this.$emit('changeBet', parseFloat(value))
      }
    },
    riskValue: {
      get: function() {
        return this.risk
      },
      set: function(value) {
        this.changeRisk(value)
      }
    },
    rowsValue: {
      get: function() {
        return this.rows
      },
      set: function(value) {
        this.changeRows(value)
      }
    }
  },

  methods: {
    send: function () {
      this.$emit('sendBet')
    },
    changeRisk: function(value) {
      this.$emit('changeRisk', value)
    },
    changeRows: function(value) {
      this.$emit('changeRows', value)
    }
  }
}
</script>

<style scoped>

</style>
