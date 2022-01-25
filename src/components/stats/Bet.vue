<template>
  <div class="bet-info">
    <div class="bet-info-bg" @click="closeModal()"></div>
    <div class="bet-info-modal">
      <div class="bet-info-head">
        <div class="bet-info-id"><span>#</span>{{ betId }}</div>
        <div><a @click="closeModal()">&#10006;</a></div>
      </div>
      <div class="bet-info-info" v-if="betData !== null">
        <div class="bet-info-game">{{ gameNames[betData.game] }}</div>
        <div class="bet-info-user">
          <div><Avatar :avatar="betData.user.avatar !== undefined ? betData.user.avatar : betData.session" :size="20" /></div>
          <div>user</div>
        </div>
        <div class="bet-info-time">{{ printTimeFull(betData.time) }}</div>
      </div>

      <div class="bet-info-data" v-if="betData !== null">

        <div class="bet-box-group">
          <div class="bet-box">
            <div class="bet-box-title">BET</div>
            <div class="bet-box-value">{{ betData.bet }} <Currency :symbol="betData.currency" :size="16" /></div>
          </div>
          <div class="bet-box">
            <div class="bet-box-title">WIN</div>
            <div class="bet-box-value">{{ betData.win }} <Currency :symbol="betData.currency" :size="16" /></div>
          </div>
          <div class="bet-box">
            <div class="bet-box-title">PROFIT</div>
            <div class="bet-box-value">{{ betData.win - betData.bet }} <Currency :symbol="betData.currency" :size="16" /></div>
          </div>
        </div>


        <BetDice v-if="betData.game === 1" :bet-data="betData" />

      </div>

      <div class="bet-info-verify" v-if="betData !== null">
        <div class="bet-info-verify-open" @click="toggleVerification" :class="{ open: verification }">
          <div>Bet verification info</div>
          <div><img class="bet-info-verify-arrow" src="@/assets/games/icon_arrow_down.svg" alt="" /></div>
        </div>

        <transition name="fade">

          <div class="bet-info-verify-data" v-show="verification">

            <div class="bet-info-verify-group">
              <label for="serverSeed">Server seed</label>
              <div class="bet-info-verify-input">
                <input type="text" :value="betData.server_seed" id="serverSeed" onclick="this.select()" readonly>
                <button class="tooltip" data-tooltip="Copied!" @click="copy($event, 'serverSeed')"><img src="@/assets/games/icon_copy.svg" alt="" /></button>
              </div>
            </div>

            <div class="bet-info-verify-group">
              <label for="serverSeedHashed">Server seed hashed</label>
              <div class="bet-info-verify-input">
                <input type="text" :value="getHashed(betData.server_seed)" id="serverSeedHashed" onclick="this.select()" readonly>
                <button class="tooltip" data-tooltip="Copied!" @click="copy($event, 'serverSeedHashed')"><img src="@/assets/games/icon_copy.svg" alt="" /></button>
              </div>
            </div>

            <div class="bet-info-verify-group">
              <label for="clientSeed">Client seed</label>
              <div class="bet-info-verify-input">
                <input type="text" :value="betData.client_seed" id="clientSeed" onclick="this.select()" readonly>
                <button class="tooltip" data-tooltip="Copied!" @click="copy($event,'clientSeed')"><img src="@/assets/games/icon_copy.svg" alt="" /></button>
              </div>
            </div>

          </div>

        </transition>

      </div>
    </div>
  </div>
</template>

