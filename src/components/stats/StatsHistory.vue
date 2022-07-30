<template>
  <div class="stats-history">
    <div class="stats-history-title">Bet history</div>
    <div class="stats-history-top">
      <div>
        <div>Profit</div>
        <div class="win">0</div>
      </div>
      <div>
        <div>Wager</div>
        <div>0</div>
      </div>
      <hr>
      <div>
        <div>Wins</div>
        <div class="win">0</div>
      </div>
      <div>
        <div>Loses</div>
        <div class="lose">0</div>
      </div>
      <hr>
    </div>

    <div>
      <table class="stats-history-table">
        <tbody>
          <tr v-for="(item, key) in transactions" :key="item.uuid" :class="{ odd: ((countLog+key) % 2 !== 0)}">
            <td><div @click="openBet(item.uuid)" class="stats-history-time">{{ printTimeFull(item.time) }}</div></td>
            <td><div @click="openBet(item.uuid)">{{ item.bet }} <Currency :symbol="userCurrency" :size="16" /></div></td>
            <td><div @click="openBet(item.uuid)" :class="{ win: item.win > item.bet, lose: item.win < item.bet}">{{ item.win }} <Currency :symbol="userCurrency" :size="16" /></div></td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import times from '@/mixins/times'
export default {
  name: 'StatsHistory',
  mixins: [times],
  data() {
    return {
      countLog: 0,
    }
  },
  computed: {
    transactions: function() {
      return this.$store.getters.getStatsUserTransactions
    },
    userCurrency: function() {
      return this.$store.getters.getUserCurrency
    }
  },
  watch: {
    transactions: function() {
      this.countLog++
    }
  },
  methods: {
    openBet: function(uuid) {
      this.$emit('close')
      this.$store.commit('openModalBet', uuid)
    }
  }
}
</script>

<style lang="scss" scoped>
  .stats-history {
    position: absolute;
    bottom: 55px;
    width: 300px;
    text-align: left;

    background-color: #131525;
    border: 1px solid #3e447c;

    border-radius: 6px;

    padding: 10px 15px;
    z-index: 1;

    .win {
      color: #FFD05B;
    }
    .lose {
      color: #FE4444;
    }

    .stats-history-title {
      margin-bottom: 10px;
      margin-left: -5px;
    }
    .stats-history-top {
      font-size: 14px;

      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 3px 0;
        > div {
          &:first-of-type {
            color: #767FD1;
          }
        }
      }

      hr {
        border-color: #1A1D33;
        margin: 5px 0;
      }
    }

    .stats-history-table {
      width: 100%;
      border-collapse: collapse;

      tr {
        > td {
          padding: 0;
          > div {
            background-color: #151729;
            padding: 6px 0;
            margin: 3px 0;
            display: flex;
            align-items: center;
            cursor: pointer;

            &.stats-history-time {
              font-size: 14px;
              line-height: 20px;
            }
            .currency {
              margin-left: 3px;
            }

          }
          &:first-of-type {
            > div {
              padding-left: 5px;
              border-top-left-radius: 6px;
              border-bottom-left-radius: 6px;
              justify-content: flex-start;
            }
          }
          &:last-of-type {
            > div {
              padding-right: 5px;
              border-top-right-radius: 6px;
              border-bottom-right-radius: 6px;
              justify-content: flex-end;
            }
          }
        }

        &.odd {
          > td {
            > div {
              background-color: #1A1D33;
            }
          }
        }
      }
    }
  }
</style>
