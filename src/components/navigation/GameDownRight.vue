<template>
  <div class="menu-game-right">

    <transition name="slide-fade">
      <FairMenu id="fairMenu" v-if="fairMenu" />
    </transition>

    <div><a @click="openBet()">test bet</a></div>
    <div><a><img src="@/assets/games/icon_keys.svg" alt="" /></a></div>
    <div><a @click="fairMenu = !fairMenu"><img src="@/assets/games/icon_sec.svg" alt="" /></a></div>
    <div><a><img src="@/assets/games/icon_stats.svg" alt="" /></a></div>
    <div><a><img src="@/assets/games/icon_help.svg" alt="" /></a></div>
    <div><a><img src="@/assets/games/icon_settings.svg" alt="" /></a></div>
  </div>
</template>

<script>
import FairMenu from '@/components/navigation/FairMenu'
export default {
  name: 'GameDownRight',
  components: { FairMenu },
  data() {
    return {
      fairMenu: false
    }
  },
  beforeUnmount () {
    window.removeEventListener('click', this.fairMenuClick)
  },
  watch: {
    fairMenu: function(value) {
      if (value === true) {
        setTimeout(() => {
          window.addEventListener('click', this.fairMenuClick)
        }, 10)
      } else {
        window.removeEventListener('click', this.fairMenuClick)
      }
    }
  },
  methods: {
    openBet: function() {
      this.$store.commit('openModalBet', '205e7548-b602-4868-abec-6132c08ae32c')
    },
    fairMenuClick: function(e) {
      const menu = document.getElementById('fairMenu')
      if (menu.contains(e.target) === false) {
        this.fairMenu = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-game-right {
    min-width: 290px;
    margin-right: 10px;

    display: flex;
    justify-content: flex-end;
    align-items: center;

    .slide-fade-enter-active {
      transition: all 0.3s ease-out;
    }

    .slide-fade-leave-active {
      transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
      transform: translateX(100px);
      opacity: 0;
    }

    > div {
      margin: 0 5px;
      > a {
        cursor: pointer;
        > img {
          display: flex;
          height: 24px;
        }
      }
    }

  }
</style>
