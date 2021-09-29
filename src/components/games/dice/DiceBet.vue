<template>
  <div class="bet-block">
    <div>Bet: <input type="text" v-model.trim="betAmount"></div>

    {{ bet }} {{betAmount}}
    <div>Chance: {{chance}}</div>

    <div><button @click="send">ROLL</button></div>
  </div>
</template>

<script>
export default {
  name: 'DiceBet',
  props: {
    position: { type: Number },
    mode: { type: Number },
    bet: { type: Number }
  },
  data() {
    return {
      // bet: 0.10,
    }
  },
  computed: {
    chance: function() {
      if (this.mode === 0) {
        return (100 - (9999 - this.position + 1) / 100).toFixed(2)
      } else {
        return (100 - this.position / 100).toFixed(2)
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
  },
  methods: {
    send: function() {
      this.$emit('sendBet')
    }
  }
}
</script>

<style scoped>

</style>
