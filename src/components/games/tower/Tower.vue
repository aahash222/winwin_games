<template>
  <div class="tower">

    <div class="tower-game">
      {{loader}}

      <div v-if="loadConfig" class="tower-game-field">

        <div v-for="row in selected.rows" :key="row" class="tower-game-row" :class="{active: active && currentRow === row-1}">
          x{{ Math.floor(Math.pow(payoutPerLine, row) * 10000)/10000 }}
          <div v-for="column in selected.columns" :key="column" @click="sendSelect(column-1)" class="tower-game-item">
            {{ fields[row-1][column-1] }}
          </div>
        </div>

      </div>

    </div>

    <TowerBet
      :config="config"
      :select="select"
      :bet="bet"
      :loader="loader"
      :active="active"
      :open="open"
      @changeBet="changeBet"
      @changeSelect="changeSelectConfig"
      @sendBet="sendBet"
      @sendCashout="sendCashout"
    />

  </div>
</template>

<script>
import random from '@/mixins/random'
import TowerBet from '@/components/games/tower/TowerBet'
export default {
  name: 'Tower',
  components: { TowerBet },
  mixins: [random],
  data() {
    return {
      config: [],
      select: 'easy',
      bet: 0.1,
      rtp: 97.0,
      loadConfig: false,
      loader: true,
      active: false,
      ended: false,
      open: 0,
      currentRow: 0,

      fields: [],
      // позиции клеток
      // 0 - закрыта
      // 1 - открыта пустая (кристалл)
      // 2 - мина не взорвалась
      // 3 - попал на мину
    }
  },
  computed: {
    selected: function() {
      for (let i = 0; i < this.config.length; i++) {
        if (this.select === this.config[i].name) {
          return this.config[i]
        }
      }
      return null
    },
    payoutPerLine: function() {
      return this.getTowerPayout(this.selected.columns, this.selected.bombs, this.rtp)
    },
    socketTower() {
      return this.$store.getters.subscribeSocketTower
    },
    socketTowerBet() {
      return this.$store.getters.subscribeSocketTowerBet
    },
    socketTowerSelect() {
      return this.$store.getters.subscribeSocketTowerSelect
    },
    socketTowerCashout() {
      return this.$store.getters.subscribeSocketTowerCashout
    }
  },
  watch: {
    selected: function(value) {
      console.log('change selected ', value)
      this.createFields()
    },
    socketTower: function(value) {
      console.log('tower get ', value)
      this.receiveSocketTower(value)
    },
    socketTowerBet: function(value) {
      this.receiveSocketTowerBet(value)
    },
    socketTowerSelect: function(value) {
      this.receiveSocketTowerSelect(value)
    },
    socketTowerCashout: function(value) {
      this.receiveSocketTowerCashout(value)
    }
  },
  created () {
    this.$store.commit('subscribeSocketTower')
    this.$store.commit('subscribeSocketTowerBet')
    this.$store.commit('subscribeSocketTowerSelect')
    this.$store.commit('subscribeSocketTowerCashout')

    this.clientSeed = this.getRandomString(32)
  },
  methods: {
    sendBet: function() {
      if (this.loader || this.active) return

      this.loader = true
      this.$store.dispatch('sendSocketTowerBet', {
        bet: this.bet,
        config: this.select,
        client_seed: this.clientSeed
      })

      this.clientSeed = this.getRandomString(32)
    },
    sendSelect: function(index) {
      if (!this.active) return

      this.loader = true
      this.$store.dispatch('sendSocketTowerSelect', {
        position: index,
      })
    },
    sendCashout: function() {

    },

    receiveSocketTower: function(data) {
      if (data.status === 'success') {
        this.rtp = data.data.rtp
        this.config = data.data.config
        this.$store.commit('setServerSeedHash', data.data.server_seed_hash)
      }
      this.loader = false
      this.loadConfig = true
    },
    receiveSocketTowerBet: function(data) {
      console.log('tower bet ', data)
      if (data.status === 'success') {
        this.createFields()

        this.$store.commit('setUserBalance', data.data.balance)
        this.$store.commit('setServerSeedHash', data.data.server_seed_hash)

        this.open = 0
        this.active = true
      }
      this.loader = false
    },
    receiveSocketTowerSelect: function(data) {
      console.log('tower select ', data)
      if (data.status === 'success') {
        this.open++

        const isEnd = this.openFields(data.data.fields)

        // игра завершена, открываем бомбы
        if (isEnd) {
          this.active = false
          this.ended = true
        } else {
          this.currentRow = data.data.fields.select.length
        }

        // если открыты все кристаллы, то выдаем приз
        if (data.data.game !== undefined) {
          this.$store.commit('setUserBalance', data.data.game.balance)
        }
      }
      this.loader = false
    },
    receiveSocketTowerCashout: function(data) {

    },
    getTowerPayout: function(columns, bombs, rtp) {
      function factorial(number) {
        let value = number
        for (let i = number; i > 1; i--) value *= i - 1
        return value
      }
      function combination(x, d) {
        if (x === d) return 1
        return factorial(x) / factorial(d) / factorial(x - d)
      }

      const result = rtp / 100 * (combination(columns, 1) / combination(columns - bombs, 1))
      return Math.floor(result * 10000) / 10000
    },

    changeBet: function(value) {
      this.bet = value
    },
    changeSelectConfig: function(value) {
      this.select = value
    },
    createFields: function() {
      for (let row = 0; row < this.selected.rows; row++) {
        this.fields.push([])
        for (let column = 0; column < this.selected.columns; column++) {
          this.fields[row][column] = 0
        }
      }
    },
    openFields: function(fields) {
      for (let row = 0; row < fields.select.length; row++) {
        if (fields.result !== undefined && fields.result[row].includes(fields.select[row])) {
          this.fields[row][fields.select[row]] = 3
        } else {
          this.fields[row][fields.select[row]] = 1
        }
      }

      if (fields.result !== undefined) {
        for (let row = 0; row < fields.rows; row++) {
          for (let i = 0; i < this.fields[row].length; i++) {
            if (this.fields[row][i] === 0 && fields.result[row].includes(i)) {
              this.fields[row][i] = 2
            }
            if (this.fields[row][i] === 0 && !fields.result[row].includes(i)) {
              this.fields[row][i] = 1
            }
          }
        }
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
  .tower {
    display: flex;
    justify-content: space-between;

    .tower-game {
      flex: 1;
      display: flex;
      justify-content: center;
      .tower-game-field {


        .tower-game-row {
          display: flex;
          .tower-game-item {
            height: 30px;
            width: 100px;
            border: 1px solid #FFF;
            border-radius: 4px;
            margin: 3px;

          }

          &.active {
            .tower-game-item {
              cursor: pointer;
              border-color: cornflowerblue;
            }
          }
        }
      }
    }
  }
</style>
