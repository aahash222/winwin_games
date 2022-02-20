<template>
  <div class="hotkeys">
    <div class="hotkeys-title">Hotkeys</div>
    <div class="hotkeys-data">
      <div>
        <div>233</div><div>233</div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Hotkeys'
}
</script>

<style lang="scss" scoped>
  .hotkeys {
    position: absolute;
    bottom: 60px;
    width: 260px;
    text-align: left;

    background-color: #131525;
    border: 1px solid #3e447c;

    border-radius: 6px;

    padding: 15px 20px;
    z-index: 1;

    .hotkeys-title {

    }
    .hotkeys-data {
      color: #6871C1;
      font-size: 14px;
      margin-top: 10px;

      > div {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
