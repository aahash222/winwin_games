<template>
  <div v-if="amount > 0" class="chips-stack" :class="size > 0 ? `size-${size}` : false">
    <span><RouletteChip :index="colorIndexOne" :amount="amount" /></span>
    <span v-if="amount >= this.chipVariants[this.variantIndex]"><RouletteChip :index="colorIndexTwo" :amount="amount" /></span>
    <span v-if="amount >= this.chipVariants[this.variantIndex * 2]"><RouletteChip :index="colorIndexThree" :amount="amount" /></span>


    {{variantIndex}}
  </div>
</template>

<script>
import RouletteChip from '@/components/games/roulette/RouletteChip'
export default {
  name: 'RouletteTableStack',
  components: { RouletteChip },
  props: {
    amount: { type: Number, default: 0 },
    size: { type: Number, default: 0 },
    chipVariants: { type: Array },
  },
  computed: {
    variantIndex: function() {
      const index = Math.floor(this.chipVariants.length / 3)
      return index
    },
    colorIndex: function() {
      let index = 0

      for (let i = 0; i < this.chipVariants.length; i++) {
        if (this.amount >= this.chipVariants[i]) {
          index = i
        }
      }
      return index
    },
    colorIndexOne: function() {
      if (this.amount < this.chipVariants[this.variantIndex]) {
        return this.colorIndex
      } else if (this.amount < this.chipVariants[this.variantIndex * 2]) {
        return this.colorIndex - 1
      }
      return this.colorIndex - 2
    },
    colorIndexTwo: function() {
      if (this.amount < this.chipVariants[this.variantIndex * 2]) {
        return this.colorIndex
      }
      return this.colorIndex - 1
    },
    colorIndexThree: function() {
      return this.colorIndex
    }
  }
}
</script>

<style lang="scss" scoped>
.chips-stack {
  pointer-events: none;
  position: absolute;

  bottom: 0;
  top: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;

  transform: rotateZ(0);
  will-change: transform;

  > span {
    position: absolute;
    display: flex;
    z-index: 0;

    > svg {
      width: 30px;
      height: 30px;
    }

    &:nth-of-type(2) {
      margin-top: -8px;
      margin-right: -5px;
      z-index: 1;
    }
    &:nth-of-type(3) {
      margin-top: -5px;
      margin-left: -5px;
      z-index: 1;
    }
  }

  &.size-20 {
    > span {
      > svg {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
