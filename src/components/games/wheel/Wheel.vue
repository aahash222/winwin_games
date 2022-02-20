<template>
  <div class="game-wheel">
    <div class="game-tower-wrap">

      <div class="game-block">

        <WheelLast />

        <div class="wheel-game-field">


          <WheelPart class="wheel-part wheel-part-1" style="height: 400px;"/>
          <!--
          <WheelPart class="wheel-part wheel-part-2" style="transform: rotate(36deg);" />
          -->
        </div>

      </div>

      <WheelBet />
    </div>
  </div>
</template>

<script>
import WheelBet from '@/components/games/wheel/WheelBet'
import WheelLast from '@/components/games/wheel/WheelLast'
import WheelPart from '@/components/games/wheel/WheelPart'
export default {
  name: 'Wheel',
  components: { WheelPart, WheelLast, WheelBet }
}
</script>

<style lang="scss" scoped>
  .game-wheel {
    height: 100%;

    .game-tower-wrap {
      display: flex;
      justify-content: space-between;
      height: 100%;

      .game-block {
        flex: 1;

        background-color: #0C0E1C;
        background-image: url("./../../../assets/games/wheel/background.svg");
        background-size: cover;


        .wheel-game-field {
          position: relative;
          display: flex;
          justify-content: center;


          .wheel-part {
            position: absolute;
          }
          .wheel-part-2 {

          }

        }
      }
    }
  }
</style>
