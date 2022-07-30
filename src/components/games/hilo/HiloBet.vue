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


      <div class="bet-button">
        <button @click="send">ROLL</button>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'HiloBet',
  props: {
    locked: { type: Boolean },
    errors: { type: Object },
  },
  data() {
    return {
      manual: true,

    }
  },
  methods: {
    send: function() {
      this.$emit('sendBet')
    },
  }
}
</script>

<style scoped>

</style>
