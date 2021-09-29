<template>
  <div id="nav">
    <div class="nav-menu">
      <router-link to="/">Crash</router-link> |
      <router-link to="/dice">Dice</router-link> |
      <router-link to="/">Plinko</router-link> |
      <router-link to="/">Roulette</router-link> |
      <router-link to="/">Tower</router-link> |
      <router-link to="/">Wheel</router-link> |
      <router-link to="/">Slots</router-link> |
      <router-link to="/">HiLo</router-link> |
      <router-link to="/mines">Mines</router-link> |
      <router-link to="/">Keno</router-link>
    </div>
    <div class="nav-user">
      Balance: {{userBalance}} {{userCurrency}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavTop',
  computed: {
    userBalance: function() {
      return this.$store.getters.getUserBalance
    },
    userCurrency: function() {
      return this.$store.getters.getUserCurrency
    }
  }
}
</script>

<style lang="scss" scoped>
  #nav {
    padding: 10px;
    background-color: #080911;
    border-bottom: 1px solid #3e447c;
    display: flex;
    justify-content: space-between;

    .nav-menu {
      a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
          color: #42b983;
        }
      }
    }
    .nav-user {

    }
  }
</style>
