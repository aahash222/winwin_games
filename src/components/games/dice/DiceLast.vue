<template>
  <div class="dice-last">
    <transition-group name="list-last-bets" class="dice-last-bets" tag="div">
      <div v-for="item in bets" :key="item.uuid" class="dice-last-best-item" :class="{ lose: item.payout === 0 }" @click="openBet(item.uuid)">
        <div class="dice-last-best-item-payout">x{{ item.payout }}</div>
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

<style lang="scss" scoped>
  .dice-last {
    .dice-last-bets {
      margin: 10px 0;
      min-height: 40px;
      display: flex;
      justify-content: center;

      $transition-time: .3s;
      .list-last-bets-enter-active {
        z-index: 1;
      }

      .list-last-bets-enter-to {
        margin-left: 40px !important;
        margin-right: -40px !important;
        transform: translateX(-40px);
        transition: transform $transition-time linear !important;
      }

      .list-last-bets-enter-active {
        //transform: translateX(100px);
      }

      .list-last-bets-leave-to {
        opacity: 0;
        transform: translateX(40px);
      }

      .list-last-bets-leave-active {
        position: relative;
      }

      .dice-last-best-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        margin: 0 5px;
        width: 45px;
        height: 45px;
        border-radius: 45px;

        background-color: #249D46;
        font-size: 12px;

        cursor: pointer;

        .dice-last-best-item-payout {
          font-size: 8px;
        }


        &.lose {
          background-color: #3E447C;
        }
      }
    }
  }
</style>
