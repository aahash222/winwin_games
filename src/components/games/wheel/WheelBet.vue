<template>
  <div class="bet-block">

    <div class="bet-block-mode">
      <a href="#" @click.prevent="manual = true" :class="{ active: manual }">Manual</a>
      <a href="#" @click.prevent="manual = false" :class="{ active: !manual }">Auto</a>
    </div>

    sda
  </div>
</template>

<script>
export default {
  name: 'WheelBet',
  data() {
    return {
      manual: true,
      minimumBet: 0.00000100,
    }
  },
}
</script>

<style scoped>

</style>
