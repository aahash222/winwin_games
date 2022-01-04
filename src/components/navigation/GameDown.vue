<template>
  <div class="menu-game-down">
    <div class="menu-game-left ping-menu">
      <div><img class="ping-image" src="@/assets/games/ping.svg" alt="" /></div>
      <div class="ping-text">
        <div>ping</div>
        <div>{{$store.getters.getSocketPing}}ms</div>
      </div>
    </div>
    <div class="menu-game-stats"><Stats /></div>
    <div class="menu-game-right">{{ $route.name }}</div>
  </div>
</template>

<script>
import Stats from '@/components/stats/Stats'
export default {
  name: 'GameDown',
  components: { Stats },
  props: ['game']
}
</script>

<style lang="scss" scoped>
  .menu-game-down {
    border-top: 1px solid #3e447c;
    background-color: #131525;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;

    .menu-game-left {
      //padding-left: 15px;
    }
    .menu-game-stats {
      flex: 1;
    }
    .menu-game-right {
      min-width: 300px;
      //margin-right: 15px;
    }

    .ping-menu {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 5px;
      .ping-image {
        display: flex;
        width: 24px;
        padding: 5px;
      }
      .ping-text {
        font-size: 11px;
        text-align: left;

        > div:first-of-type {
          line-height: 10px;
          text-transform: uppercase;
          color: #3E447C;
        }

      }
    }
  }
</style>
