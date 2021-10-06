<template>
  <div class="bet-block">

    <div>Bet: <input v-model="betAmount"></div>

    <div>Mines:
      <select v-model="minesCount">
        <option v-for="i in 24" :key="i" :value="i">{{ i }}</option>
      </select>
    </div>

    <div v-if="!active"><button @click="start" :disabled="loader">ROLL</button></div>

    <div v-if="active"><button @click="cashout" :disabled="open === 0">CASHOUT</button></div>
  </div>
</template>

<script>
export default {
  name: 'MinesBet',
  props: {
    loader: { type: Boolean },
    active: { type: Boolean },
    open: { type: Number },
    bet: { type: Number },
    mines: { type: Number }
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
      this.$emit('start')
    },
    cashout: function() {
      this.$emit('cashout')
    }
  }
}
</script>

<style scoped>

</style>
