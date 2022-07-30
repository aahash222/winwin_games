<template>
  <div class="holes-editor" id="holesEditor">

    <transition name="slide-fade" mode="out-in">
      <div v-show="customOpen" class="custom-save-presets">
        <div class="custom-clear" @click="clearPresets">CLEAR ALL <img src="@/assets/icons/icon_trash.svg" alt="" /></div>
        <div class="presets-title">MY PRESETS</div>
        <div v-if="customPresets.length === 0">no presets</div>
        <div v-else>
          <div v-for="(item, key) in customPresets" :key="key" class="holes-select" @click="selectPreset(key)">
            <div v-for="(hole, keyHole) in item" :key="keyHole" class="hole">
              <span class="hole-data disable-selection"><span>{{ hole }}</span><span>x</span></span>
            </div>
          </div>
        </div>
        <div class="presets-close"><span @click="closePresets"><img src="@/assets/icons/icon_close.svg" alt="" /> close</span></div>
      </div>
    </transition>


    <div class="holes-editor-mobile">EASY</div>
    <div class="holes-select holes-easy" id="holesEasy" @click="changeRisk('easy')">
      <div class="holes-edit-left">EASY</div>

      <div v-for="i in gamePresets[0][arrayRows.indexOf(rows)].length" :key="'easy-'+i" class="hole">
        <span class="hole-data disable-selection"><span>{{gamePresets[0][arrayRows.indexOf(rows)][i-1]}}</span><span>x</span></span>
      </div>

      <div class="holes-edit-right">EASY</div>
    </div>

    <div class="holes-editor-mobile">MID</div>
    <div class="holes-select holes-mid" id="holesMID" @click="changeRisk('mid')">
      <div class="holes-edit-left">MID</div>

      <div v-for="i in gamePresets[1][arrayRows.indexOf(rows)].length" :key="'MID-'+i" class="hole">
        <span class="hole-data disable-selection"><span>{{gamePresets[1][arrayRows.indexOf(rows)][i-1]}}</span><span>x</span></span>
      </div>

      <div class="holes-edit-right">MID</div>
    </div>

    <div class="holes-editor-mobile">HARD</div>
    <div class="holes-select holes-hard" id="holesHard" @click="changeRisk('hard')">
      <div class="holes-edit-left">HARD</div>

      <div v-for="i in gamePresets[2][arrayRows.indexOf(rows)].length" :key="'hard-'+i" class="hole">
        <span class="hole-data disable-selection"><span>{{gamePresets[2][arrayRows.indexOf(rows)][i-1]}}</span><span>x</span></span>
      </div>

      <div class="holes-edit-right">HARD</div>
    </div>

    <div class="holes-custom">

      <div class="holes-custom-title">CUSTOM</div>
      <div class="holes-select" id="holesCustom">
        <div v-for="i in gameHolesValue.length" :key="i" class="hole hole-input">
          <input type="text" :value="gameHolesValue[i-1]" maxlength="7" @input="changeCustom" :id="'custom-'+i">
          <div class="hole-tooltip disable-selection" :class="{error: gameHoleErrors.indexOf(i-1) !== -1, shake: gameHoleErrors.indexOf(i-1) !== -1}" v-if="getMaxPrize(i-1) !== 0">
            <div><span>MAX PRIZE</span><span>{{getMaxPrize(i-1)}}x</span></div>
          </div>
        </div>
      </div>
      <div class="holes-rtp">
        <div class="custom-buttons">

          <div v-if="customSaved" class="custom-buttons-save"><img src="@/assets/icons/icon_save.svg" alt="" /></div>
          <button @click="savePreset"><svg src="@/assets/icons/icon_save.svg" alt="" /></button>
          <button @click="openPresets"><img src="@/assets/icons/icon_open.svg" alt="" /></button>
        </div>
        <div class="holes-rtp-value-wrap">
          <div class="holes-rtp-value" :class="{error: gameRTPError, shake: gameRTPError}">
            <span>RTP {{gameRTP}}%</span>
            <span class="holes-rtp-help"><img src="@/assets/icons/icon_question.svg" alt="" /></span>

            <div class="holes-rtp-tooltip">

              <div>RTP (Return To Player) is calculated this way: sum all chances to hit a certain multiplier slot * the coefficient</div>
              <div>RTP cannot be > {{ rtp }}%</div>
              <div>Mouseover to see the chances to hit a certain multiplier/plinko slot</div>

            </div>

            <div class="holes-rtp-error" v-show="gameRTPError" :class="{shake: gameRTPError}">
              <div>RTP must be at most {{ rtp }}%</div>
            </div>
          </div>
        </div>

        <div></div>
        <!--
        <div class="max-bet">max bet: <span>{{ maxBet.toFixed(8) }}</span><cryptoicon :symbol="selectCurr" size="10" /></div>
        -->
      </div>



    </div>
  </div>
</template>

