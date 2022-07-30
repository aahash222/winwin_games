<template>
  <div class="menu-game-down">
    <div class="menu-game-left">
      <div><img class="ping-image" src="@/assets/icons/icon_ping.svg" alt="" /></div>
      <div class="ping-text">
        <div>ping</div>
        <div>{{ $store.getters.getSocketPing }}ms</div>
      </div>

      <div class="menu-my-bets">
        <button @click="openHistory = true">My bets</button>
        <transition name="slide-fade">
          <StatsHistory id="statsHistory" v-if="openHistory" @close="closeHistory" />
        </transition>
      </div>
    </div>
    <div class="menu-game-stats">
      <Stats />
    </div>
    <GameDownRight />
  </div>
</template>

<script>
import Stats from '@/components/stats/Stats'
import GameDownRight from '@/components/navigation/GameDownRight'
import StatsHistory from '@/components/stats/StatsHistory'
export default {
  name: 'GameDown',
  components: { StatsHistory, GameDownRight, Stats },
  props: ['game'],
  data() {
    return {
      openHistory: false,
    }
  },
  watch: {
    openHistory: function(value) {
      if (value === true) {
        setTimeout(() => {
          window.addEventListener('click', this.statsHistoryClick)
        }, 10)
      } else {
        window.removeEventListener('click', this.statsHistoryClick)
      }
    }
  },
  beforeUnmount () {
    window.removeEventListener('click', this.statsHistoryClick)
  },
  methods: {
    closeHistory: function() {
      this.openHistory = false
    },
    statsHistoryClick: function(e) {
      const menu = document.getElementById('statsHistory')
      if (menu.contains(e.target) === false) {
        this.openHistory = false
      }
    }
  }

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

    .menu-game-stats {
      flex: 1;
    }

    .menu-game-left {
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
        font-size: 8px;
        text-align: left;

        > div:first-of-type {
          font-size: 11px;
          line-height: 10px;
          text-transform: uppercase;
          color: #767FD1;
        }
      }

      .menu-my-bets {
        margin-left: 10px;
        position: relative;
        > button {
          border-radius: 6px;
          background-color: #222646;
          color: #767FD1;
          height: 35px;
          padding: 0 15px;
          &:hover {
            color: #FFF;
          }
        }

        .slide-fade-enter-active {
          transition: all 0.3s ease-out;
        }

        .slide-fade-leave-active {
          transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
        }

        .slide-fade-enter-from,
        .slide-fade-leave-to {
          transform: translateY(100%);
          opacity: 0;
        }
      }
    }
  }
</style>
