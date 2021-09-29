<template>
  <div class="slider" id="dice-slider" :class="{mode: mode === 1}">
    <div class="slider-mode" :class="{mode: mode === 1}" :style="{ width: (sliderPosition + 5) + 'px' }"></div>
    <div
      id="dice-slider-pointer"
      class="slider-point"
      :style="{ left: sliderPosition + 'px' }"
      @mousedown.prevent="scrollSlider('mouse', $event)" @touchstart.prevent="scrollSlider('touch', $event)"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'DiceSlider',
  props: {
    startPosition: { type: Number },
    mode: { type: Number }
  },
  data () {
    return {
      sliderPointerSize: 22,
      sliderWidth: 0,
      sliderTick: 0,
      sliderTimeoutTime: 0,
      position: 0,
      //sliderMinimumDefault: 200,
      //sliderMaximumDefault: 9900,
    }
  },
  computed: {
    sliderPosition: function() {
      return this.sliderTick * this.position
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
    }
  },
  mounted () {
    this.initSlider()
    this.position = this.startPosition
  },
  methods: {
    initSlider: function() {
      const slider = document.getElementById('dice-slider')
      this.sliderWidth = slider.clientWidth
      this.sliderTick = (this.sliderWidth - this.sliderPointerSize) / 9999
    },
    setSliderPosition: function(value) {
      this.position = value
      this.$emit('position', value)
    },
    scrollSlider: function(type, event) {
      event.preventDefault()

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
  .slider {
    height: 6px;
    width: 100%;
    max-width: 600px;
    background-color: #42b983;
    border-radius: 4px;
    position: relative;

    &.mode {
      background-color: #2c3e50;
    }
    .slider-mode {
      position: absolute;
      content: ' ';
      left: 0;
      top: 0;
      background-color: #2c3e50;
      height: 6px;
      border-radius: 4px;
      &.mode {
        background-color: #42b983;
      }
    }
    .slider-point {
      position: absolute;
      top: -8px;
      width: 20px;
      height: 20px;
      background-color: aqua;
      border: 1px solid #2c3e50;
      border-radius: 4px;
      cursor: pointer;
      z-index: 1;
      &:hover {
        background-color: #0ecccc;
      }
    }
  }
</style>