<script>
export default {
  name: 'PlinkoEditor',
  props: {
    rtp: { type: Number },
    rows: { type: Number },
    gameRTP: { type: Number },
    gameRTPError: { type: Boolean },
    arrayRisks: { type: Array },
    arrayRows: { type: Array },
    gamePresets: { type: Array },
    gameHoles: { type: Array },
  },
  data() {
    return {
      customOpen: false,
      customSaved: false,
      customPresets: [],
      gameHoleErrors: [],

      gamePrizeMax: [
        [40, 10, 0, 0, 0, 0, 0, 10, 40],
        [55, 13, 0, 0, 0, 0, 0, 0, 13, 55],
        [95, 15, 0, 0, 0, 0, 0, 0, 0, 15, 95],
        [150, 35, 12, 0, 0, 0, 0, 0, 0, 12, 35, 150],
        [210, 45, 13, 0, 0, 0, 0, 0, 0, 0, 13, 45, 210],
        [325, 55, 15, 0, 0, 0, 0, 0, 0, 0, 0, 15, 55, 326],
        [525, 85, 25, 13, 0, 0, 0, 0, 0, 0, 0, 13, 25, 85, 525],
        [775, 130, 35, 17, 0, 0, 0, 0, 0, 0, 0, 0, 17, 35, 130, 775],
        [1250, 200, 50, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 50, 200, 1250],
      ],
    }
  },
  computed: {
    gameHolesValue: {
      get: function() {
        return this.gameHoles
      },
      set: function(value) {

      }
    }
  },
  methods: {
    savePreset: function() {
      const storedPlinko = JSON.parse(localStorage.getItem('plinko_presets'))

      if (storedPlinko === null || storedPlinko.length !== 9) {
        const store = [[], [], [], [], [], [], [], [], []]
        const storeRows = []
        storeRows.unshift(this.gameHoles)
        store[this.arrayRows.indexOf(this.rows)] = storeRows

        localStorage.setItem('plinko_presets', JSON.stringify(store))
      } else {
        const storeRows = storedPlinko[this.arrayRows.indexOf(this.rows)]
        let isFind = false
        for (let i = 0; i < storeRows.length; i++) {
          if (JSON.stringify(storeRows[i]) === JSON.stringify(this.gameHoles)) {
            isFind = true
            i = storeRows.length
          }
        }

        if (isFind === false) {
          while (storeRows.length >= 5) storeRows.pop()

          storeRows.unshift(this.gameHoles)
          storedPlinko[this.arrayRows.indexOf(this.rows)] = storeRows
          localStorage.setItem('plinko_presets', JSON.stringify(storedPlinko))
        }
      }

      this.customSaved = true
      setTimeout(() => {
        this.customSaved = false
      }, 500)
    },
    openPresets: function() {
      const storedPlinko = JSON.parse(localStorage.getItem('plinko_presets'))
      if (storedPlinko !== null) {
        this.customPresets = storedPlinko[this.arrayRows.indexOf(this.rows)]
      }
      this.customOpen = true
    },
    selectPreset: function(value) {
      this.$emit('selectPreset', value)
      this.customOpen = false
    },
    closePresets: function() {
      this.customOpen = false
    },
    clearPresets: function() {
      const storedPlinko = JSON.parse(localStorage.getItem('plinko_presets'))
      storedPlinko[this.arrayRows.indexOf(this.rows)] = []

      this.customPresets = []
      localStorage.setItem('plinko_presets', JSON.stringify(storedPlinko))
    },
    changeRisk: function (value) {
      this.$emit('changeRisk', value)
    },
    changeCustom: function(e) {
      //if (this.gameAutoActive === true) this.autoGameStop()

      if (e.data === ',') {
        e.target.value = e.target.value.replace(',', '.')
        return
      }

      if (e.data === '.') return

      const elem = e.target
      const id = parseInt(elem.id.substr(7, 2))
      let value = parseFloat(elem.value)

      if (value < 0 || isNaN(value)) {
        value = 0
        e.target.value = value
      }

      const dataHoles = []
      for (let i = 0; i < this.gameHoles.length; i++) {
        dataHoles[i] = this.gameHoles[i]
      }
      dataHoles[id - 1] = value

      this.$emit('setHoles', dataHoles)
      this.$emit('updateRtp')
      this.checkHoleMaximum(id - 1, value)
    },
    checkHoleMaximum: function(id, value) {
      if (this.gameHoleErrors.indexOf(id) !== -1) {
        this.gameHoleErrors.splice(this.gameHoleErrors.indexOf(id), 1)
      }

      const maxPrize = this.getMaxPrize(id)
      if (maxPrize === 0) return

      if (value > maxPrize) {
        this.gameHoleErrors.push(id)
      }
    },
    getMaxPrize: function(hole) {
      const row = this.gamePrizeMax[this.arrayRows.indexOf(this.rows)]

      return row[hole]
    },

  }
}
</script>

