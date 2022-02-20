import Inputs from '@/components/games/Inputs'

export default {

  methods: {
    inputBet: function(e) {
      if (this.locked) return

      const bet = Inputs.keyBet(e, this.minimumBet, this.decimal)
      if (bet.valid === false) return

      let betAmount = bet.value
      betAmount = Inputs.checkMin(betAmount, this.minimumBet)
      betAmount = Inputs.checkMax(betAmount, this.$store.getters.getUserBalance)

      this.betAmount = betAmount
    },
    buttonBet: function(value) {
      if (value === 'min') {
        this.betAmount = this.minimumBet
      }
      if (value === 'max') {
        this.betAmount = this.$store.getters.getUserBalance
      }
      if (value === '1/2') {
        this.betAmount = this.betAmount / 2
      }
      if (value === 'x2') {
        this.betAmount = this.betAmount * 2
      }
    },
  }
}
