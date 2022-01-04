<template>
  <div class="stats-line">
    <transition-group name="list-complete" class="stats-line-wrap" tag="div">
      <div v-for="(item, key) in transactions" :key="item.uuid" class="stats-line-item">
        <div>
          <div class="stats-line-avatar">{{key}}</div>
          <div class="stats-line-name">n</div>
        </div>
        <div>
          <div class="stats-line-bet">{{ item.bet }}</div>
          <div class="stats-line-currency"><img :src="require('@/assets/games/coin_' + item.currency + '.svg')" alt="" /></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'StatsLine',
  props: ['transactions'],
}
</script>

<style lang="scss" scoped>
  .stats-line {
    height: 35px;
    position: relative;
    $transition-time: .3s;
    .list-complete-enter-active {
      z-index: 1;
    }
    .list-complete-enter-to {
      margin-left: -108px !important;
      margin-right: 116px !important;
      transform: translateX(112px);
      transition: transform $transition-time linear !important;
    }
    .list-complete-enter-active {
      //transform: translateX(100px);
    }
    .list-complete-leave-to
    {
      opacity: 0;
      transform: translateX(100px);
    }
    .list-complete-leave-active {
      position: relative;
      //display: block;
    }

    .stats-line-wrap {
      padding-left: 5px;
      display: flex;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      //max-width: calc(500px + 40px);

      .stats-line-item {
        will-change: transform;
        //transform: translateZ(0);
        transition: transform $transition-time linear;

        display: flex;
        justify-content: space-between;
        margin: 0 4px;
        height: 35px;
        min-width: 98px;
        background: #222646;
        border-radius: 6px;

        > div {
          display: flex;
          align-items: center;

          img {
            display: flex;
          }
        }

        &:first-of-type {
          transition: all 0s;
          //margin-left: 0;
        }
        &:last-of-type {
          //margin-right: 0;
        }
      }
    }

    &:before, &:after {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 20px;
      content: ' ';
      pointer-events: none;
    }
    &:before {
      left: 0;
      box-shadow: inset 10px 0 4px -3px #131525;
      z-index: 10;
    }
    &:after {
      right: 0;
      box-shadow: inset -10px 0 4px -3px #131525;
    }
  }
</style>
