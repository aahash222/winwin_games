<template>
  <div class="dice-slider" :class="{ small: small }">

    <div class="dice-slider-up">
      <div>0</div>
      <div>9999</div>
    </div>

    <div class="dice-slider-wrap">
      <div class="slider" id="dice-slider" :class="{mode: mode === 1}">
        <div class="slider-mode" :class="{mode: mode === 1}" :style="{ width: (sliderPosition + 5) + 'px' }"></div>
        <div
          id="dice-slider-pointer"
          class="slider-point"
          :style="{ left: sliderPosition + 'px' }"
          @mousedown.prevent="scrollSlider('mouse', $event)" @touchstart.prevent="scrollSlider('touch', $event)"
        >{{ position }}</div>
      </div>

      <div class="dice-slider-result" v-show="result >= 0" :class="{ lose: resultLose }" :style="{ 'margin-left': resultPosition + 'px' }">
        <div class="dice-slider-result-box"><div></div></div>
        <div class="dice-slider-result-number">{{ result }}</div>
      </div>
    </div>

    <div class="dice-slider-down">
      <div v-for="key in 25" :key="key"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DiceSlider',
  props: {
    startPosition: { type: Number },
    mode: { type: Number },
    result: { type: Number },
    small: { type: Boolean, default: false }
  },
  data () {
    return {
      sliderPointerSize: 22,
      sliderWidth: 0,
      sliderTick: 0,
      sliderTimeoutTime: 0,
      position: 0,
      resultLose: false,
    }
  },
  computed: {
    sliderPosition: function() {
      return this.sliderTick * this.position - 5
    },
    sliderMinimum: function() {
      if (this.mode === 0) {
        return 1
      } else {
        return 200
      }
    },
    sliderMaximum: function() {
      if (this.mode === 0) {
        return 9800
      } else {
        return 9999
      }
    },
    resultPosition: function() {
      return this.sliderTick * this.result
    },
  },
  watch: {
    result: function(value) {
      this.computeResultLose(value)
    },
    startPosition: function(value) {
      this.position = value
    }
  },
  mounted () {
    this.initSlider()
    this.position = this.startPosition
    if (this.small) {
      this.computeResultLose(this.result)
    }
  },
  methods: {
    initSlider: function() {
      const slider = document.getElementById('dice-slider')
      this.sliderWidth = slider.clientWidth
      this.sliderTick = (this.sliderWidth - this.sliderPointerSize) / 9999
    },
    computeResultLose: function(value) {
      if (this.mode === 0 && value < this.position) {
        this.resultLose = false
      } else if (this.mode === 1 && value > this.position) {
        this.resultLose = false
      } else {
        this.resultLose = true
      }
    },
    setSliderPosition: function(value) {
      this.position = value
      this.$emit('position', value)
    },
    scrollSlider: function(type, event) {
      event.preventDefault()
      if (this.small) return

      const elemId = event.target.id

      const elem = document.getElementById(elemId)
      const sliderElem = elem.parentElement

      const thumbCoords = this.getCoords(elem)
      const sliderCoords = this.getCoords(sliderElem)
      let shiftX = 0

      if (type === 'mouse') shiftX = event.pageX - thumbCoords.left
      else shiftX = event.targetTouches[0].pageX - thumbCoords.left

      const moveEventName = (type === 'touch' ? 'ontouchmove' : 'onmousemove')

      document[moveEventName] = (e) => {
        const timeNow = (new Date()).getTime()
        if (timeNow - this.sliderTimeoutTime < 50) return
        this.sliderTimeoutTime = timeNow

        let cursorPosition
        if (type === 'mouse') {
          cursorPosition = e.pageX
        } else {
          cursorPosition = e.targetTouches[0].pageX
        }

        //console.log(cursorPosition)
        let newLeft = cursorPosition - shiftX - sliderCoords.left


        // курсор ушёл вне слайдера
        if (newLeft < this.sliderTick * this.sliderMinimum) {
          newLeft = this.sliderTick * this.sliderMinimum
        }

        //const rightEdge = sliderElem.offsetWidth - elem.offsetWidth
        if (newLeft > this.sliderTick * this.sliderMaximum) {
          newLeft = this.sliderTick * this.sliderMaximum
        }

        const count = Math.round(newLeft / this.sliderTick)

        this.setSliderPosition(count)
      }

      if (type === 'touch') {
        document.ontouchend = function () { document.ontouchmove = document.ontouchend = document.ontouchcancel = null }
        document.ontouchcancel = function () { document.ontouchmove = document.ontouchend = document.ontouchcancel = null }
      } else {
        document.onmouseup = function () { document.onmousemove = document.onmouseup = null }
      }
    },
    getCoords: function (elem) { // кроме IE8-
      const box = elem.getBoundingClientRect()
      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset,
        width: box.width
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .dice-slider {
    width: 100%;
    max-width: 600px;
    margin-bottom: 20px;

    .dice-slider-up {
      display: flex;
      justify-content: space-between;
      padding: 0 8px 0 17px;
      margin-bottom: 4px;
      > div {
        color: #6871C1;
        font-size: 12px;
      }
    }

    .dice-slider-wrap {
      //height: 36px;
      background-color: black;
      padding: 3px;
      border: 2px solid #121426;
      border-radius: 14px;

      .slider {
        height: 10px;

        background: radial-gradient(66.14% 66.14% at 67.27% 33.86%, #FF5E84 0%, #BE1D44 100%);
        box-shadow: 0 0 32px rgba(255, 83, 121, 0.26);
        border-radius: 6px;
        position: relative;

        animation: unset;

        &.mode {
          background: radial-gradient(66.14% 66.14% at 67.27% 33.86%, #66FF63 0%, #25A832 100%);
          box-shadow: 0 0 32px rgba(96, 255, 99, 0.26);

          animation-name: pulse_animation;
          animation-duration: 700ms;
          animation-iteration-count: 3;
          animation-timing-function: ease;
        }

        .slider-mode {
          position: absolute;
          content: ' ';
          left: 0;
          top: 0;
          background: radial-gradient(66.14% 66.14% at 67.27% 33.86%, #66FF63 0%, #25A832 100%);
          box-shadow: 0 0 32px rgba(96, 255, 99, 0.26);
          height: 10px;
          border-radius: 6px;

          animation-name: pulse_animation;
          animation-duration: 700ms;
          animation-iteration-count: 3;
          animation-timing-function: ease;

          &.mode {
            background: radial-gradient(66.14% 66.14% at 67.27% 33.86%, #FF5E84 0%, #BE1D44 100%);
            box-shadow: 0 0 32px rgba(255, 83, 121, 0.26);

            animation: unset;
          }
        }

        .slider-point {
          position: absolute;
          top: -11px;
          width: 28px;
          height: 28px;
          background: linear-gradient(180deg, #E2E2E2 0%, #A3A3A3 100%);
          border: 2px solid #A9AAAC;
          border-radius: 8px;
          font-size: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #000000;
          cursor: pointer;
          z-index: 1;

          &:hover {
            background-color: #0ecccc;
          }
        }

        @keyframes pulse_animation {
          0%   { background: #FF5E84FF; }
          25%  { background: #25A832FF; }
          50%  { background: #FF5E84FF; }
          75%  { background: #25A832FF; }
          100% { background: #FF5E84FF; }
        }
      }

      .dice-slider-result {
        position: absolute;
        margin-top: 26px;
        display: flex;
        flex-direction: column;
        align-items: center;

        transition: .3s ease;

        .dice-slider-result-box {
          position: relative;
          width: 20px;
          height: 20px;
          background-color: #212440;
          //background-color: #222646;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          > div {
            z-index: 1;
            width: 12px;
            height: 12px;
            background: radial-gradient(66.14% 66.14% at 67.27% 33.86%, #66FF63 0%, #25A832 100%);
            box-shadow: 0 0 32px rgba(96, 255, 99, 0.26);
            border-radius: 2px;
            transition: .3s ease;
          }
          &:before {
            content: ' ';
            position: absolute;
            z-index: 0;
            top: -3px;
            left: 6px;

            width: 8px;
            height: 8px;
            background-color: #212440;
            //background-color: #222646;
            border-radius: 2px;

            transform: rotate(45deg);
          }
        }

        .dice-slider-result-number {
          font-size: 10px;
        }

        &.lose {
          .dice-slider-result-box {
            > div {
              background: radial-gradient(66.14% 66.14% at 67.27% 33.86%, #FF5E84 0%, #BE1D44 100%);
              box-shadow: 0 0 32px rgba(255, 83, 121, 0.26);
            }
          }
        }
      }
    }

    .dice-slider-down {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      margin-top: 4px;
      > div {
        height: 8px;
        width: 2px;
        background-color: #212440;
      }
    }

    &.small {

      .dice-slider-up {
        margin-bottom: 0;
      }
      .dice-slider-wrap {
        .slider {
          animation: unset;
          height: 8px;
          &.mode, .slider-mode {
            animation: unset;
          }
          .slider-mode {
            height: 8px;
          }
          .slider-point {
            cursor: default;
            top: -8px;
            height: 20px;
            width: 20px;
            font-size: 8px;
          }
        }
        .dice-slider-result {
          margin-top: 10px;
          transition: none;
        }
      }

      .dice-slider-down {
        display: none;
      }
    }
  }
</style>
