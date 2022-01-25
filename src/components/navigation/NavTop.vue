<template>
  <div id="nav">
    <div class="nav-logo">
      <img src="@/assets/logo.svg" alt="winwin" />
    </div>
    <div class="nav-menu">
      <router-link to="/"><img src="@/assets/games/game_crash.svg" alt="" />Crash</router-link>
      <router-link to="/dice"><img src="@/assets/games/game_dice.svg" alt="" />Dice</router-link>
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
      <div class="nav-user-balance"><span>{{userBalance}}</span><Currency :symbol="userCurrency" :size="20" /></div>
      <div class="nav-user-deposit"><img class="deposit-image" src="@/assets/games/icon_plus.svg" alt="" /><span>Deposit</span></div>
      <div class="nav-user-avatar"><Avatar :avatar="$store.getters.getUserAvatar" /></div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar'
import Currency from '@/components/Currency'
export default {
  name: 'NavTop',
  components: { Currency, Avatar },
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
        margin-left: 20px;
        &:first-of-type {
          margin-left: 0;
        }
      }
      .nav-user-balance {
        background-color: #131525;
        border: 1px solid #131525;
        border-radius: 8px;

        padding: 4px 12px;

        color: #FFD05B;

        display: flex;
        align-items: center;
        > span {
          margin-right: 8px;
          font-size: 20px;
        }
      }
      .nav-user-deposit {
        background-color: #4457FF;
        //border: 1px solid #4456FE;
        border-radius: 8px;

        padding: 5px 12px;
        display: flex;
        justify-content: center;

        transition: .3s ease;
        cursor: pointer;

        .deposit-image {
          display: flex;
          margin-right: 3px;
        }
        > span {
          margin: auto 0;
        }

        &:hover {
          background: #5165ff;
        }
      }
      .nav-user-avatar {
        height: 40px;
      }
    }
  }
</style>
