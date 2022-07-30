<template>
  <div class="roulette-wheel" >

    <div class="roulette-wheel-wrap">

      <div class="roulette-wheel-bg">

      </div>
      <div class="roulette-wheel-sectors">
        <svg id="rouletteWheel" viewBox="-1 -1 2 2" :style="{transform: rotationValue, transition: transitionValue}">

        </svg>
      </div>

      <div class="roulette-wheel-top-circle">
        <div :class="{ active: spinStarted }" class="roulette-wheel-arrow"><img src="@/assets/games/roulette/arrow.svg" alt="" /></div>
      </div>

      <div class="roulette-wheel-center">

        <svg :style="{transform: rotationValue, transition: transitionValue}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 500"><defs><radialGradient id="a" cx="-249.83" cy="743.15" r="1.6" gradientTransform="matrix(43.36, -43.36, -43.36, -43.36, 43307.81, 21641.1)" gradientUnits="userSpaceOnUse"><stop offset="0.25" stop-color="#3d4476"/><stop offset="1" stop-color="#16192e"/></radialGradient><linearGradient id="b" x1="263.3" y1="236.74" x2="235.62" y2="264.43" gradientTransform="matrix(1, 0, 0, -1, 0, 501)" gradientUnits="userSpaceOnUse"><stop offset="0.01" stop-color="#0f1225"/><stop offset="0.19" stop-color="#181c31"/><stop offset="0.6" stop-color="#2a2f50"/><stop offset="0.87" stop-color="#181c31"/><stop offset="1" stop-color="#0f1225"/></linearGradient><radialGradient id="c" cx="-245.95" cy="733.67" r="1.6" gradientTransform="matrix(18.94, -18.94, -18.94, -18.94, 19018.06, 9267.33)" gradientUnits="userSpaceOnUse"><stop offset="0.38" stop-color="#363c64"/><stop offset="0.81" stop-color="#151728"/></radialGradient><radialGradient id="d" cx="-254.59" cy="733.67" r="1.6" gradientTransform="matrix(18.94, -18.94, -18.94, -18.94, 18745.39, 9540)" gradientUnits="userSpaceOnUse"><stop offset="0.38" stop-color="#272c4a"/><stop offset="0.81" stop-color="#151728"/></radialGradient><linearGradient id="e" x1="264.26" y1="264.3" x2="236.58" y2="236.61" xlink:href="#b"/><radialGradient id="f" cx="-250.27" cy="737.99" r="1.6" gradientTransform="matrix(18.94, -18.94, -18.94, -18.94, 18745.39, 9267.33)" xlink:href="#c"/><radialGradient id="g" cx="-250.27" cy="729.35" r="1.6" gradientTransform="matrix(18.94, -18.94, -18.94, -18.94, 19018.06, 9540)" xlink:href="#d"/><radialGradient id="h" cx="-249.83" cy="743.15" r="1.6" gradientTransform="matrix(43.36, -43.36, -43.36, -43.36, 43307.81, 21641.1)" xlink:href="#d"/></defs><path d="M323,250A73,73,0,1,1,317.41,222,73,73,0,0,1,323,250Z" style="fill:url(#a)"/><path d="M17.48,454.7l27.69,27.69L481.44,46.12,453.75,18.44Z" style="fill:url(#b)"/><path d="M468.13,63.74a31.87,31.87,0,1,0-31.86-31.87A31.87,31.87,0,0,0,468.13,63.74Z" style="fill:url(#c)"/><path d="M31.87,500A31.87,31.87,0,1,0,0,468.13,31.86,31.86,0,0,0,31.87,500Z" style="fill:url(#d)"/><path d="M454.71,482.52l27.68-27.69L46.13,18.57,18.44,46.25Z" style="fill:url(#e)"/><path d="M31.87,63.74A31.87,31.87,0,1,0,0,31.87,31.86,31.86,0,0,0,31.87,63.74Z" style="fill:url(#f)"/><path d="M468.13,500a31.87,31.87,0,1,0-31.86-31.87A31.87,31.87,0,0,0,468.13,500Z" style="fill:url(#g)"/><path d="M323,250A73,73,0,1,1,317.41,222,73,73,0,0,1,323,250Z" style="fill:url(#h)"/></svg>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'RouletteWheel',
  props: {
    result: { default: -1 },
    run: { default: false },
    speed: { type: Number }
  },
  data() {
    return {
      rouletteNumbers: [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26],

      running: false,
      rotation: 90 - 360 / 37 / 2,
      rotationInterval: null,
      rotationDuration: 0,

      angle: 0,
      spinStarted: false,
      spinTimeOut: null,
      resultValue: null,
    }
  },
  computed: {
    rotationValue: function () {
      return 'rotate(' + this.rotation + 'deg)'
    },
    transitionValue: function () {
      if (this.rotationDuration === 0) return null
      return `transform ${this.rotationDuration}s ` + (this.running ? 'linear' : 'ease')
    },
  },
  watch: {
    run: function(value) {
      this.running = value
    },
    result: function(value) {
      if (value === -1) return
      this.startSpin(value)
    },
    running: function(value) {
      this.changeRunning(value)
    }
  },
  mounted () {
    this.print()
  },
  methods: {
    getCoordinatesForPercent: function(percent) {
      const x = Math.cos(2 * Math.PI * percent)
      const y = Math.sin(2 * Math.PI * percent)

      return [x, y]
    },
    print: function() {
      const svgEl = document.getElementById('rouletteWheel')

      const colorFirst = '#1CB13D'
      const colorOne = '#3B437B'
      const colorTwo = '#DD385F'


      const sectorSize = 1 / 37
      const sectorAngle = 360 / 37

      let cumulativePercent = 0

      for (let i = 0; i < 37; i++) {

        // destructuring assignment sets the two variables at once
        const [startX, startY] = this.getCoordinatesForPercent(cumulativePercent)

        // each slice starts where the last slice ended, so keep a cumulative percent
        cumulativePercent += sectorSize

        const [endX, endY] = this.getCoordinatesForPercent(cumulativePercent)

        let [textX, textY] = this.getCoordinatesForPercent(cumulativePercent - sectorSize / 2)
        textX *= 0.94
        textY *= 0.94

        // if the slice is more than 50%, take the large arc (the long way around)
        const largeArcFlag = sectorSize > 0.5 ? 1 : 0

        // create an array and join it just for code readability
        const pathData = [
          `M ${startX} ${startY}`, // Move
          `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
          'L 0 0', // Line
        ].join(' ')

        let selectColor = i % 2 === 0 ? colorOne : colorTwo
        if (i === 0) {
          selectColor = colorFirst
        }

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        group.setAttribute('id', `number-${this.rouletteNumbers[i]}`)

        // create a <path> and append it to the <svg> element
        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        pathEl.setAttribute('d', pathData)
        pathEl.setAttribute('fill', selectColor)

        //text-anchor="middle" dominant-baseline="central" transform="rotate(0, 100, 50)"
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        textEl.setAttribute('x', textX)
        textEl.setAttribute('y', textY)
        textEl.setAttribute('style', 'font: 800 0.1px Manrope; text-anchor: middle;')

        textEl.setAttribute('text-anchor', 'middle')
        textEl.setAttribute('dominant-baseline', 'central')
        textEl.setAttribute('transform', `rotate(${i * sectorAngle + sectorAngle / 2 + 90}, ${textX} , ${textY})`)

        textEl.setAttribute('fill', '#FFFFFF')
        //textEl.setAttribute('transform', 'rotate(90)')
        textEl.innerHTML = this.rouletteNumbers[i]

        group.appendChild(pathEl)
        group.appendChild(textEl)

        svgEl.appendChild(group)
      }
    },
    startSpin: function (value) {
      console.log('start spin, value: ', value)

      if (this.spinStarted === true) {
        clearTimeout(this.spinTimeOut)
        this.rotationDuration = 0
      }

      this.resultValue = null
      this.running = false
      this.spinStarted = true


      const rotationAngle = 360.0 / this.rouletteNumbers.length

      this.rotationDuration = this.speed

      this.rotation += this.angle * rotationAngle
      this.angle = this.rouletteNumbers.lastIndexOf(value)
      this.rotation += (360 * (this.rotationDuration - 1)) - (this.angle * rotationAngle)

      this.spinTimeOut = setTimeout(() => {
        this.resultValue = value
        //this.resultColor = this.getColorCode(value)

        this.spinStarted = false

        const wheelElem = document.getElementById(`number-${value}`)
        wheelElem.classList.add('active')
        setTimeout(() => {
          wheelElem.classList.remove('active')
        }, 2000)

      }, this.rotationDuration * 1000)
    },
    changeRunning: function(value) {
      if (value === false) {
        clearInterval(this.rotationInterval)
        //this.rotationInterval = null
      } else {
        if (this.spinStarted === true) return

        const valueResult = this.resultValue === null ? 0 : this.resultValue

        this.angle = this.rouletteNumbers.lastIndexOf(valueResult)
        this.rotationDuration = 0.9
        this.rotation += 720

        this.rotationInterval = setInterval(() => {
          this.rotation += 720
        }, 900)
      }
    },
  }
}
</script>

<style lang="scss">
  #rouletteWheel {
    g {
      &.active {
        animation-name: pulse_sector;
        animation-duration: .5s;
        animation-iteration-count: 3;
        animation-timing-function: ease;
        text {
          animation-name: pulse_sector_color;
          animation-duration: .5s;
          animation-iteration-count: 3;
          animation-timing-function: ease;
        }
      }

      @keyframes pulse_sector {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.02);
        }
      }

      @keyframes pulse_sector_color {
        0%, 100% {
          text-shadow: 0 0 0 #e9b703;
          color: #FFF;
        }
        50% {
          text-shadow: 0 0 5px #e9b703;
          color: #e9b703;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .roulette-wheel {
    pointer-events: none;

    width: 500px;
    height: 500px;
    margin: 0 auto;



    .roulette-wheel-wrap {
      position: relative;
      width: 100%;
      height: 100%;
      margin-top: -50%;

      .roulette-wheel-bg {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: 100%;
        background-color: #131525;
      }

      .roulette-wheel-sectors {
        position: absolute;

        padding: 4%;
      }

      .roulette-wheel-top-circle {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: 100%;
        background: radial-gradient(66.14% 66.14% at 67.27% 33.86%, #1B1E35 0%, #131525 100%);
        box-shadow: 0 0 27px #000000;
        margin: 15%;

        display: flex;
        align-items: flex-end;
        justify-content: center;

        .roulette-wheel-arrow {
          > img {
            width: 70px;
          }
          &.active {
            animation-name: pulse_arrow;
            animation-duration: .5s;
            animation-iteration-count: infinite;
            animation-timing-function: ease;
          }
          @keyframes pulse_arrow {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.15);
            }
          }
        }
      }

      .roulette-wheel-center {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        display: flex;
        justify-content: center;
        align-items: center;

        > svg {
          width: 35%;

        }
      }
    }
  }
</style>
