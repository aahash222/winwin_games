<template>
  <div class="bet-block">
    <div class="bet-block-mode">
      <a href="#" @click.prevent="manual = true" :class="{ active: manual }">Manual</a>
      <a href="#" @click.prevent="manual = false" :class="{ active: !manual }">Auto</a>
    </div>

    <div class="bet-block-manual">


      <div class="block-input bet-select-chip">
        <label>Chip cost</label>

        <div class="bet-select-chip-block">

          <div
            class="bet-select-chip-chip"
            v-for="(item, key) in chipVariants"
            :key="key"
            :class="{ active: chipSelected === key }"
            @click="selectChip(key)"
          >
            <RouletteChip
              :index="key"
              :amount="item"
            />
          </div>
        </div>

      </div>


      <div class="block-input" :class="{ error: errors.bet }">
        <label>Total bet</label>
        <div class="error-tooltip" v-show="errors.bet"><span>{{ errors.bet }}</span></div>
        <div class="bet-input-text">{{ totalBet.toFixed(decimal) }} <Currency :symbol="userCurrency" :size="20" /></div>
      </div>

      <div class="bet-button">
        <button @click="send">ROLL</button>
      </div>
    </div>
  </div>
</template>

<script>
import RouletteChip from '@/components/games/roulette/RouletteChip'
export default {
  name: 'RouletteBet',
  components: { RouletteChip },
  props: {
    locked: { type: Boolean },
    totalBet: { type: Number },
    chipVariants: { type: Array },
    errors: { type: Object },
  },
  data() {
    return {
      manual: true,

      chipSelected: 0,
    }
  },
  computed: {
    userCurrency: function () {
      return this.$store.getters.getUserCurrency
    },
    decimal: function() {
      return this.$store.getters.getGameDecimal
    },
  },
  methods: {
    selectChip(value) {
      this.chipSelected = value
      this.$emit('select', { number: value, amount: this.chipVariants[value] })
    },
    send: function() {
      this.$emit('send')
    }
  }
}
</script>

<style lang="scss" scoped>
  .bet-select-chip {


    .bet-select-chip-block {
      background-color: #080911;
      padding: 10px 10px;
      border-radius: 6px;

      display: flex;
      flex-wrap: wrap;

      .bet-select-chip-chip {
        padding: 0 4px;
        width: calc(20% - 8px);
        cursor: pointer;
        > svg {
          //display: inline-flex;
          //position: relative;
          width: 100%;
          height: 100%;
          transition: .3s ease;
        }
        &:hover, &.active {
          > svg {
            transform: scale(1.1);
          }
        }
      }
    }
  }
</style>