<style lang="scss" scoped>
  .holes-editor {
    position: absolute;
    left: 10%;
    right: 10%;
    bottom: 0;

    display: flex;
    //margin: 10px auto 0 auto;
    justify-content: space-between;
    //position: relative;
    flex-direction: column;
    background-color: #131525;
    border: 1px solid #3e447c;

    padding: 8px;
    border-radius: 12px;


    .slide-fade-enter-active,
    .slide-fade-leave-active  {
      transition: all .3s linear;
    }
    .slide-fade-enter, .slide-fade-leave-to {
      opacity: 0;
    }



    .custom-save-presets {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0 4px 0 4px;

      background-color: #1d1e23;
      /*opacity: 0.95;*/

      border: 1px solid rgba(0, 191, 255, 0.9);
      border-radius: 4px;

      z-index: 2;

      display: flex;
      flex-direction: column;

      .presets-close {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        cursor: pointer;
      }
      .presets-title {
        font-weight: bold;
      }
      .custom-clear {
        > img {
          height: 20px;
        }
      }
    }

    .holes-editor-mobile {
      display: none;
    }

    .holes-select {
      display: flex;
      justify-content: space-between;
      position: relative;


      padding: 3px;
      margin: 0 -3px;
      border-radius: 4px;
      transition: .3s ease;
      cursor: pointer;
      &:hover {
        background-color: #63666e;
      }
      &.holes-easy {
        > .hole {
          background-color: #0EAF51;
        }
      }
      &.holes-mid {
        > .hole {
          background-color: #FFDD47;
        }
      }
      &.holes-hard {
        > .hole {
          background-color: #FF4D4D;
        }
      }

      .holes-edit-left,
      .holes-edit-right {
        position: absolute;
        width: 80px;
        font-weight: 700;
      }
      .holes-edit-left {
        left: -90px;
        text-align: right;
      }
      .holes-edit-right {
        right: -90px;
        text-align: left;
      }
    }

    .holes-custom {
      .holes-custom-title {
        display: block;
        font-weight: bold;
        text-align: left;

        padding-left: 4px;
      }

      .hole-input {
        display: flex;
        justify-content: center;
        position: relative;
        > input {
          background-color: #282a2c;
          border: 1px solid #00acff;
          border-radius: 4px;

          flex:1;
          display:block;

          min-width:0;
          width: 100%;
          font-weight: bold;

          padding: 4px 0;
          text-align: center;
          color: #FFF;
        }
        .hole-tooltip > div > span {
          min-width: unset;
        }


      }

      .holes-rtp {
        position: relative;
        margin-top: 5px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        > div {
          flex: 1;
        }

        .custom-buttons {
          display: flex;
          position: relative;

          button {
            border: 1px solid #00769c;
            border-radius: 4px;
            background-color: #282a2c;
            color: #FFF;

            width: 24px;
            height: 24px;
            padding: 0;

            display: flex;
            align-items: center;
            justify-content: center;
            transition: .3s ease;

            cursor: pointer;
            > img {
              height: 14px;
            }
            &:hover {
              border-color: #00bfff;
              box-shadow: none;
            }
            &:first-of-type {
              margin-right: 3px;
            }
          }
        }

        .holes-rtp-value-wrap {

          .holes-rtp-value {
            display: inline-flex;
            align-items: center;
            font-weight: bold;
            border: 2px solid #00acff;
            border-radius: 4px;
            color: #FFDD47;
            padding: 0 3px;
            z-index: 1;
            background-color: #3a3d46;
            position: relative;

            flex: 1;

            > span {
              &:first-of-type {
                margin-right: 3px;
              }
            }

            .holes-rtp-help {
              color: #FFFC;
              font-size: 12px;
              vertical-align: baseline;
              cursor: pointer;
              display: flex;
              img {
                height: 12px;
              }

              &:hover + .holes-rtp-tooltip {
                visibility: visible;
                opacity: 1;
              }
            }

            .holes-rtp-tooltip {
              visibility: hidden;
              opacity: 0;

              background-color: #161718;
              color: #FFF;
              border: 1px solid #00769c;
              border-radius: 4px;
              padding: 3px 5px;
              position: absolute;
              z-index: 1;
              bottom: 125%;
              transition: opacity 0.3s;
              font-size: 10px;
              width: 260px;
              margin-left: -70px;
              text-align: left;

              &:after {
                content: "";
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: 50px;
                border-width: 5px;
                border-style: solid;
                border-color: #161718 transparent transparent transparent;
              }

            }

            &.error {
              color: #FF4D4D;
            }

            .holes-rtp-error {
              position: absolute;
              //left: 0;
              //right: 0;
              //bottom: 32px;
              margin-left: 100%;
              width: 159px;
              font-size: 12px;

              &:before {
                content: '';
                position: absolute;
                display: block;
                width: 0;
                height: 0;
                left: 0;
                top: 0;
                bottom: 0;
                margin: auto 0;

                border: 4px solid transparent;
                border-right-color: #FF4D4D;
                border-left: 0;
              }
              > div {
                display: inline-block;

                background-color: #3a3d46;
                border: 1px solid #FF4D4D;
                border-radius: 4px;
                padding: 0 5px;
              }
            }
          }
        }
      }



    }


  }
</style>