<script>
import SHA256 from 'crypto-js/sha256'
import times from '@/mixins/times'
import copy from '@/mixins/copy'
import Avatar from '@/components/Avatar'
import BetDice from '@/components/stats/Bet/BetDice'
import Currency from '@/components/Currency'
export default {
  name: 'Bet',
  components: { Currency, BetDice, Avatar },
  mixins: [times, copy],
  data() {
    return {
      loader: true,
      verification: false,
      betData: null
    }
  },
  computed: {
    gameNames: function() {
      return this.$store.getters.getGameNames
    },
    betId: function() {
      return this.$store.getters.getModalBetId
    }
  },
  created () {
    this.load()
  },
  methods: {
    load: function() {
      this.loader = true

      this.axios.post(process.env.VUE_APP_API_STATS + '/bet/' + this.betId)
        .then(response => {
          if (response.data.status === 'success') {
            this.loader = false

            console.log(response)
            this.betData = response.data.data
          } else {
            this.$store.dispatch('notification', { type: 'error', text: response.data.message, timer: 3000 }).then()
          }
        })
        .catch(() => {
          this.$store.dispatch('notification', { type: 'error', text: 'Error load bet info', timer: 3000 }).then()
        })
    },
    getHashed: function (value) {
      return SHA256(value)
    },
    toggleVerification: function() {
      this.verification = !this.verification
    },
    closeModal: function() {
      this.$store.commit('closeModalBet')
    }
  }
}
</script>

<style lang="scss">
  .bet-info {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10;

    display: flex;
    justify-content: center;
    align-items: center;

    .bet-info-bg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;

      background-color: black;
      background-color: rgba(0, 0, 0, 0.2);
      -webkit-transition: 0.5s;
      overflow: auto;
      transition: all 0.3s linear;
    }


    .bet-info-modal {
      width: 420px;
      background-color: #131525;
      border: 1px solid #1A1D33;
      box-shadow: 0 0 10px 2px #1A1D33;
      border-radius: 8px;
      padding: 20px 20px 5px 20px;
      z-index: 11;

      .bet-info-head {
        display: flex;
        justify-content: space-between;
        margin-left: -10px;
        .bet-info-id {
          > span {
            color: #6871C1;
            margin-right: 3px;
          }
        }
      }
      .bet-info-info {
        display: flex;
        padding: 10px 3px 15px 3px;

        > div {
          margin-right: 20px;
        }
        .bet-info-game {
          color: #6871C1;
        }
        .bet-info-user {
          display: flex;
          > div {
            &:first-of-type {
              margin-right: 10px;
            }
          }
        }
      }
      .bet-info-data {
        border-top: 2px solid #1A1D33;
        padding: 5px 0;

        .bet-box-group {
          display: flex;
        }
        .bet-box {
          flex: 1;
          margin: 5px 10px;
          padding: 10px 0;
          background-color: #080911;
          border-radius: 10px;
          .bet-box-title {
            color: #6871C1;
            font-size: 14px;
          }
          .bet-box-value {
            font-size: 18px;
            display: flex;
            justify-content: center;
            align-items: center;
            .currency {
              margin-left: 5px;
            }

          }
        }
      }
      .bet-info-verify {
        margin-top: 20px;

        .fade-enter-active,
        .fade-leave-active {
          transition: .3s ease;
        }

        .fade-enter-to {
          //transform: translateY(100%);
        }

        .fade-enter-from,
        .fade-leave-to {
          opacity: 0;
        }


        .bet-info-verify-open {
          cursor: pointer;
          font-size: 14px;
          color: #6871C1;
          display: flex;
          justify-content: space-between;
          transition: .3s ease;

          .bet-info-verify-arrow {
            transition: .3s ease;
          }
          &.open {
            color: #FFF;
            .bet-info-verify-arrow {
              transform: rotate(180deg);
            }
          }
        }
        .bet-info-verify-data {
          text-align: left;


          .bet-info-verify-group {
            padding-bottom: 10px;

            label {
              padding-left: 5px;
              color: #6871C1;
              font-size: 14px;

            }
            .bet-info-verify-input {
              padding: 5px;
              display: flex;
              background-color: #080911;
              border-radius: 6px;
              input {
                width: 100%;
                outline: 0;
                border: 0;
                background-color: #080911;
                color: #FFF;
              }
              button {
                background-color: transparent;
                width: 30px;
                height: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                > img {
                  height: 14px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
