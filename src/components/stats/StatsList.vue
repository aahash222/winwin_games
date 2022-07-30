<template>
  <div class="stats-list">

    <div class="stats-list-data">

      <table class="stats-list-table">
        <thead>
          <tr>
            <td>Game</td>
            <td>User</td>
            <td>Bet</td>
            <td>Win</td>
            <td>Payout</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in transactions" :key="item.uuid" :class="{ odd: ((countLog+key) % 2 !== 0)}">
            <td>
              <div @click="openBet(item.uuid)" class="game">
                <span class="game-image">
                  <GameIcon :game="item.game" :size="18" fill="FFF" />
                </span>
                <span class="game-name">{{ gameNames[item.game] }}</span>
              </div>
            </td>
            <td>
              <div @click="openBet(item.uuid)" class="stats-list-user">
                <div><Avatar :avatar="item.user.avatar !== undefined ? item.user.avatar : item.session" :size=20 /></div>
                <div>{{ item.user.name }}</div>
              </div>
            </td>
            <td>
              <div @click="openBet(item.uuid)" class="stats-list-amount">{{ item.bet }} <Currency :symbol="item.currency" :size="20" /></div>
            </td>
            <td>
              <div @click="openBet(item.uuid)" class="stats-list-amount">{{ item.win }} <Currency :symbol="item.currency" :size="20" /></div>
            </td>
            <td>
              <div @click="openBet(item.uuid)">{{ parseFloat((item.win / item.bet).toFixed(4)) }}</div>
            </td>
          </tr>
        </tbody>
      </table>

    </div>

    <div class="stats-close">
      <button @click="closeModal()"><div>Close all stats</div><div><img class="bet-info-verify-arrow" src="@/assets/icons/icon_arrow_down.svg" alt="" /></div></button>
    </div>

  </div>
</template>

<script>
import Avatar from '@/components/Avatar'
import GameIcon from '@/components/navigation/icons/GameIcon'
export default {
  name: 'StatsList',
  components: { GameIcon, Avatar },
  data() {
    return {
      countLog: 0,
    }
  },
  computed: {
    transactions: function() {
      return this.$store.getters.getStatsTransactions
    },
    gameNames: function() {
      return this.$store.getters.getGameNames
    }
  },
  watch: {
    transactions: function() {
      this.countLog++
    }
  },
  methods: {
    closeModal: function() {
      this.$emit('close')
    },
    openBet: function(uuid) {
      this.$emit('close')
      this.$store.commit('openModalBet', uuid)
    }
  }
}
</script>

<style lang="scss" scoped>
  .stats-list {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #131525;
    z-index: 11;
    border-radius: 6px;


    .stats-list-data {
      border: 1px solid #3e447c;
      border-bottom: 0;
      border-top-right-radius: 6px;
      border-top-left-radius: 6px;

      // height: 500px;
      padding: 10px 15px;

      .stats-list-table {
        width: 100%;
        border-collapse: collapse;

        > thead {
          color: #3E447C;
          font-size: 14px;
          > tr > td {
            padding-bottom: 5px;
          }
        }

        .stats-list-user {
          display: flex;
          justify-content: center;
          align-items: center;
          > div {
            &:first-of-type {
              margin-right: 5px;
            }
          }
        }
        .stats-list-amount {
          display: flex;
          justify-content: center;
          .currency {
            margin-left: 3px;
          }
        }

        > tbody {
          tr {
            td {
              border: 0;
              outline: 0;
              margin: 0;
              padding: 0;
              > div {
                background-color: #151729;
                padding: 6px 0;
                margin: 3px 0;
                cursor: pointer;
              }
              &:first-of-type {
                > div {
                  border-top-left-radius: 6px;
                  border-bottom-left-radius: 6px;
                }
              }
              &:last-of-type {
                > div {
                  border-top-right-radius: 6px;
                  border-bottom-right-radius: 6px;
                }
              }

              .game {
                display: flex;
                align-items: center;
                justify-content: center;
                .game-image  {
                  display: inline-flex;
                  align-items: center;
                }
              }
            }

            &.odd {
              td {
                > div {
                  background-color: #1A1D33;
                }
              }
            }
          }
        }
      }
    }

    .stats-close {
      padding: 5px 20px 0 20px;
      > button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 35px;
        width: 100%;
        padding: 0 15px;
        border-radius: 6px;
        color: #FFF;
        background-color: #282C52;
        img {
          display: flex;
          transform: rotate(180deg);
        }
      }
    }
  }
</style>
