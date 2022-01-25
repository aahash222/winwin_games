<template>
  <div v-if="this.symbol !== null" class="currency">
    <img :src="this.source" :alt="this.symbol.toUpperCase()" :style="{ height: size + 'px'}" />
  </div>
</template>

<script>
export default {
  name: 'Currency',
  props: {
    symbol: { type: String },
    size: { type: Number, default: 40 }
  },
  computed: {
    source: function() {
      if (this.symbol === 'demo') {
        return require('../assets/games/coin_demo.svg')
      }
      return require(`../../node_modules/cryptocurrency-icons/svg/color/${this.symbol}.svg`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .currency {
    display: inline-flex;
    > img {
      display: flex;
    }
  }
</style>
