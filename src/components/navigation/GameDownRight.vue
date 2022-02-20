<template>
  <div class="menu-game-right">

    <transition name="slide-fade">
      <FairMenu id="fairMenu" v-if="fairMenu" />
    </transition>

    <transition name="slide-fade">
      <Hotkeys id="hotkeysMenu" v-if="hotkeysMenu" />
    </transition>


    <div class="menu-game-item"><a @click="hotkeysMenu = !hotkeysMenu"><img src="@/assets/icons/icon_keys.svg" alt="" /></a></div>
    <div class="menu-game-item"><a @click="fairMenu = !fairMenu"><img src="@/assets/icons/icon_sec.svg" alt="" /></a></div>
    <div class="menu-game-item"><a><img src="@/assets/icons/icon_stats.svg" alt="" /></a></div>
    <div class="menu-game-item"><a><img src="@/assets/icons/icon_help.svg" alt="" /></a></div>
    <div class="menu-game-item"><a><img src="@/assets/icons/icon_settings.svg" alt="" /></a></div>
  </div>
</template>

<script>
import FairMenu from '@/components/navigation/FairMenu'
import Hotkeys from '@/components/navigation/Hotkeys'
export default {
  name: 'GameDownRight',
  components: { Hotkeys, FairMenu },
  data() {
    return {
      fairMenu: false,
      hotkeysMenu: false,
    }
  },
  beforeUnmount () {
    window.removeEventListener('click', this.fairMenuClick)
    window.removeEventListener('click', this.hotkeysMenuClick)
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
    },
    hotkeysMenu: function(value) {
      if (value === true) {
        setTimeout(() => {
          window.addEventListener('click', this.hotkeysMenuClick)
        }, 10)
      } else {
        window.removeEventListener('click', this.hotkeysMenuClick)
      }
    }
  },
  methods: {
    fairMenuClick: function(e) {
      const menu = document.getElementById('fairMenu')
      if (menu.contains(e.target) === false) {
        this.fairMenu = false
      }
    },
    hotkeysMenuClick: function(e) {
      const menu = document.getElementById('hotkeysMenu')
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

    > .menu-game-item {
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
