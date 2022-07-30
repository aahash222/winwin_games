<template>
  <div class="game-tower">

    <div class="game-tower-wrap">

      <div class="game-block">

        <div v-if="loadConfig" class="tower-game-field" :class="{active: active, ended: ended}">
          <div v-for="row in selected.rows" :key="row" class="tower-game-row" :class="{active: active && currentRow === row-1, opened: active && currentRow > row-1}">
            <div class="tower-game-payout">
              <div class="tower-game-payout-amount">{{ calcPayoutAmount(Math.floor(Math.pow(payoutPerLine, row) * 10000)/10000, bet) }} <currency :symbol="userCurrency" :size="14" /></div>
              <div class="tower-game-payout-value">x{{ Math.floor(Math.pow(payoutPerLine, row) * 10000)/10000 }}</div>
            </div>

            <div
              v-for="column in selected.columns"
              :key="column"
              @click="sendSelect(column-1)"
              :class="{closed: fields[row-1][column-1] === 0, open: fields[row-1][column-1] === 1, bomb: fields[row-1][column-1] === 2, boom: fields[row-1][column-1] === 3}"
              class="tower-game-item"
            >
              <div v-if="fields[row-1][column-1] === 0"><img src="@/assets/games/tower/planet_closed.svg" alt="" /></div>
              <div v-else-if="fields[row-1][column-1] === 1"><img src="@/assets/games/tower/planet_open.svg" alt="" /></div>
              <div v-else-if="fields[row-1][column-1] === 2"><img src="@/assets/games/tower/bomb.svg" alt="" /></div>
              <div v-else-if="fields[row-1][column-1] === 3"><MinesBoom /></div>
              <div v-else>
                {{ fields[row-1][column-1] }}
              </div>
            </div>
          </div>

        </div>

      </div>

      <TowerBet
        :locked="loader"
        :config="config"
        :select="select"
        :bet="bet"
        :active="active"
        :open="open"
        :current-payout="currentPayout"
        :current-payout-amount="currentPayoutAmount"
        :errors="errors"
        @changeBet="changeBet"
        @changeSelect="changeSelectConfig"
        @sendBet="sendBet"
        @sendCashout="sendCashout"
        @openRandom="openRandom"
      />
    </div>
  </div>
</template>

<script>
import random from '@/mixins/random'
import TowerBet from '@/components/games/tower/TowerBet'
import MinesBoom from '@/components/games/mines/MinesBoom'
export default {
  name: 'Tower',
  components: { MinesBoom, TowerBet },
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
      errors: {},

      fields: [],
      // позиции клеток
      // 0 - закрыта
      // 1 - открыта пустая (кристалл)
      // 2 - мина не взорвалась
      // 3 - попал на мину
    }
  },
  computed: {
    clientSeed: function() {
      return this.$store.getters.getClientSeed
    },
    userCurrency: function() {
      return this.$store.getters.getUserCurrency
    },
    selected: function() {
      for (let i = 0; i < this.config.length; i++) {
        if (this.select === this.config[i].name) {
          return this.config[i]
        }
      }
      return null
    },
    payoutPerLine: function() {
      if (this.selected === null) return 0
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
    },
    currentPayout: function() {
      return Math.floor(Math.pow(this.payoutPerLine, this.currentRow) * 10000) / 10000
    },
    currentPayoutAmount() {
      return this.calcPayoutAmount(this.currentPayout, this.bet)
    },
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

    //this.clientSeed = this.getRandomString(32)
  },
  methods: {
    sendBet: function() {
      if (this.loader || this.active) return

      this.errors = {}
      this.loader = true
      this.$store.dispatch('sendSocketTowerBet', {
        bet: this.bet,
        config: this.select,
        client_seed: this.clientSeed
      })

      this.$store.dispatch('setClientSeedAfterBet')
    },
    sendSelect: function(index) {
      if (!this.active) return

      this.loader = true
      this.$store.dispatch('sendSocketTowerSelect', {
        position: index,
      })
    },
    sendCashout: function() {
      this.loader = true
      this.$store.dispatch('sendSocketTowerCashout', null)
    },
    openRandom: function() {
      if (!this.active || this.loader) return

      const randomField = Math.floor(Math.random() * this.selected.columns)
      this.sendSelect(randomField)
    },

    receiveSocketTower: function(answer) {
      if (answer.status === 'success') {
        this.rtp = answer.data.rtp
        this.config = answer.data.config
        this.$store.commit('setServerSeedHash', answer.data.server_seed_hash)
      }
      this.loader = false
      this.loadConfig = true
    },
    receiveSocketTowerBet: function(answer) {
      if (answer.status === 'success') {
        this.createFields()

        this.$store.commit('setUserBalance', answer.data.balance)
        this.$store.commit('setServerSeedHash', answer.data.server_seed_hash)

        this.open = 0
        this.currentRow = 0
        this.ended = false
        this.active = true
      } else if (answer.status === 'error') {
        if (answer.type !== undefined) {
          this.errors[answer.type] = answer.message
        } else {
          this.$store.dispatch('notification', { type: 'error', text: answer.message, isClose: false, timer: 2000 }).then()
        }
      }
      this.loader = false
    },
    receiveSocketTowerSelect: function(answer) {
      if (answer.status === 'success') {
        this.open++

        const isEnd = this.openFields(answer.data.fields)

        // игра завершена, открываем бомбы
        if (isEnd) {
          this.active = false
          this.ended = true
        } else {
          this.currentRow = answer.data.fields.select.length
        }

        // если открыты все кристаллы, то выдаем приз
        if (answer.data.game !== undefined) {
          this.$store.commit('setUserBalance', answer.data.game.balance)
        }
      } else if (answer.status === 'error') {
        this.$store.dispatch('notification', { type: 'error', text: answer.message, isClose: false, timer: 2000 }).then()
      }
      this.loader = false
    },
    receiveSocketTowerCashout: function(answer) {
      if (answer.status === 'success') {
        this.openFields(answer.data.fields)

        this.$store.commit('setUserBalance', answer.data.game.balance)

        if (answer.data.game.win > 0) {
          this.winAmount = answer.data.game.win
        }

        this.active = false
        this.ended = true
      } else if (answer.status === 'error') {
        this.$store.dispatch('notification', { type: 'error', text: answer.message, isClose: false, timer: 2000 }).then()
      }

      this.loader = false
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
            //if (this.fields[row][i] === 0 && !fields.result[row].includes(i)) {
            //  this.fields[row][i] = 1
            //}
          }
        }
        return true
      }
      return false
    },
    calcPayoutAmount: function(payout, bet) {
      const powNumber = Math.pow(10, this.$store.getters.getGameDecimal)
      return Math.floor(payout * bet * powNumber) / powNumber
    }
  }
}
</script>

