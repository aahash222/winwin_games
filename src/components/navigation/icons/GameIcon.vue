<template>
  <IconCrash v-if="false" :style="{ height: size + 'px', fill: '#' + fill}" />
  <IconDice v-if="game === 1" :style="{ height: size + 'px', fill: '#' + fill}" />
  <IconPlinko v-if="game === 3" :style="{ height: size + 'px', fill: '#' + fill}" />
  <IconRoulette v-if="game === 6" :style="{ height: size + 'px', fill: '#' + fill}" />
  <IconTower v-if="game === 4" :style="{ height: size + 'px', fill: '#' + fill}" />
  <IconWheel v-if="game === 5" :style="{ height: size + 'px', fill: '#' + fill}" />
  <IconSlots v-if="false" :style="{ height: size + 'px', fill: '#' + fill}" />
  <IconHilo v-if="game === 7" :style="{ height: size + 'px', fill: '#' + fill}" />
  <IconMines v-if="game === 2" :style="{ height: size + 'px', fill: '#' + fill}" />
  <IconKeno v-if="false" :style="{ height: size + 'px', fill: '#' + fill}" />
</template>

<script>
import IconKeno from '@/components/navigation/icons/IconKeno'
import IconMines from '@/components/navigation/icons/IconMines'
import IconHilo from '@/components/navigation/icons/IconHilo'
import IconSlots from '@/components/navigation/icons/IconSlots'
import IconWheel from '@/components/navigation/icons/IconWheel'
import IconTower from '@/components/navigation/icons/IconTower'
import IconRoulette from '@/components/navigation/icons/IconRoulette'
import IconPlinko from '@/components/navigation/icons/IconPlinko'
import IconCrash from '@/components/navigation/icons/IconCrash'
import IconDice from '@/components/navigation/icons/IconDice'

export default {
  name: 'GameIcon',
  components: { IconKeno, IconMines, IconHilo, IconSlots, IconWheel, IconTower, IconRoulette, IconPlinko, IconCrash, IconDice },
  props: {
    game: { type: Number },
    size: { type: Number },
    fill: { type: String }
  }
}
</script>

<style scoped>

</style>
