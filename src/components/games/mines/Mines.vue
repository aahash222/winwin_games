<template>
  <div class="game-mines">

    <div class="game-mines-wrap">

      <div class="game-block">
        <div class="game-mines-payout-next">
          <div v-show="active">Next possible win:</div>
          <div v-show="active" class="game-mines-payout-next-amount">+ {{ nextPayoutAmount }} <Currency :symbol="userCurrency" :size="20" /> <span>x{{ nextPayout }}</span></div>

          <div v-show="!active" class="game-mines-payout-next-start">Press <span>"ROLL"</span> to start game</div>
        </div>

        <div class="mines-game-field" :class="{ active: active, ended: ended }">

          <div v-for="row in 5" :key="row" class="mines-game-row">
            <div
              v-for="line in 5"
              :key="line"
              @click="sendSelect(((row - 1) * 5 + line) - 1)"
              :class="{closed: fields[((row - 1) * 5 + line) - 1] === 0, open: fields[((row - 1) * 5 + line) - 1] === 1, bomb: fields[((row - 1) * 5 + line) - 1] === 2, boom: fields[((row - 1) * 5 + line) - 1] === 3}"
              class="mines-game-item"
            >
              <div v-if="fields[((row - 1) * 5 + line) - 1] === 0"><img src="@/assets/games/mines/planet.svg" alt="" /></div>

              <div v-else-if="fields[((row - 1) * 5 + line) - 1] === 1"><img src="@/assets/games/mines/planet_open.svg" alt="" /></div>

              <div v-else-if="fields[((row - 1) * 5 + line) - 1] === 2"><img src="@/assets/games/mines/bomb.svg" alt="" /></div>

              <div v-else-if="fields[((row - 1) * 5 + line) - 1] === 3">
                <MinesBoom />
              </div>

              <div v-else>{{ fields[((row - 1) * 5 + line) - 1] }}</div>
            </div>
          </div>

          <transition name="slide-fade-win">
            <div v-show="ended === true && winAmount > 0" class="game-mines-win">
              <div>You won <span>{{winAmount}}</span> <Currency :symbol="userCurrency" :size="30" /></div>
            </div>
          </transition>

        </div>
      </div>

      <MinesBet
        :locked="loader"
        :active="active"
        :open="open"
        :bet="bet"
        :mines="mines"
        :current-payout="currentPayout"
        :current-payout-amount="currentPayoutAmount"
        :errors="errors"
        @changeBet="changeBet"
        @changeMines="changeMines"
        @sendBet="sendBet"
        @sendCashout="sendCashout"
        @openRandom="openRandom"
      />
    </div>
  </div>
</template>

<script>
import MinesBet from '@/components/games/mines/MinesBet'
import random from '@/mixins/random'
import MinesBoom from '@/components/games/mines/MinesBoom'

