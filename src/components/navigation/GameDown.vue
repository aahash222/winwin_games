<template>
  <div class="menu-game-down">
    <div>Ping {{$store.getters.getSocketPing}}ms</div>
    <div><Stats /></div>
    <div>{{ $route.name }}</div>
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
    padding: 5px 15px;

  }
</style>
