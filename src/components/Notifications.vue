<template>
  <div class="notifications">
    <transition-group name="list" tag="div">
      <div v-for="(item) in notificationsData" class="notification" :class="'is-' + item.type" :key="item.index">
        <button v-if="item.isClose" class="delete" @click="closeNotification(item.index)"></button>
        <div v-if="!item.text.isMessage">
          {{item.text}}
        </div>
      </div>
    </transition-group>
  </div>

</template>

<script>
export default {
  name: 'Notifications',
  computed: {
    notificationsData: function () {
      return this.$store.getters.getNotificationData
    },
  },
  watch: {
    notificationsData: function(value) {
      console.log(value)
    }
  },
  methods: {
    closeNotification: function(index) {
      this.$store.commit('closeNotification', index)
    }
  }
}
</script>

<style lang="scss" scoped>
  .notifications {
    position: fixed;
    width: 320px;
    top: 10px;
    right: 10px;
    z-index: 100;

    .list-item {
      display: inline-block;
      //margin-right: 10px;
    }
    .list-enter-active, .list-leave-active {
      transition: all .5s;
    }
    .list-enter-to {
      opacity: 1;
      right: -300px;
      transform: translateX(-300px);
    }
    .list-leave-to {
      opacity: 0;
      transform: translateY(30px);
    }

    .notification {
      margin-bottom: 10px;
      border-radius: .375em;
      position: relative;
      padding: 1rem 2rem 1rem 1rem;
      text-align: left;

      max-width: 300px;

      .delete {
        right: .5rem;
        position: absolute;
        top: .5rem;

        width: 20px;
        font-size: 0;
        height: 20px;
        max-height: 20px;
        max-width: 20px;
        min-height: 20px;
        min-width: 20px;
        outline: 0;
        background-color: rgba(10,10,10,.2);
        border: none;
        border-radius: 9999px;
        cursor: pointer;
        pointer-events: auto;
        display: inline-block;
        user-select: none;
        &:before, &:after {
          background-color: #fff;
          content: "";
          display: block;
          left: 50%;
          position: absolute;
          top: 50%;
          transform: translateX(-50%) translateY(-50%) rotate(45deg);
          transform-origin: center center;
        }
        &:before {
          height: 2px;
          width: 50%;
        }
        &:after {
          height: 50%;
          width: 2px;
        }
      }

      &.is-info{
        background-color: #3e8ed0;
        color: #fff;
      }
      &.is-error {
        background-color: #f14668;
        color: #fff;
      }
    }
  }

</style>
