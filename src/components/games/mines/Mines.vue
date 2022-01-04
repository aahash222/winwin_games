<template>
  <div class="mines">

    <div class="mines-game">
      <div>mines game</div>

      <div>Current payout: {{ currentPayoutAmount }} x{{ currentPayout }}</div>
      <div>Next payout: {{ nextPayoutAmount }} x{{ nextPayout }}</div>

      <div class="mines-game-field" :class="{ active: active, ended: ended }">

        <div v-for="row in 5" :key="row" class="mines-game-row">
          <div v-for="line in 5" :key="line" class="mines-game-item" @click="sendSelect(((row - 1) * 5 + line) - 1)">
            {{ fields[((row - 1) * 5 + line) - 1] }}
          </div>
        </div>
      </div>
    </div>

    <MinesBet
      :loader="loader"
      :active="active"
      :open="open"
      :bet="bet"
      :mines="mines"
      @changeBet="changeBet"
      @changeMines="changeMines"
      @sendBet="sendBet"
      @sendCashout="sendCashout"
    />
  </div>
</template>

<script>
import MinesBet from '@/components/games/mines/MinesBet'
import random from '@/mixins/random'
export default {
  name: 'Mines',
  components: { MinesBet },
  mixins: [random],
  data() {
    return {
      loader: true,
      active: false,
      ended: false,
      rtp: 99.0,
      open: 0,
      bet: 0.1,
      mines: 3,
      fields: [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
      ]
    }
  },
  created () {
    this.$store.commit('subscribeSocketMines')
    this.$store.commit('subscribeSocketMinesBet')
    this.$store.commit('subscribeSocketMinesSelect')
    this.$store.commit('subscribeSocketMinesCashout')

    this.clientSeed = this.getRandomString(32)
  },
  computed: {
    socketMines() {
      return this.$store.getters.subscribeSocketMines
    },
    socketMinesBet() {
      return this.$store.getters.subscribeSocketMinesBet
    },
    socketMinesSelect() {
      return this.$store.getters.subscribeSocketMinesSelect
    },
    socketMinesCashout() {
      return this.$store.getters.subscribeSocketMinesCashout
    },
    currentPayout() {
      return this.getMinesPayout(this.mines, this.open, this.rtp)
    },
    currentPayoutAmount() {
      const powNumber = Math.pow(10, this.$store.getters.getGameDecimal)
      return Math.floor(this.currentPayout * this.bet * powNumber) / powNumber
    },
    nextPayout() {
      return this.getMinesPayout(this.mines, this.open + 1, this.rtp)
    },
    nextPayoutAmount() {
      const powNumber = Math.pow(10, this.$store.getters.getGameDecimal)
      return Math.floor(this.nextPayout * this.bet * powNumber) / powNumber
    }
  },
  watch: {
    socketMines: function(value) {
      if (value === null) return
      this.receiveMines(value)
    },
    socketMinesBet: function(value) {
      if (value === null) return
      this.receiveMinesBet(value)
    },
    socketMinesSelect: function(value) {
      if (value === null) return
      this.receiveMinesSelect(value)
    },
    socketMinesCashout: function(value) {
      if (value === null) return
      this.receiveMinesCashout(value)
    }
  },

  methods: {



    sendBet: function () {
      if (this.loader || this.active) return

      this.loader = true
      this.$store.dispatch('sendSocketMinesBet', {
        bet: this.bet,
        mines: this.mines,
        client_seed: this.clientSeed
      })

      this.clientSeed = this.getRandomString(32)
    },
    sendSelect: function (index) {
      if (this.active !== true) return
      console.log('select ', index)

      this.$store.dispatch('sendSocketMinesSelect', { position: index })
    },
    sendCashout: function () {
      this.loader = true
      this.$store.dispatch('sendSocketMinesCashout', null)
    },


    receiveMines: function (data) {
      if (data.status === 'success') {
        this.rtp = data.data.rtp

        if (data.data.fields !== undefined) {

          if (data.data.fields.select !== undefined) {
            for (let i = 0; i < data.data.fields.select.length; i++) {
              this.fields[data.data.fields.select[i]] = 1
            }
            this.open = data.data.fields.select.length
            this.active = true
          }
        }

        this.loader = false
      }
    },
    receiveMinesBet: function (data) {
      console.log('mines bet ', data)

      if (data.status === 'success') {
        for (let i = 0; i < this.fields.length; i++) {
          this.fields[i] = 0
        }

        this.$store.commit('setUserBalance', data.data.balance)

        this.open = 0
        this.active = true
      }
      this.loader = false
    },
    receiveMinesSelect: function (data) {
      console.log('mines select', data)

      if (data.status === 'success') {
        this.open++

        const isEnd = this.openFields(data.data.fields)

        // игра завершена, открываем бомбы
        if (isEnd) {
          this.active = false
          this.ended = true
        }

        // если открыты все кристаллы, то выдаем приз
        if (data.data.game !== undefined) {
          this.$store.commit('setUserBalance', data.data.game.balance)
        }
      }
    },
    receiveMinesCashout: function (data) {
      console.log('mines cashout', data)

      if (data.status === 'success') {
        this.openFields(data.data.fields)

        this.$store.commit('setUserBalance', data.data.game.balance)

        this.active = false
        this.ended = true
      }

      this.loader = false
    },
    changeBet: function (value) {
      this.bet = value
    },
    changeMines: function (value) {
      this.mines = value
    },
    openFields: function(fields) {
      for (let i = 0; i < fields.select.length; i++) {
        if (fields.result !== undefined && fields.result.includes(fields.select[i])) {
          this.fields[fields.select[i]] = 3
        } else {
          this.fields[fields.select[i]] = 1
        }
      }

      if (fields.result !== undefined) {
        for (let i = 0; i < fields.result.length; i++) {
          if (this.fields[fields.result[i]] === 0) {
            this.fields[fields.result[i]] = 2
          }
        }

        return true
      }

      return false
    },
    getMinesPayout: function(mines, diamonds, rtp) {
      function factorial(number) {
        let value = number
        for (let i = number; i > 1; i--) value *= i - 1
        return value
      }
      function combination(x, d) {
        if (x === d) return 1
        return factorial(x) / factorial(d) / factorial(x - d)
      }

      const result = rtp / 100 * (combination(25, diamonds) / combination(25 - mines, diamonds))
      return Math.floor(result * 100) / 100
    },
  }
}
</script>

<style lang="scss" scoped>
  .mines {
    display: flex;
    justify-content: space-between;

    .mines-game {
      flex: 1;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .mines-game-field {
        .mines-game-row {
          display: flex;

          .mines-game-item {
            height: 60px;
            width: 60px;
            margin: 4px;
            border-radius: 4px;
            //background-color: cornflowerblue;
            background-color: #1b2941;

            display: flex;
            justify-content: center;
            align-items: center;

          }
        }

        &.active {
          .mines-game-row {
            .mines-game-item {
              cursor: pointer;
              background-color: cornflowerblue;
            }
          }
        }
        &.ended {
          .mines-game-row {
            .mines-game-item {
              cursor: default;
            }
          }
        }
      }
    }
  }
</style>
