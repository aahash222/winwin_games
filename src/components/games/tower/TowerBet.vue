<template>
  <div class="bet-block">
    <div>Bet: <input v-model="betAmount"></div>

    <div>Mines:
      <select v-model="selectConfig">
        <option v-for="(item, key) in config" :key="key" :value="item.name">{{ item.name }}</option>
      </select>
    </div>

    <div v-if="!active"><button @click="sendBet" :disabled="loader">ROLL</button></div>

    <div v-if="active"><button @click="sendCashout" :disabled="loader || open === 0">CASHOUT</button></div>
  </div>
</template>

<script>
export default {
  name: 'TowerBet',
  props: {
    config: { type: Object },
    loader: { type: Boolean },
    active: { type: Boolean },
    open: { type: Number },
    bet: { type: Number },
    select: { type: String },
  },
  data() {
    return {

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
    selectConfig: {
      get: function() {
        return this.select
      },
      set: function(value) {
        this.$emit('changeSelect', value)
      }
    }
  },
  methods: {
    sendBet: function() {
      this.$emit('sendBet')
    },
    sendCashout: function() {
      this.$emit('sendCashout')
    }
  }
}
</script>

<style scoped>

</style>
