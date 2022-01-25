const moduleMenu = {
  state: {
    modalBet: {
      status: false,
      bet: null,
    }
  },
  getters: {
    isModalBet: state => state.modalBet.status,
    getModalBetId: state => state.modalBet.bet,
  },
  mutations: {
    openModalBet: (state, betId) => {
      state.modalBet = { status: true, bet: betId }
    },
    closeModalBet: state => {
      state.modalBet = { status: false, bet: null }
    }
  }

}

export default moduleMenu