export default {
  name: 'Mines',
  components: { MinesBoom, MinesBet },
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
      winAmount: 0.0,
      fields: [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
      ],
      errors: {}
    }
  },
  created () {
    this.$store.commit('subscribeSocketMines')
    this.$store.commit('subscribeSocketMinesBet')
    this.$store.commit('subscribeSocketMinesSelect')
    this.$store.commit('subscribeSocketMinesCashout')

    //this.clientSeed = this.getRandomString(32)
  },
  computed: {
    clientSeed: function() {
      return this.$store.getters.getClientSeed
    },
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
    userCurrency: function() {
      return this.$store.getters.getUserCurrency
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

      this.errors = {}
      this.loader = true
      this.$store.dispatch('sendSocketMinesBet', {
        bet: this.bet,
        mines: this.mines,
        client_seed: this.clientSeed
      })

      this.winAmount = 0.0
      this.$store.dispatch('setClientSeedAfterBet')
    },
    sendSelect: function (index) {
      if (this.active !== true) return

      this.loader = true
      this.$store.dispatch('sendSocketMinesSelect', { position: index })
    },
    sendCashout: function () {
      this.loader = true
      this.$store.dispatch('sendSocketMinesCashout', null)
    },
    openRandom: function() {
      if (this.active !== true || this.loader) return

      const closedFields = []
      for (let i = 0; i < this.fields.length; i++) {
        if (this.fields[i] === 0) {
          closedFields.push(i)
        }
      }
      const randomField = Math.floor(Math.random() * closedFields.length)
      this.sendSelect(closedFields[randomField])
    },

    receiveMines: function (answer) {
      if (answer.status === 'success') {
        this.rtp = answer.data.rtp
        this.$store.commit('setServerSeedHash', answer.data.server_seed_hash)

        if (answer.data.fields !== undefined) {

          if (answer.data.fields.select !== undefined) {
            for (let i = 0; i < answer.data.fields.select.length; i++) {
              this.fields[answer.data.fields.select[i]] = 1
            }
            this.open = answer.data.fields.select.length
            this.active = true
          }
        }
      } else if (answer.status === 'error') {
        this.$store.dispatch('notification', { type: 'error', text: answer.message, isClose: false, timer: 2000 }).then()
      }
      this.loader = false
    },
    receiveMinesBet: function (answer) {
      if (answer.status === 'success') {
        for (let i = 0; i < this.fields.length; i++) {
          this.fields[i] = 0
        }

        this.$store.commit('setUserBalance', answer.data.balance)
        this.$store.commit('setServerSeedHash', answer.data.server_seed_hash)

        this.open = 0
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
    receiveMinesSelect: function (answer) {
      if (answer.status === 'success') {
        this.open++

        const isEnd = this.openFields(answer.data.fields)

        // игра завершена, открываем бомбы
        if (isEnd) {
          this.active = false
          this.ended = true
        }

        // если открыты все кристаллы, то выдаем приз
        if (answer.data.game !== undefined) {
          this.$store.commit('setUserBalance', answer.data.game.balance)
          if (answer.data.game.win > 0) {
            this.winAmount = answer.data.game.win
          }
        }
      } else if (answer.status === 'error') {
        this.$store.dispatch('notification', { type: 'error', text: answer.message, isClose: false, timer: 2000 }).then()
      }

      this.loader = false
    },
    receiveMinesCashout: function (answer) {
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
  .game-mines {
    height: 100%;




    .game-mines-wrap {
      display: flex;
      justify-content: space-between;
      height: 100%;

      .game-block {
        flex: 1;

        background-color: #0C0E1C;
        background-image: url("./../../../assets/games/mines/mines_background.svg");
        background-size: cover;


        .game-mines-payout-next {
          height: 54px;
          margin: 20px 0;
          font-size: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .game-mines-payout-next-amount {
            font-size: 24px;
            color: #FFD05B;
            > span {
              font-size: 18px;
              color: #767FD1;
            }
          }
          .game-mines-payout-next-start {
            > span {
              color: #767FD1;
            }
          }
        }
        .mines-game-field {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;

          .mines-game-row {
            display: flex;

            .mines-game-item {
              height: 80px;
              width: 80px;
              margin: 4px;
              position: relative;

              > div {
                height: 80px;
                width: 80px;
                border-radius: 10px;
                background-color: #222646;
                z-index: 1;
                transition: .3s ease;
                position: relative;

                display: flex;
                justify-content: center;
                align-items: center;

                > img {
                  display: flex;
                  height: 55px;
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
                border-radius: 10px;
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
          }

          &.active {
            .mines-game-row {
              .mines-game-item {

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
                    30%, 50%, 70% { transform: translate3d(-4px, -4px, 0); }
                    40%, 60% { transform: translate3d(4px, 2px, 0); }
                  }
                }
              }
            }
          }

          &.ended {
            .mines-game-row {
              .mines-game-item {

                &.closed {
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

          .slide-fade-win-enter-active {
            animation: bounce-in 0.5s;
          }
          .slide-fade-win-leave-active {
            animation: bounce-in 0.3s reverse;
          }

          @keyframes bounce-in {
            0% {
              transform: scale(0);
            }
            50% {
              transform: scale(1.25);
            }
            100% {
              transform: scale(1);
            }
          }

          .game-mines-win {
            position: absolute;
            top: 0;
            bottom: 0;
            z-index: 10;

            display: flex;
            align-items: center;
            > div {
              display: flex;
              align-items: center;
              font-size: 32px;

              background-color: rgba(68, 87, 255, 0.49);
              padding: 5px 25px;
              border-radius: 12px;

              > span {
                margin-left: 15px;
                color: #FFD05B;
              }
              .currency {
                margin-left: 5px;
              }
            }


          }
        }

      }
    }
  }
</style>
