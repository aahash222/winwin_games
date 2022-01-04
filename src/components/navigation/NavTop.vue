<template>
  <div id="nav">
    <div class="nav-logo">
      <img src="@/assets/logo.svg" alt="winwin" />
    </div>
    <div class="nav-menu">
      <router-link to="/">Crash</router-link>
      <router-link to="/dice">Dice</router-link>
      <router-link to="/plinko">Plinko</router-link>
      <router-link to="/">Roulette</router-link>
      <router-link to="/tower">Tower</router-link>
      <router-link to="/">Wheel</router-link>
      <router-link to="/">Slots</router-link>
      <router-link to="/">HiLo</router-link>
      <router-link to="/mines">Mines</router-link>
      <router-link to="/">Keno</router-link>
    </div>
    <div class="nav-user">
      <div class="nav-user-balance">{{userBalance}} {{userCurrency}}</div>
      <div class="nav-user-deposit">123</div>
      <div>ava</div>
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
    //padding: 0 10px;
    background-color: #080911;
    border-bottom: 1px solid #1A1D33;
    display: flex;
    justify-content: space-between;

    .nav-logo {
      padding: 10px 30px;

      img {
        height: 40px;
        display: flex;
      }
    }

    .nav-menu {
      display: flex;
      //align-items: center;
      a {
        flex: 1;
        display: flex;
        align-items: center;
        position: relative;
        height: 100%;
        padding: 0 10px;
        margin: 0 5px;
        font-weight: bold;
        color: #3F446D;
        text-decoration: none;
        transition: .3s ease;

        &:first-of-type {
          margin-left: 0;
        }

        &:last-of-type {
          margin-right: 0;
        }

        &:after {
          content: ' ';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          background-color: #4457FF;
          border-radius: 2px;
          visibility: hidden;
          opacity: 0;
          transition: .3s ease;
        }

        &.router-link-exact-active, &:hover {
          color: #FFFFFF;
          &:after {
            visibility: visible;
            opacity: 1;
          }
        }
      }
    }
    .nav-user {
      display: flex;
      margin-left: auto;
      margin-right: 10px;
      align-items: center;
      > div {
        margin-left: 8px;
        &:first-of-type {
          margin-left: 0;
        }
      }
      .nav-user-balance {
        background-color: #131525;
        border: 1px solid #131525;
        border-radius: 8px;

        padding: 6px 12px;

        font-size: 16px;
        color: #FFD05B;
      }
      .nav-user-deposit {
        background-color: #4457FF;
        border: 1px solid #4456FE;
        border-radius: 8px;

        padding: 6px 12px;

      }
    }
  }
</style>
