<template>
  <div class="roulette-field">

    <div class="roulette-table-buttons">
      <button @click.prevent="changeBet('1/2')" class="roulette-table-button-edit">1/2</button>
      <button @click.prevent="changeBet('x2')" class="roulette-table-button-edit">x2</button>

      <button @click.prevent="back()" class="roulette-table-button-edit"><IconBack />back</button>
      <button @click.prevent="remove()" class="roulette-table-button-edit" :class="{active: removeMode}"><IconTrash />remove</button>
      <button @click.prevent="reset()" class="roulette-table-button-edit"><IconClose />reset</button>
    </div>


    <div class="roulette-table" @mouseleave="leaveMouse($event)" :class="{remove: removeMode}">

      <div class="roulette-table-main">
        <div class="roulette-table-left">
          <button
            id="one_0"
            class="roulette-table-button btn-green"
            :class="{hovered: hovered.includes(0), result: result === 0}"
            @mouseover="hoverUp($event, 'one', 0)"
            @click="setChip($event,'one', 0)"
          ><span>0</span><RouletteTableStack :amount="chips[`one_0`]" :chip-variants="chipVariants" /></button>
        </div>
        <div class="roulette-table-middle">
          <div class="roulette-table-middle-wrap">

            <template v-for="(place, key) in roulettePlaces" :key="key">
              <div>
                <div>
                  <div
                    class="roulette-table-button-between-center"
                    @mouseover="hoverUp($event, 'center', key)"
                    @click="setChip($event, 'center', key)"
                  ><RouletteTableStack :amount="chips[`center_${key}`]" :chip-variants="chipVariants" class="chip-stack-mobile" /></div>
                  <div
                    class="roulette-table-button-between-up"
                    @mouseover="hoverUp($event, 'column', key)"
                    @click="setChip($event,'column', key)"
                  ><RouletteTableStack :amount="chips[`column_${key}`]" :chip-variants="chipVariants" class="chip-stack-mobile" /></div>
                </div>

                <div>
                  <div
                    class="roulette-table-button-between-left"
                    @mouseover="hoverUp($event, 'row', key)"
                    @click="setChip($event, 'row', key)"
                  ><RouletteTableStack :amount="chips[`row_${key}`]" :chip-variants="chipVariants" class="chip-stack-mobile" /></div>
                  <button
                    :id="`one_${place}`"
                    class="roulette-table-button roulette-table-button-single"
                    :class="[rouletteColors[key] ? 'btn-red' : 'btn-black', hovered.includes(place) ? 'hovered' : '', result === place ? 'result' : '']"
                    @mouseover="hoverUp($event, 'one', place)"
                    @click="setChip($event, 'one', place)"
                    :data-value="place"
                  ><span>{{ place }}</span><RouletteTableStack :amount="chips[`one_${place}`]" :chip-variants="chipVariants" class="chip-stack-mobile" /></button>

                </div>

              </div>
            </template>

          </div>
        </div>
        <div class="roulette-table-right">
          <button
            class="roulette-table-button"
            @mouseover="hoverUp($event, 'combo', 0)"
            @click="setChip($event, 'combo', 0)"
          ><span>2:1</span><RouletteTableStack :amount="chips[`combo_0`]" :chip-variants="chipVariants" /></button>
          <button
            class="roulette-table-button"
            @mouseover="hoverUp($event, 'combo', 1)"
            @click="setChip($event, 'combo', 1)"
          ><span>2:1</span><RouletteTableStack :amount="chips[`combo_1`]" :chip-variants="chipVariants" /></button>
          <button
            class="roulette-table-button"
            @mouseover="hoverUp($event, 'combo', 2)"
            @click="setChip($event, 'combo', 2)"
          ><span>2:1</span><RouletteTableStack :amount="chips[`combo_2`]" :chip-variants="chipVariants" /></button>
        </div>
      </div>
      <div class="roulette-table-down-wrap">

        <div class="roulette-table-down-button roulette-table-down-button-up">

          <button @click.prevent="changeBet('1/2')" class="roulette-table-button-edit">1/2</button>
          <button @click.prevent="changeBet('x2')" class="roulette-table-button-edit">x2</button>

          <!--
          <button @click="reset()" class="roulette-table-button-edit"><font-awesome-icon icon="trash-alt" />clear</button>
          -->
        </div>

        <div class="roulette-table-down">
          <div>
            <button
              class="roulette-table-button"
              @mouseover="hoverUp($event, 'combo', 3)"
              @click="setChip($event, 'combo', 3)"
            ><span>1 TO 12</span><RouletteTableStack :amount="chips[`combo_3`]" :chip-variants="chipVariants" /></button>
            <button
              class="roulette-table-button"
              @mouseover="hoverUp($event, 'combo', 4)"
              @click="setChip($event, 'combo', 4)"
            ><span>13 TO 24</span><RouletteTableStack :amount="chips[`combo_4`]" :chip-variants="chipVariants" /></button>
            <button
              class="roulette-table-button"
              @mouseover="hoverUp($event, 'combo', 5)"
              @click="setChip($event, 'combo', 5)"
            ><span>25 TO 36</span><RouletteTableStack :amount="chips[`combo_5`]" :chip-variants="chipVariants" /></button>
          </div>
          <div>
            <button
              class="roulette-table-button"
              @mouseover="hoverUp($event, 'combo', 6)"
              @click="setChip($event, 'combo', 6)"
            ><span>1 TO 18</span><RouletteTableStack :amount="chips[`combo_6`]" :chip-variants="chipVariants" /></button>
            <button
              class="roulette-table-button"
              @mouseover="hoverUp($event, 'combo', 8)"
              @click="setChip($event, 'combo', 8)"
            ><span>Even</span><RouletteTableStack :amount="chips[`combo_8`]" :chip-variants="chipVariants" /></button>
            <button
              class="roulette-table-button btn-red"
              @mouseover="hoverUp($event, 'combo', 10)"
              @click="setChip($event, 'combo', 10)"
            ><span>Red</span><RouletteTableStack :amount="chips[`combo_10`]" :chip-variants="chipVariants" /></button>
            <button
              class="roulette-table-button btn-black"
              @mouseover="hoverUp($event, 'combo', 11)"
              @click="setChip($event, 'combo', 11)"
            ><span>Black</span><RouletteTableStack :amount="chips[`combo_11`]" :chip-variants="chipVariants" /></button>
            <button
              class="roulette-table-button"
              @mouseover="hoverUp($event, 'combo', 9)"
              @click="setChip($event, 'combo', 9)"
            ><span>Odd</span><RouletteTableStack :amount="chips[`combo_9`]" :chip-variants="chipVariants" /></button>
            <button
              class="roulette-table-button"
              @mouseover="hoverUp($event, 'combo', 7)"
              @click="setChip($event, 'combo', 7)"
            ><span>19 TO 36</span><RouletteTableStack :amount="chips[`combo_7`]" :chip-variants="chipVariants" /></button>
          </div>
        </div>

        <div class="roulette-table-down-button roulette-table-down-button-down">
          <button @click="back()" class="roulette-table-button-edit"><img src="@/assets/icons/icon_back.svg" alt="" />back</button>
          <button @click.prevent="remove()" class="roulette-table-button-edit roulette-table-button-remove" :class="{active: removeMode}"><img src="@/assets/icons/icon_trash.svg" alt="" />remove</button>
          <button @click.prevent="reset()" class="roulette-table-button-edit"><img src="@/assets/icons/icon_close.svg" alt="" />reset</button>
        </div>

      </div>

      <div
        class="hidden-chip"
        :class="{active: hiddenChip}"
        :style="{transform: `translateX(${hiddenChipX}px) translateY(${hiddenChipY}px)`}"
      ><RouletteChip :index="chip" :amount="chipAmount" /></div>

    </div>


  </div>
