<template>
  <div class="avatar" v-html="svgCode" :style="{ width: size + 'px', height: size + 'px' }"></div>
</template>

<script>
import multiavatar from '@multiavatar/multiavatar'
export default {
  name: 'Avatar',
  props: {
    avatar: { type: String },
    size: { type: Number, default: 40 }
  },
  data() {
    return {
      svgCode: null
    }
  },
  watch: {
    avatar: function(value) {
      this.svgCode = multiavatar(this.avatar)
    }
  },
  mounted () {
    if (this.avatar !== null) {
      this.svgCode = multiavatar(this.avatar)
    }
  }
}
</script>

<style scoped>

</style>
