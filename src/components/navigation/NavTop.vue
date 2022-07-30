<template>
  <div id="nav">
    <div class="nav-logo">
      <img src="@/assets/logo.svg" alt="winwin" />
    </div>
    <div class="nav-menu">
      <router-link to="/">
        <span>
          <IconCrash />
        </span>
        <span>Crash</span>
      </router-link>
      <router-link to="/dice">
        <span>
          <IconDice />
        </span>
        <span>Dice</span>
      </router-link>
      <router-link to="/plinko">
        <span>
          <IconPlinko />
        </span>
        <span>Plinko</span>
      </router-link>
      <router-link to="/roulette">
        <span>
          <IconRoulette />
        </span>
        <span>Roulette</span>
      </router-link>
      <router-link to="/tower">
        <span>
          <IconTower />
        </span>
        <span>Tower</span>
      </router-link>
      <router-link to="/wheel">
        <span>
          <IconWheel />
        </span>
        <span>Wheel</span>
      </router-link>
      <router-link to="/">
        <span>
          <IconSlots />
        </span>
        <span>Slots</span>
      </router-link>
      <router-link to="/hilo">
        <span>
          <IconHilo />
        </span>
        <span>HiLo</span>
      </router-link>
      <router-link to="/mines">
        <span>
          <IconMines />
        </span>
        <span>Mines</span>
      </router-link>
      <router-link to="/">
        <span>
          <IconKeno />
        </span>
        <span>Keno</span>
      </router-link>
    </div>
    <div class="nav-user">
      <div class="nav-user-balance"><span>{{userBalance}}</span><Currency :symbol="userCurrency" :size="20" /></div>
      <div class="nav-user-deposit"><img class="deposit-image" src="@/assets/icons/icon_plus.svg" alt="" /><span>Deposit</span></div>
      <div class="nav-user-avatar"><Avatar :avatar="$store.getters.getUserAvatar" /></div>
    </div>
  </div>



</template>

<script>
import Avatar from '@/components/Avatar'
import IconCrash from '@/components/navigation/icons/IconCrash'
import IconDice from '@/components/navigation/icons/IconDice'
import IconPlinko from '@/components/navigation/icons/IconPlinko'
import IconRoulette from '@/components/navigation/icons/IconRoulette'
import IconTower from '@/components/navigation/icons/IconTower'
import IconSlots from '@/components/navigation/icons/IconSlots'
import IconHilo from '@/components/navigation/icons/IconHilo'
import IconMines from '@/components/navigation/icons/IconMines'
import IconKeno from '@/components/navigation/icons/IconKeno'
import IconWheel from '@/components/navigation/icons/IconWheel'
export default {
  name: 'NavTop',
  components: { IconWheel, IconKeno, IconMines, IconHilo, IconSlots, IconTower, IconRoulette, IconPlinko, IconDice, IconCrash, Avatar },
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
    z-index: 1;

    .nav-logo {
      padding: 10px 20px;

      img {
        height: 40px;
        display: flex;
      }
    }

    .nav-menu {
      display: flex;
      width: 100%;
      padding-right: 20px;
      //align-items: center;
      a {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 100%;
        padding: 0 8px;
        margin: 0 1px;
        font-weight: bold;
        color: #767FD1;
        text-decoration: none;
        transition: .3s ease;

        > span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          &:first-of-type {
            margin-right: 3px;
          }
        }

        svg {
          width: 16px;
          height: 16px;
          fill: #767FD1;
          transition: .3s ease;
        }

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

          svg {
            fill: #FFF;
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
