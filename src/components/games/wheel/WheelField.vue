<template>
  <div class="wheel-game-field">

    <div class="wheel-game-field-background"></div>
    <div class="wheel-game-field-wheel">

      <svg class="wheel-svg" viewBox="-1 -1 2 2" :style="{ transform: rotationValue, transition: transitionValue, filter: filterValue }" xmlns="http://www.w3.org/2000/svg">

        <g id="svgPart"></g>

      </svg>

    </div>

    <div class="wheel-game-field-center">
      <img class="wheel-game-field-arrow" src="@/assets/games/wheel/arrow.svg" alt="" />

      <div class="wheel-payouts" id="wheelPayouts" :style="{ transform: transformValuePayouts, transition: transitionValuePayouts }">

        <div v-for="(item, key) in payouts" :key="key" :style="{ transform: `rotate(${key * (360 / payouts.length)}deg)` }" class="wheel-payouts-svg">
          <WheelPayoutsSvg
            :color-planet-start="colorCodes[item].planet_start"
            :color-planet-stop="colorCodes[item].planet_stop"
            :color-crater="colorCodes[item].crater"
            :color-crater-top="colorCodes[item].crater_top"
            :size="svgHeight"
          />
          <span :style="{ top: `${svgHeight/2 - 14}px`}"><span>x</span>{{ item }}</span>
        </div>

      </div>

      <div class="wheel-payouts">
        <div v-if="result !== -1" v-show="showPayoutsResult" :class="{ hide: hidePayoutsResult }" class="wheel-payouts-svg wheel-payout-result">
          <WheelPayoutsSvg
            :color-planet-start="colorCodesResult.planet_start"
            :color-planet-stop="colorCodesResult.planet_stop"
            :color-crater="colorCodesResult.crater"
            :color-crater-top="colorCodesResult.crater_top"
            :size="svgHeight"
          />
          <span><span>x</span>{{ config[result] }}</span>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import WheelPayoutsSvg from '@/components/games/wheel/WheelPayoutsSvg'
