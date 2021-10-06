<template>
  <div class="mines">

    <div class="mines-game">
      <div>mines game</div>

      <div>Current payout: {{ currentPayoutAmount }} x{{ currentPayout }}</div>
      <div>Next payout: {{ nextPayoutAmount }} x{{ nextPayout }}</div>

      <div class="mines-game-field" :class="{ active: active, ended: ended }">

        <div v-for="row in 5" :key="row" class="mines-game-row">
          <div v-for="line in 5" :key="line" class="mines-game-item" @click="selectField(((row - 1) * 5 + line) - 1)">
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
      @start="startGame"
      @cashout="cashout"
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
    this.$store.commit('subscribeSocketMinesGet')
    this.$store.commit('subscribeSocketMinesBet')
    this.$store.commit('subscribeSocketMinesSelect')
    this.$store.commit('subscribeSocketMinesCashout')

    this.clientSeed = this.getRandomString(32)

    this.$store.dispatch('sendSocketMinesGet')
  },
  computed: {
    socketMinesGet() {
      return this.$store.getters.subscribeSocketMinesGet
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
    socketMinesGet: function(value) {
      if (value === null) return
      this.receiveMinesGet(value)
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
    changeBet: function (value) {
      this.bet = value
    },
    changeMines: function (value) {
      this.mines = value
    },
    startGame: function () {
      this.$store.dispatch('sendSocketMinesBet', {
        bet: this.bet,
        mines: this.mines,
        client_seed: this.clientSeed
      })

      this.clientSeed = this.getRandomString(32)
    },
    selectField: function (index) {
      if (this.active !== true) return
      console.log('select ', index)

      this.$store.dispatch('sendSocketMinesSelect', { position: index })
    },
    cashout: function () {
      this.$store.dispatch('sendSocketMinesCashout', null)
    },

    receiveMinesGet: function (data) {
      if (data.status === 'success') {
        if (data.data !== undefined) {

          this.rtp = data.data.rtp

          if (data.data.data.select !== undefined) {
            for (let i = 0; i < data.data.data.select.length; i++) {
              this.fields[data.data.data.select[i]] = 1
            }
            this.open = data.data.data.select.length
            this.active = true
          }
        }

        this.loader = false
      }
    },
    receiveMinesBet: function (data) {
      console.log('mines ', data)

      if (data.status === 'success') {
        for (let i = 0; i < this.fields.length; i++) {
          this.fields[i] = 0
        }

        this.$store.commit('setUserBalance', data.data.balance)

        this.open = 0
        this.active = true
      }
    },
    receiveMinesSelect: function (data) {
      console.log('mines select', data)

      if (data.status === 'success') {
        this.open++

        for (let i = 0; i < data.data.select.length; i++) {
          this.fields[data.data.select[i]] = 1
        }
        // игра завершена, открываем бомбы
        if (data.data.result !== undefined) {
          for (let i = 0; i < data.data.result.length; i++) {
            if (this.fields[data.data.result[i]] === 0) {
              this.fields[data.data.result[i]] = 2
            } else {
              this.fields[data.data.result[i]] = 3
            }
          }

          this.active = false
          this.ended = true
        }
      }
    },
    receiveMinesCashout: function (data) {
      console.log('mines cashout', data)

      //console.log(this.getMinesPayout(1, 19, this.rtp))

      if (data.status === 'success') {
        this.$store.commit('setUserBalance', data.data.balance)

        this.active = false
        this.ended = true
      }
    },
    getMinesPayout: function(mines, diamonds, rtp) {
      function factorial(number) {
        let value = number
        for (let i = number; i > 1; i--) {
          value *= i - 1
        }
        return value
      }
      function combination(x, d) {
        if (x === d) return 1
        return factorial(x) / (factorial(d) * factorial(x - d))
      }

      const n = 25
      const x = 25 - mines

      const first = combination(n, diamonds)
      const second = combination(x, diamonds)
      const result = rtp / 100 * (first / second)
      return Math.round(result * 100) / 100
    }
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
