<template>
  <div>
    <div class="bet-box-group">
      <div class="bet-box">
        <div class="bet-box-title">PAYOUT</div>
        <div class="bet-box-value">x{{ betData.data.payout }}</div>
      </div>
      <div class="bet-box">
        <div class="bet-box-title">CHANCE</div>
        <div class="bet-box-value">{{ betData.data.chance }}%</div>
      </div>
      <div class="bet-box">
        <div class="bet-box-title">RESULT</div>
        <div class="bet-box-value">{{ betData.data.result }}</div>
      </div>
    </div>

    <div class="bet-box-group bet-box-slider">

      <DiceSlider
        :start-position="betData.data.position"
        :mode="betData.data.mode"
        :result="betData.data.result"
        :small="true"
      />

    </div>

  </div>
</template>

<script>
import DiceSlider from '@/components/games/dice/DiceSlider'
export default {
  name: 'BetDice',
  components: { DiceSlider },
  props: {
    betData: { type: Object }
  },

}
</script>

<style lang="scss" scoped>
  .bet-box-slider {
    margin: 10px 0;
  }
</style>