export default {
  name: 'WheelField',
  components: { WheelPayoutsSvg },
  props: {
    result: { default: -1 },
    run: { default: false },
    config: { type: Array },
    speed: { default: 3 }
  },
  data() {
    return {
      running: false,
      rotation: 0,
      rotationPayouts: 0,
      scalePayouts: 1,
      scalePayoutsResult: 0.1,
      showPayoutsResult: false,
      hidePayoutsResult: false,
      rotationInterval: null,
      rotationDuration: 0,

      angle: 0,
      anglePayouts: 0,
      spinStarted: false,
      spinTimeOut: null,
      spinTimeOutAnimation: null,
      resultTimeoutAnimation: null,

      sectors: [],

      svgHeight: 0,
      filterValue: 'drop-shadow(0px 0px 8px #5F80B1)',

      colorCodes: {
        0:    { main: '#00D183', inside: '#065236', planet_start: '#00D183', planet_stop: '#0B6845', crater: '#0A6946', crater_top: '#065236' },
        1.2:  { main: '#0388FF', inside: '#08569D', planet_start: '#00D183', planet_stop: '#0054D1', crater: '#065CAB', crater_top: '#012648' },
        1.5:  { main: '#873CFF', inside: '#583198', planet_start: '#B88CFF', planet_stop: '#873CFF', crater: '#7F45DE', crater_top: '#583198' },
        1.6:  { main: '#7438D4', inside: '#46247D', planet_start: '#B88CFF', planet_stop: '#7E2DFF', crater: '#7536DA', crater_top: '#5C1EC1' },
        1.7:  { main: '#741EFF', inside: '#411B80', planet_start: '#B88CFF', planet_stop: '#741EFF', crater: '#6E2ADE', crater_top: '#5825AD' },
        1.8:  { main: '#6B0FFF', inside: '#3C1579', planet_start: '#B88CFF', planet_stop: '#6B0FFF', crater: '#6021C9', crater_top: '#461695' },
        1.9:  { main: '#6000FF', inside: '#320976', planet_start: '#B88CFF', planet_stop: '#6000FF', crater: '#4D1AA1', crater_top: '#371274' },
        2:    { main: '#FFB800', inside: '#B25926', planet_start: '#FEBF1A', planet_stop: '#FFB800', crater: '#D18006', crater_top: '#B25926' },
        3:    { main: '#FF9900', inside: '#A75221', planet_start: '#FEBF1A', planet_stop: '#FF9900', crater: '#CD7E07', crater_top: '#A75221' },
        4:    { main: '#FF7A00', inside: '#9C4C1F', planet_start: '#FEBF1A', planet_stop: '#FF7A00', crater: '#CB6E02', crater_top: '#9C4C1F' },
        5:    { main: '#FF6B00', inside: '#7D3003', planet_start: '#FEBF1A', planet_stop: '#FF6B00', crater: '#D15B06', crater_top: '#7D3003' },
        9.9:  { main: '#FE3C59', inside: '#D41B47', planet_start: '#FF8496', planet_stop: '#FE3C59', crater: '#F1455F', crater_top: '#D41B47' },
        19.8: { main: '#FE1E40', inside: '#C31840', planet_start: '#FF7388', planet_stop: '#FE1E40', crater: '#D42640', crater_top: '#C31840' },
        29.7: { main: '#FD0127', inside: '#AC1337', planet_start: '#FF8C9E', planet_stop: '#FD1D3F', crater: '#D9204B', crater_top: '#AC1337' },
        39.6: { main: '#EE0125', inside: '#8E1D1D', planet_start: '#EF7F7F', planet_stop: '#EE0125', crater: '#B0012A', crater_top: '#8E1D1D' },
        49.5: { main: '#DF0122', inside: '#78001C', planet_start: '#F17385', planet_stop: '#FF0000', crater: '#A00025', crater_top: '#78001C' },
      }
    }
  },
  computed: {
    rotationValue: function() {
      return `rotate(${this.rotation - 90 - (360.0 / this.sectors.length * 0.5)}deg)`
    },
    transitionValue: function() {
      if (this.rotationDuration === 0) return null
      return `transform ${this.rotationDuration}s ` + (this.running ? 'linear' : 'ease')
    },
    transformValuePayouts: function() {
      return `rotate(${this.rotationPayouts}deg) scale(${this.scalePayouts})`
    },
    transitionValuePayouts: function() {
      if (this.rotationDuration === 0) return null
      return `transform ${this.rotationDuration}s ` + (this.running ? 'linear' : 'ease')
    },
    payouts: function() {
      const result = []
      for (let i = 0; i < this.config.length; i++) {
        if (!result.includes(this.config[i])) {
          result.push(this.config[i])
        }
      }
      return result
    },
    colorCodesResult: function() {
      return this.colorCodes[this.config[this.result]]
    }
  },
  watch: {
    run: function(value) {
      this.running = value
    },
    result: function(value) {
      if (value === -1) return
      this.startSpin(value, this.payouts.indexOf(this.config[value]))
    },
    running: function(value) {
      this.changeRunning(value)
    },
    config: function(data) {

      const sectors = []
      for (let i = 0; i < data.length; i++) {
        sectors.push({ percent: 1.0 / data.length, color: this.getColorCode(data[i]), colorInside: this.getColorCodeInside(data[i]) })
      }

      this.sectors = sectors
      this.rotation = 0
      this.rotationPayouts = 0
      this.rotationDuration = 0
      this.scalePayouts = 1
      this.angle = 0
      this.anglePayouts = 0

      this.printWheel()
    }
  },
  mounted () {
    //setTimeout(() => {
    //this.printWheel()
    //}, 500)

    const elem = document.getElementById('wheelPayouts')

    this.svgHeight = elem.clientHeight * 0.22
  },
  methods: {
    getColorCode: function(payout) {
      for (const payKey in this.colorCodes) {
        if (parseFloat(payKey) === payout) {
          return this.colorCodes[payKey].main
        }
      }
      return '#000000'
    },
    getColorCodeInside: function(payout) {
      for (const payKey in this.colorCodes) {
        if (parseFloat(payKey) === payout) {
          return this.colorCodes[payKey].inside
        }
      }
      return '#000000'
    },
    printWheel: function() {
      const svgEl = document.getElementById('svgPart')


      let cumulativePercent = 0

      function getCoordinatesForPercent(percent) {
        const x = Math.cos(2 * Math.PI * percent)
        const y = Math.sin(2 * Math.PI * percent)
        return [x, y]
      }


      svgEl.innerHTML = ''
      let count = 0

      this.sectors.forEach(slice => {
        // destructuring assignment sets the two variables at once
        const [startX, startY] = getCoordinatesForPercent(cumulativePercent)

        // each slice starts where the last slice ended, so keep a cumulative percent
        cumulativePercent += slice.percent

        const [endX, endY] = getCoordinatesForPercent(cumulativePercent)


        // if the slice is more than 50%, take the large arc (the long way around)
        const largeArcFlag = slice.percent > 0.5 ? 1 : 0

        // create an array and join it just for code readability
        const pathData = [
          `M ${startX} ${startY}`, // Move
          `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
          `L ${endX * 0.85} ${endY * 0.85}`, // Line
          `A 0.85 0.85 0 0 0 ${startX * 0.85} ${startY * 0.85}`
        ].join(' ')


        const [startXInside, startYInside] = getCoordinatesForPercent(cumulativePercent - slice.percent * 0.94)
        const [startXInside2, startYInside2] = getCoordinatesForPercent(cumulativePercent - slice.percent * 0.90)
        const [endXInside, endYInside] = getCoordinatesForPercent(cumulativePercent - slice.percent * 0.06)
        const [endXInside2, endYInside2] = getCoordinatesForPercent(cumulativePercent - slice.percent * 0.1)
        //console.log(cumulativePercent, cumulativePercent - slice.percent * 0.98, startXInside, startYInside)

        //startXInside = startXInside * 0.98
        //endXInside = endXInside * 0.98

        const pathDataInside = [
          `M ${startXInside * 0.93} ${startYInside * 0.93}`, // Move
          `Q ${startXInside * 0.96} ${startYInside * 0.96} ${startXInside2 * 0.96} ${startYInside2 * 0.96}`,
          `A 1 1 0 ${largeArcFlag} 1 ${endXInside2 * 0.96} ${endYInside2 * 0.96}`, // Arc
          `Q ${endXInside * 0.96} ${endYInside * 0.96} ${endXInside * 0.93} ${endYInside * 0.93}`,
          `L ${endXInside * 0.92} ${endYInside * 0.92}`, // Line
          `Q ${endXInside * 0.89} ${endYInside * 0.89} ${endXInside2 * 0.89} ${endYInside2 * 0.89}`,
          `A 0.85 0.85 0 0 0 ${startXInside2 * 0.89} ${startYInside2 * 0.89}`,
          `Q ${startXInside * 0.89} ${startYInside * 0.89} ${startXInside * 0.92} ${startYInside * 0.92}`
        ].join(' ')

        //console.log(pathDataInside)


        const patchG = document.createElementNS('http://www.w3.org/2000/svg', 'g')

        // create a <path> and append it to the <svg> element
        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        pathEl.setAttribute('d', pathData)
        pathEl.setAttribute('fill', slice.color)
        patchG.appendChild(pathEl)


        const pathElInside = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        pathElInside.setAttribute('d', pathDataInside)
        pathElInside.setAttribute('fill', slice.colorInside)

        patchG.appendChild(pathElInside)

        svgEl.appendChild(patchG)

        count++
      })
    },
    startSpin: function (value, valuePayouts) {
      if (this.spinStarted === true) {
        this.clearAnimation()
      }

      //this.resultValue = null
      this.running = false
      this.spinStarted = true

      const rotationAngle = 360.0 / this.sectors.length
      const rotationAnglePayouts = 360.0 / this.payouts.length

      this.rotationDuration = this.speed

      this.rotation += this.angle * rotationAngle
      this.rotationPayouts += this.anglePayouts * rotationAnglePayouts
      this.angle = value
      this.anglePayouts = valuePayouts


      this.rotation += (360 * (this.rotationDuration - 1)) - (this.angle * rotationAngle)
      this.rotationPayouts += (360 * (this.rotationDuration - 1)) - (this.anglePayouts * rotationAnglePayouts)

      this.scalePayouts = 0.1

      this.resultTimeoutAnimation = setTimeout(() => {
        this.showPayoutsResult = true
      }, this.speed * 1000 * 0.6)

      this.spinTimeOut = setTimeout(() => {
        //this.resultValue = value
        //this.resultColor = this.getColorCode(value)

        this.spinStarted = false
        this.scalePayouts = 1
        this.rotationDuration = 0
      }, this.speed * 1000)

      this.spinTimeOutAnimation = setTimeout(() => {
        this.hidePayoutsResult = true
      }, this.speed * 1000 * 1.5)
    },
    changeRunning: function(value) {
      if (value === false) {
        clearInterval(this.rotationInterval)
      } else {
        if (this.spinStarted === true) return

        this.clearAnimation()

        //let valueResult = this.resultValue === null ? 33 : this.resultValue

        //this.angle = this.rouletteNumbers.lastIndexOf(valueResult)
        this.rotationDuration = 0.9
        this.rotation += 720
        this.rotationPayouts += 720

        this.rotationInterval = setInterval(() => {
          this.rotation += 720
          this.rotationPayouts += 720
        }, 900)
      }
    },
    clearAnimation: function() {
      clearTimeout(this.spinTimeOutAnimation)
      clearTimeout(this.spinTimeOut)
      clearTimeout(this.resultTimeoutAnimation)

      this.scalePayouts = 1
      this.showPayoutsResult = false
      this.hidePayoutsResult = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .wheel-game-field {
    position: relative;
    display: flex;
    justify-content: center;


    margin: 0 auto;
    height: 500px;
    width: 500px;


    .wheel-game-field-background {
      position: absolute;
      border-radius: 100%;
      height: 100%;
      width: 100%;

      background: #131525;
      box-shadow: -31.789px 50.7566px 112.446px rgba(3, 3, 10, 0.32), -6.3578px 10.1513px 18.2725px rgba(3, 3, 10, 0.16), -2.59021px 4.13573px 9.16226px rgba(3, 3, 10, 0.12563), -0.588685px 0.939938px 4.42496px rgba(3, 3, 10, 0.077037);
    }
    .wheel-game-field-wheel {
      height: 90%;
      width: 90%;
      margin-top: 5%;
      .wheel-part {
        height: calc(100% - 60px);
        position: absolute;
        left: 30px;
        top: 30px;


        .wheel-svg {
          transform: rotateZ(0);
          perspective: 1000px;
        }
      }


    }
    .wheel-game-field-center {
      position: absolute;
      height: 66%;
      width: 66%;
      background: radial-gradient(73.48% 73.48% at 63.95% 26.52%, #303665 0%, #131628 100%);

      border-radius: 100%;

      top: 17%;

      box-shadow: -31.789px 50.7566px 112.446px rgba(3, 3, 10, 0.32), -6.3578px 10.1513px 18.2725px rgba(3, 3, 10, 0.16), -2.59021px 4.13573px 9.16226px rgba(3, 3, 10, 0.12563), -0.588685px 0.939938px 4.42496px rgba(3, 3, 10, 0.077037);

      .wheel-game-field-arrow {
        margin-top: -30px;
        width: 90px;
      }

      .wheel-payouts {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        .wheel-payouts-svg {
          position: absolute;
          top: 40px;
          bottom: 40px;
          left: 40px;
          right: 40px;

          > span {
            position: absolute;
            left: 0;
            right: 0;
            font-family: 'Muller', 'Roboto', sans-serif;
            font-size: 28px;
            > span {
              font-size: 20px;
            }
          }
        }

        .wheel-payout-result {
          display: flex;
          align-items: center;
          justify-content: center;

          pointer-events: none;

          transition: .3s ease;

          animation-name: show_result;
          animation-duration: 1s;
          animation-iteration-count: 1;
          animation-timing-function: ease;

          transform: scale(3.5);

          filter: blur(0);

          &.hide {
            animation-name: hide_result;
            animation-duration: .3s;
            animation-iteration-count: 1;
            animation-timing-function: ease;

            opacity: 0;
          }
        }

        @keyframes show_result {
          0% {
            transform: scale(0.1);
            filter: blur(10px);
          }
          90% {
            filter: blur(1px);
          }
          100% {
            transform: scale(3.5);
            filter: blur(0);
          }
        }

        @keyframes hide_result {
          0% {
            transform: scale(3.5);
            opacity: 1;
          }
          100% {
            transform: scale(0.1);
            opacity: 0;
          }
        }
      }

    }

  }
</style>
