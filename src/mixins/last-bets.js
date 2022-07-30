export default {
  data() {
    return {
      lastBets: [],
    }
  },
  methods: {
    addNewLastBet: function(uuid, value) {
      value.uuid = uuid
      this.lastBets.push(value)
      if (this.lastBets.length > 6) {
        this.lastBets.shift()
      }
    },
  }
}