<style lang="scss" scoped>
  .game-tower {
    height: 100%;

    .game-tower-wrap {
      display: flex;
      justify-content: space-between;
      height: 100%;

      .game-block {
        flex: 1;

        background-color: #0C0E1C;
        background-image: url("./../../../assets/games/tower/background.svg");
        background-size: cover;

        display: flex;
        align-items: center;
        justify-content: center;

        .tower-game-field {
          position: relative;
          display: flex;
          flex-direction: column-reverse;
          align-items: center;

          .tower-game-row {
            display: flex;
            position: relative;
            margin: 3px 0 0 0;
            padding: 4px 0 8px 0;

            border: 1px solid transparent;
            border-radius: 6px;
            transition: .3s ease;

            .tower-game-payout {
              position: absolute;
              top: -21px;
              left: 0;
              right: 0;
              z-index: 3;

              display: flex;
              justify-content: center;
              //align-items: center;
              transition: .3s ease;

              .tower-game-payout-amount {
                position: absolute;
                bottom: -4px;
                left: 10px;
                font-size: 14px;
                display: flex;
                align-items: center;

                padding: 0 5px;
                border-radius: 4px;
                .currency {
                  margin-left: 3px;
                }
              }
              .tower-game-payout-value {
                //margin: 0 auto;
                //min-width: 100px;
                height: 20px;
                padding: 0 20px;
                position: relative;

                background-color: #101326;

                border: 1px solid transparent;
                border-bottom: 0;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
                transition: .3s ease;
                &:after {
                  content: '';
                  position: absolute;
                  bottom: -4px;

                  background-color: #101326;
                  left: -1px;
                  right: -1px;
                  height: 4px;

                }
              }
            }
            .tower-game-item {
              height: 40px;
              width: 120px;
              margin: 0 4px;
              position: relative;

              > div {
                height: 40px;
                width: 120px;
                border-radius: 6px;
                background-color: #222646;
                z-index: 1;
                transition: .3s ease;
                position: relative;

                display: flex;
                justify-content: center;
                align-items: center;

                > img, > svg {
                  display: flex;
                  height: 40px;
                }
              }

              &:before {
                content: ' ';
                position: absolute;
                right: 0;
                left: 0;
                top: 0;
                bottom: 0;
                transform: translateY(4px);

                background-color: #1A1D36;
                border-radius: 8px;
              }

              &.closed {
                opacity: 0.5;
                > div {
                  background: linear-gradient(180deg, #4457FF 0%, #3C4DE1 100%);
                }
                &:before {
                  background-color: #2937B2;
                }
              }
              &.open {

              }
              &.bomb {
                > div {
                  background: radial-gradient(50% 50% at 50% 50%, #FC6600 0%, #DD385F 100%);
                }
                &:before {
                  background-color: #A62543;
                }
              }
              &.boom {
                > div {
                  background: radial-gradient(50% 50% at 50% 50%, #FC6600 0%, #DD385F 100%);
                }
                &:before {
                  background-color: #A62543;
                }
              }
            }

            &.active {
              border-color: #fff;

              .tower-game-payout {
                .tower-game-payout-amount {
                  background-color: #101326;
                }
                .tower-game-payout-value {
                  border-color: #fff;
                }
              }

              .tower-game-item {

                &.closed {
                  cursor: pointer;
                  opacity: 1;
                  &:hover {
                    > div {
                      > img {
                        animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
                        perspective: 1000px;
                      }
                      transform: translateY(2px);
                    }
                  }

                  @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, -1px, 0); }
                    20%, 80% { transform: translate3d(2px, 2px, 0); }
                    30%, 50%, 70% { transform: translate3d(-3px, -3px, 0); }
                    40%, 60% { transform: translate3d(3px, 2px, 0); }
                  }
                }

              }
            }

            &.opened {
              .tower-game-payout {
                transform: translateY(34px);
                .tower-game-payout-amount {
                  background-color: #101326;
                }
                .tower-game-payout-value {
                  border-radius: 6px;
                  border: 1px solid #939393;
                  background-color: #4457FF;
                  &:after {
                    display: none;
                  }
                }
              }
              .tower-game-item {
                &.closed {
                  opacity: 1;
                  > div {
                    background: #222646;
                    > img {
                      filter: blur(1px);
                    }
                  }
                  &:before {
                    background-color: #1A1D36;
                  }
                }

              }
            }
          }
        }

        &.active {
          .tower-game-row {

          }
        }

        &.ended {
          .tower-game-row {

          }
        }
      }
    }
  }
</style>
