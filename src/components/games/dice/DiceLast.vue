<template>
  <div class="bet-last">
    <transition-group name="list-last-bets" class="bet-last-bets" tag="div">
      <div v-for="item in bets" :key="item.uuid" class="bet-last-best-item" :class="{ lose: item.payout === 0 }" @click="openBet(item.uuid)">
        <div class="bet-last-best-item-payout">x{{ item.payout }}</div>
        <div>{{ item.result }}</div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'DiceLast',
  props: {
    bets: { type: Array }
  },
  methods: {
    openBet: function(uuid) {
      this.$store.commit('openModalBet', uuid)
    }
  }
}
</script>

<style lang="scss" src="@/assets/styles/bet-last.scss" />