</template>

<script>
import rouletteMixin from '@/components/games/roulette/rouletteMixin'
import RouletteTableStack from '@/components/games/roulette/RouletteTableStack'
import RouletteChip from '@/components/games/roulette/RouletteChip'
import IconTrash from '@/assets/icons/IconTrash'
import IconBack from '@/assets/icons/IconBack'
import IconClose from '@/assets/icons/IconClose'
export default {
  name: 'RouletteField',
  mixins: [rouletteMixin],
  components: { IconClose, IconBack, IconTrash, RouletteTableStack, RouletteChip },
  props: {
    chip: { type: Number, default: 0 },
    chipAmount: { type: Number, default: 0.00000001 },
    chipVariants: { type: Array },
    result: { type: Number, default: -1 }
  },
  data() {
    return {
      hiddenChip: false,
      removeMode: false,

      chips: {},
      logs: [],
      hovered: [],

      amountTotal: 0,
      chipCounter: 0,
      hiddenChipX: 0,
      hiddenChipY: 0,
    }
  },
  watch: {
    chipCounter: function() {
      console.log('update')
      this.$emit('update', { bets: this.chips, amount: this.amountTotal })
    },
  },
  methods: {
    setChip(e, type, value) {
      e.preventDefault()

      if (this.removeMode === true) {
        this.removeChip(`${type}_${value}`)
        return
      }

      this.chipCounter++

      if (this.chips[`${type}_${value}`] === undefined) {
        this.chips[`${type}_${value}`] = this.chipAmount
      } else {
        this.chips[`${type}_${value}`] = parseFloat((this.chips[`${type}_${value}`] + this.chipAmount).toFixed(8))
      }
      this.amountTotal += this.chipAmount

      this.logs.push({ name: `${type}_${value}`, value: this.chipAmount })

      if (type === 'one') this.hovered = []

      this.hiddenChip = false

      let clickHover = []
      if (type === 'one') clickHover = [value]
      else clickHover = this.rouletteCombinations[type][value]

      setTimeout(() => {
        for (let i = 0; i < clickHover.length; i++) {
          document.getElementById(`one_${clickHover[i]}`).classList.add('click')
          setTimeout(() => {
            document.getElementById(`one_${clickHover[i]}`).classList.remove('click')
          }, 200)
        }
      }, 10)
    },
    removeChip: function(name) {
      if (this.chips[name] === undefined) return

      this.amountTotal -= this.chips[name]
      delete this.chips[name]

      for (let k = 0; k < this.logs.length; k++) {
        if (this.logs[k].name === name) {
          this.logs.splice(k, 1)
          k--
        }
      }

      this.chipCounter++
    },
    back: function() {
      if (this.logs.length <= 0) return

      const lastLog = this.logs[this.logs.length - 1]
      this.logs.splice(-1, 1)
      if (this.chips[lastLog.name] === undefined) return

      this.chips[lastLog.name] = parseFloat((this.chips[lastLog.name] - lastLog.value).toFixed(8))
      if (this.chips[lastLog.name] <= 0) {
        delete this.chips[lastLog.name]
      }
      this.amountTotal -= lastLog.value
      this.chipCounter++
    },
    reset: function() {
      this.logs = []
      this.chips = {}
      this.amountTotal = 0
      this.chipCounter++
    },
    remove: function() {
      this.removeMode = !this.removeMode
    },
    changeBet: function(type) {
      let amount = 0
      const deletedChips = []

      for (const value in this.chips) {
        if (type === 'x2') {
          this.chips[value] = parseFloat((this.chips[value] * 2).toFixed(8))
          amount += this.chips[value]
        }

        if (type === '1/2') {
          if (this.chips[value] / 2 < 0.00000001) {
            delete this.chips[value]
            deletedChips.push(value)
          } else {
            this.chips[value] = parseFloat((this.chips[value] / 2).toFixed(8))
            amount += this.chips[value]
          }
        }
      }

      for (let i = 0; i < deletedChips.length; i++) {
        for (let k = 0; k < this.logs.length; k++) {
          if (this.logs[k].name === deletedChips[i]) {
            this.logs.splice(k, 1)
            k--
          }
        }
      }

      for (let i = 0; i < this.logs.length; i++) {
        if (type === 'x2') {
          this.logs[i].value = parseFloat((this.logs[i].value * 2).toFixed(8))
        }
        if (type === '1/2') {
          this.logs[i].value = parseFloat((this.logs[i].value / 2).toFixed(8))
        }
      }

      this.amountTotal = amount
      this.chipCounter++
    },
    leaveMouse(e) {
      e.preventDefault()

      this.hovered = []
      this.hiddenChip = false
    },
    hoverUp(e, type, key) {
      e.preventDefault()
      //console.log(`${type}_${key}`)

      if (this.removeMode === true) return
      //if (this.$store.getters.getDeviceType === 'mobile') return

      this.hovered = []
      this.hiddenChip = true

      let targetNode = e.target
      if (targetNode.tagName === 'SPAN') {
        targetNode = e.target.parentNode
      }


      let positionX = targetNode.parentNode.offsetLeft - 25.0 / 2
      let positionY = targetNode.parentNode.offsetTop + targetNode.clientHeight / 2 - 25.0 / 2
      if (type === 'column') {
        positionX += targetNode.clientWidth / 2 + 2
        positionY -= 2.5
      } else if (type === 'row' && key < 36) {
        positionX -= targetNode.clientWidth / 2 - 2
        positionY -= 2.5
      } else if (type === 'center') {
        positionX -= 0.5
        positionY -= 6
      } else if (type === 'one' && key === 0) {
        positionX += targetNode.clientWidth / 2 - 2
        positionY -= 1.5
      } else if (type === 'one') {
        positionX += targetNode.clientWidth / 2 + 3
        positionY -= 1.5
      } else if (type === 'combo' && key <= 3) {
        positionX += targetNode.clientWidth / 2 + 3
        positionY = targetNode.offsetTop + targetNode.clientHeight / 2 - 25.0 / 2 - 1.5
      } else if (type === 'combo') {
        positionX = targetNode.offsetLeft + targetNode.clientWidth / 2 - 25.0 / 2 - 1.5
        positionY -= 1.5
      }

      this.hiddenChipX = positionX
      this.hiddenChipY = positionY


      if (type === 'one') {
        this.hovered = [key]
      } else {
        this.hovered = this.rouletteCombinations[type][key]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .roulette-field {
    margin-top: 20px;


    .roulette-table-buttons {
      display: flex;
      justify-content: center;
      margin-bottom: 15px;

      .roulette-table-button-edit {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #747A9F;
        border-radius: 4px;
        background: transparent;
        color: #747A9F;
        font-size: 14px;
        font-weight: bold;
        height: 24px;
        width: 110px;
        text-transform: uppercase;
        padding: 0 15px;
        margin-right: 10px;
        transition: .3s ease;
        cursor: pointer;

        > svg {
          margin-right: 5px;
          //font-size: 10px;
          height: 16px;
          fill: #747A9F;
          transition: .3s ease;
        }


        &:hover {
          color: #00A0ED;
          border-color: #00A0ED;
          > svg {
            fill: #00A0ED;
          }
        }

        &.active {
          border-color: #00A0ED;
          color: #fff;
          background-color: #00769c;
          z-index: 30;
          > svg {
            fill: #FFF;
          }
        }

        &:last-of-type {
          margin-right: 0;
        }
      }
    }

    .roulette-table {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      .roulette-table-button {
        width: 44px;
        height: 44px;
        margin-right: 5px;
        margin-bottom: 5px;
        line-height: 19px;
        font-size: 16px;
        font-weight: bold;
        text-transform: uppercase;
        color: #FFF;
        background: #0C0E1C;
        border: solid 1px #222646;
        border-radius: 4px;
        transition: .3s;
        vertical-align: top;
        position: relative;

        transform: translateZ(0);
        will-change: transform;

        &.roulette-table-button-single {
          margin-right: 0;
          margin-bottom: 0;

          position: relative;
          transition: .3s ease;
        }

        &.btn-green {
          height: 142px;
          background-color: #71C658;
          margin-right: 0;
        }

        &.btn-red {
          background-color: #DD385F;
        }

        &.btn-black {
          background-color: #222646;
        }

        &.result {
          border-color: #e9b703;
          box-shadow: 0 0 5px #e9b703;

          animation-name: pulse_result;
          animation-duration: .5s;
          animation-iteration-count: 3;
          animation-timing-function: ease;
        }

        @keyframes pulse_result {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }


        &:after, &:before {
          visibility: hidden;
          opacity: 0;
          content: ' ';
          color: #FFF;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;

          border-radius: 4px;
          transition: .3s ease;
          z-index: 5;
        }
        &:after {
          content: ' ';
          background-color: #DFDBE5;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000000' fill-opacity='0.38' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
          background-size: 8.8px;
        }
        &:before {
          content: attr(data-value);
          z-index: 20;
          color: #fff;
          -webkit-text-stroke: 0.4px #000;
          transition: .01s ease;
        }

        &.hovered:after {
          opacity: .4;
          visibility: visible;
        }
        &.hovered:before {
          opacity: 1;
          visibility: visible;
        }

        &.hovered {
          transform: scale(1.1);

          &.btn-green {
            transform: scale(1.03);
          }
        }

        &.click {
          animation-name: pulse_click;
          animation-duration: .2s;
          animation-iteration-count: 1;
          animation-timing-function: ease;
        }

        @keyframes pulse_click {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }

      }

      .roulette-table-button-between-left {
        //background-color: #0EAF51;
        width: 5px;
        height: 44px;
        z-index: 2;
        position: relative;

        &:after {
          z-index: 3;
          position: absolute;
          content: ' ';
          top: 0;
          bottom: 0;
          left: -2.5px;
          width: 10px;

          //background-color: #1b1d21;
        }
      }

      .roulette-table-button-between-up {
        //background-color: #00F6FF;
        height: 5px;
        width: 44px;
        z-index: 2;
        position: relative;
        margin-left: 5px;

        &:after {
          z-index: 3;
          position: absolute;
          content: ' ';
          left: 0;
          right: 0;
          top: -2.5px;
          height: 10px;

          //background-color: #1b1d21;
        }
      }

      .roulette-table-button-between-center {
        content: ' ';
        //background-color: #fff;
        width: 12px;
        height: 12px;
        position: absolute;
        bottom: -3.5px;
        left: -3.5px;
        z-index: 4;
      }

      .roulette-table-main {
        display: flex;
        justify-content: center;

        .roulette-table-left {
          margin-top: 5px;
        }

        .roulette-table-right {
          margin-top: 5px;
          display: flex;
          flex-direction: column;

          > button {
            margin-right: 0;
            margin-left: 5px;
          }
        }

        .roulette-table-middle {
          max-width: 588px;
          display: flex;
          margin-bottom: 5px;

          .roulette-table-middle-wrap {
            display: flex;
            flex-wrap: wrap;
            > div {
              display: flex;
              flex-direction: column;

              > div {
                display: flex;
                position: relative;
              }
            }
          }
        }
      }

      .roulette-table-down-wrap {
        width: 588px;
        margin: 0 49px;
        .roulette-table-down-button {
          display: none;
        }
        .roulette-table-down {

          > div {
            display: flex;
          }

          .roulette-table-button {
            width: 100%;
            &:first-of-type {
              margin-left: 3px;
            }
            &:last-of-type {
              margin-right: 0;
            }
          }
        }
      }


      .hidden-chip {
        content: ' ';
        position: absolute;
        top: 0;
        left: 0;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        transition: transform .05s ease;
        z-index: 15;
        display: flex;

        //background: #000;

        visibility: hidden;
        opacity: 0;

        transform: translateZ(0);
        will-change: transform;

        pointer-events: none;

        > svg {
          width: 30px;
          height: 30px;
        }

        &.active {
          visibility: visible;
          opacity: 1;
          z-index: 11;
        }
      }

      &.remove {
        z-index: 30;

        .chips-stack {
          animation-name: pulse_remove;
          animation-duration: 1.5s;
          animation-iteration-count: infinite;
          animation-timing-function: ease;

          //cursor: pointer;
          //pointer-events: visible;
        }

        @keyframes pulse_remove {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }

        .roulette-table-button-edit {
          pointer-events: none;
          border-color: #2A2D3B;
          color: #2A2D3B;
          &.roulette-table-button-remove {
            pointer-events: visible;
            border-color: #00A0ED;
            color: #fff;
          }
        }
      }
    }
  }
</style>
