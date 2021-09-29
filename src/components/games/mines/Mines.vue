<template>
  <div class="mines">

    <div class="mines-game">
      mines game

      <div class="mines-game-field">

        <div v-for="row in 5" :key="row" class="mines-game-row">
          <div v-for="line in 5" :key="line" class="mines-game-item">
            1
          </div>
        </div>
      </div>
    </div>

    <MinesBet />
  </div>
</template>

<script>
import MinesBet from '@/components/games/mines/MinesBet'
export default {
  name: 'Mines',
  components: { MinesBet },
  data() {
    return {
      fields: [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
      ]
    }
  }

}
</script>

<style lang="scss" scoped>
  .mines {
    display: flex;
    justify-content: space-between;

    .mines-game {
      flex: 1;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .mines-game-field {
        .mines-game-row {
          display: flex;

          .mines-game-item {
            height: 60px;
            width: 60px;
            margin: 4px;
            border-radius: 4px;
            background-color: cornflowerblue;

          }
        }
      }
    }
  }
</style>
