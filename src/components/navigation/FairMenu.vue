<template>
  <div class="fair-menu">
    <div class="fair-menu-title">Fair game</div>
    <div class="fair-menu-text">text text</div>


    <div class="fair-menu-data">
      <div class="fair-menu-client">
        <div class="block-input block-switch" :class="{ error: clientSeedError}">

          <label><img src="@/assets/games/icon_monitor.svg" alt="" />Client seed</label>

          <div class="block-switch-block">
            <button @click.prevent="clientRandom = !clientRandom" :class="{ active: clientRandom }">RANDOM</button>
            <button @click.prevent="clientRandom = !clientRandom" :class="{ active: !clientRandom }">MANUAL</button>
          </div>

          <div class="bet-input-block">
            <div class="error-tooltip" v-show="clientSeedError"><span>{{ clientSeedError }}</span></div>
            <input type="text" v-model="clientSeedShow" :readonly="clientRandom">
          </div>

        </div>
        <div class="block-input">
          <button v-show="clientRandom" @click="changeClientSeed()" class="block-input-save">Generate new random</button>
          <button v-show="!clientRandom" @click="saveClientSeed()" class="block-input-save">Save</button>
        </div>
      </div>
      <div class="fair-menu-server">
        <div class="block-input">

          <label><img src="@/assets/games/icon_plug.svg" alt="" />Next server seed hashed</label>
          <div class="bet-input-block">
            <input type="text" :value="serverSeedHashedShow" readonly>
          </div>

        </div>
        <div class="block-input">
          <button @click="getServerSeedNext()" class="block-input-save" :class="{ 'button-loading': serverSeedLoader }" :disabled="serverSeedLoader">Next server seed</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import random from '@/mixins/random'
export default {
  name: 'FairMenu',
  mixins: [random],
  data() {
    return {
      clientRandom: true,
      clientSeedShow: '',
      clientSeedError: null,

      serverSeedHashedShow: '',
      serverSeedLoader: false,
      serverSeedGenerator: null,
    }
  },
  computed: {
    serverSeedHashed: function() {
      return this.$store.getters.getServerSeedHash
    },
    socketServerSeedNext: function() {
      return this.$store.getters.subscribeSocketServerSeedNext
    }
  },
  watch: {
    clientRandom: function(value) {
      this.clientSeedError = null

      if (value === true) {
        this.clientSeedShow = this.getRandomString(32)
        this.setClientSeed(this.clientSeedShow)
        this.$store.commit('setClientSeedMode', 'random')
      } else {
        this.clientSeedShow = ''
      }
    },
    serverSeedHashed: function(value) {
      this.serverSeedHashedShow = value
    },
    socketServerSeedNext: function(data) {
      if (data === null) return

      this.receiveServerSeedNext(data)
    },
  },
  created () {
    this.clientRandom = this.$store.getters.isClientSeedRandom
    this.clientSeedShow = this.$store.getters.getClientSeed
    this.serverSeedHashedShow = this.$store.getters.getServerSeedHash

    this.$store.commit('subscribeSocketServerSeedNext')
  },
  methods: {
    setClientSeed: function(value) {
      this.$store.commit('setClientSeed', value)
    },
    changeClientSeed: function() {
      this.animateChange(this.getRandomString(32), 'client_seed')
    },
    saveClientSeed: function() {
      this.clientSeedError = null

      if (this.clientSeedShow.length < 6) {
        this.clientSeedError = 'The minimum client secret length is 6 characters'
        return
      }
      if (this.clientSeedShow.length > 64) {
        this.clientSeedError = 'The maximum client secret length is 64 characters'
        return
      }
      if (this.clientSeedShow.search('^[A-Za-z0-9]+$')) {
        this.clientSeedError = 'Client secret may only contain letters and numbers'
        return
      }

      this.$store.commit('setClientSeed', this.clientSeedShow)
      this.$store.commit('setClientSeedMode', 'manual')
    },
    getServerSeedNext: function() {
      if (this.serverSeedLoader === true) return
      this.serverSeedLoader = true

      this.serverSeedGenerator = setInterval(() => {
        this.serverSeedHashedShow = this.getRandomString(32)
      }, 50)

      this.$store.dispatch('sendSocketServerSeedNext')
    },
    receiveServerSeedNext: function(answer) {
      this.serverSeedLoader = false
      clearInterval(this.serverSeedGenerator)

      if (answer.status === 'success') {
        this.$store.commit('setServerSeedHash', answer.data)
      } else {
        this.$store.dispatch('notification', { type: 'error', text: answer.message, isClose: false, timer: 2000 }).then()
      }
    },
    animateChange: function (newData, type) {
      const self = this

      function setDeceleratingTimeout (factor, times) {
        const internalCallback = (function (tick, counter) {
          return function () {
            if (tick === 0) {
              if (type === 'client_seed') {
                self.clientSeedShow = newData
                self.setClientSeed(newData)
              }
            }

            if (--tick >= 0) {
              window.setTimeout(internalCallback, ++counter * factor)
              if (type === 'client_seed') {
                self.clientSeedShow = self.getRandomString(32)
              }
            }
          }
        })(times, 0)
        window.setTimeout(internalCallback, factor)
      }

      setDeceleratingTimeout(10, 10) // time, count
    },
  }
}
</script>

<style lang="scss" scoped>
  .fair-menu {
    position: absolute;
    bottom: 60px;

    min-width: 300px;
    text-align: left;

    background-color: #131525;
    border: 1px solid #3e447c;
    border-radius: 6px;
    padding: 15px 20px;

    .fair-menu-title {

    }
    .fair-menu-text {
      color: #6871C1;
      margin: 10px 0;

    }

    .fair-menu-data {
      .fair-menu-client, .fair-menu-server {
        border-top: 2px solid #1A1D33;
        margin-top: 20px;
      }
      .block-input {
        padding-top: 10px;
        > label {
          padding-left: 0;
          padding-right: 0;
        }

        &.block-switch {
          .block-switch-block {
            margin-bottom: 10px;
          }
        }

        .bet-input-block {
          > input {
            font-size: 14px;
            line-height: 22px;
          }
        }
      }
    }
  }
</style>
