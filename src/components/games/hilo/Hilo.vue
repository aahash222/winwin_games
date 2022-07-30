<template>
  <div class="game-hilo">

    <div class="game-hilo-wrap">

      <div class="game-block">


      </div>

      <HiloBet
        :locked="loader"
        :errors="errors"
      />
    </div>

  </div>
</template>

<script>
import HiloBet from '@/components/games/hilo/HiloBet'
export default {
  name: 'Hilo',
  components: { HiloBet },
  data() {
    return {
      loader: false,

      errors: {}
    }
  }
}
</script>

<style lang="scss" scoped>
.game-hilo {
  height: 100%;

  .game-hilo-wrap {
    display: flex;
    justify-content: space-between;
    height: 100%;

    .game-block {
      flex: 1;

      background-color: #0C0E1C;
      background-image: url("../../../assets/games/roulette/background.svg");
      background-size: cover;


    }
  }
}
</style>
