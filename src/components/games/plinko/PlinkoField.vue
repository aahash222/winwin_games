<template>
  <div class="plinko-game-field" id="gameScreenPlinko">


    <canvas id="gameBackground" height="1080" width="1680"></canvas>
    <canvas id="gamePlinko" height="1080" width="1680"></canvas>
    <canvas id="gameCanvas" height="1080" width="1680"></canvas>


    <div class="holes">
      <div class="holes-wrap" id="holesWrap">

        <div v-for="i in rows + 1" :key="i" :id="'col-'+i" class="hole">

          <div class="hole-data disable-selection">
            <span></span><span class="hole-data-x">x</span>

            <div class="hole-tooltip disable-selection" :class="{left: i === 0 || i === 1, right: i === rows || i === rows+1}">
              <div><span>PROFIT </span><span>{{ getProfit(i-1).toFixed(8) }} <currency :symbol="userCurrency" size="12" /></span></div>
              <div><span>CHANCE </span><span>{{ getChance(i-1) }}%</span></div>
            </div>

          </div>
        </div>

        <div class="holes-edit"><a @click="toggleEditor"><img src="@/assets/games/plinko/edit.svg" alt="" /></a></div>
      </div>

      <transition name="slide-fade" mode="out-in">
        <PlinkoEditor
          v-show="isOpenEditor"
          :rtp="rtp"
          :rows="rows"
          :game-r-t-p="gameRTP"
          :game-r-t-p-error="gameRTPError"
          :array-rows="arrayRows"
          :array-risks="arrayRisks"
          :game-presets="gamePresets"
          :game-holes="gameHoles"
          @changeRisk="changeRisk"
          @selectPreset="selectPreset"
          @setHoles="setHoles"
          @updateRtp="updateRTP"
        />
      </transition>
    </div>


  </div>
</template>

<script>
import Matter from 'matter-js'
import PlinkoEditor from '@/components/games/plinko/PlinkoEditor'

class Plinko {
  constructor(world, x, y, r) {
    this.body = Matter.Bodies.circle(x, y, r, {
      isStatic: true,
      //restitution: 0,
      friction: 1,
      density: 0.1,
      collisionFilter: { category: 0x0001 }
    })
    this.r = r
    Matter.World.add(world, this.body)
  }
}
class MainBorder {
  constructor(world, level, x, y, width, height, angle) {
    //if (level === null) level = 0x0001

    const options = { isStatic: true, angle: angle }
    let filter = { collisionFilter: { category: 0x0001 } }
    if (level !== null) filter = { collisionFilter: { category: level } }

    this.options = Object.assign({}, filter, options)
    //console.log(this.options)
    this.body = Matter.Bodies.rectangle(x, y, width, height, this.options)
    this.width = width
    this.height = height
    this.angle = angle

    Matter.World.add(world, this.body)
  }

  show (ctx) {
    const pos = this.body.position
    ctx.save()
    ctx.fillStyle = '#ffdd47'
    ctx.translate(pos.x, pos.y)
    ctx.beginPath()
    ctx.rotate(this.angle)
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height)
    ctx.fill()

    ctx.restore()
  }

  remove(world) {
    Matter.World.remove(world, this.body)
  }
}

class ParticleBall {
  constructor(world, worldLevel, x, y, r, option, direction, cols, log) {
    this.defaults = {
      isStatic: true,
      restitution: 0.9,
      //restitution: .4,
      friction: 0.1,
      density: 0.1,
      collisionFilter: {
        mask: 0x0001 | worldLevel,
        group: -1
      },
    }
    //console.log("ball level: "+worldLevel)
    this.world = world
    this.worldLevel = worldLevel
    this.log = log
    this.options = Object.assign({}, this.defaults, option)
    this.body = Matter.Bodies.circle(x, y, r, this.options)
    this.r = r
    this.direction = direction
    this.cols = cols
    this.level = 0
    this.borders = []
    this.leave = false
    this.col = 0

    Matter.World.add(world, this.body)
  }

  show(ctx) {
    const pos = this.body.position
    ctx.save()
    ctx.fillStyle = this.options.fill || '#ffdd47'
    ctx.translate(pos.x, pos.y)
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, Math.PI * 2)

    ctx.closePath()
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.restore()


    ctx.save()

    const number = Math.log2(this.worldLevel)
    ctx.beginPath()
    ctx.fillStyle = '#1d1e23'
    ctx.translate(number > 9 ? pos.x - 5 : pos.x - 3, pos.y + 3)
    ctx.font = 'bold 10px Roboto'

    ctx.closePath()
    ctx.fillText(number.toString(), 0, 0)
    ctx.globalAlpha = 1

    ctx.restore()

  }

  remove(world) {
    Matter.World.remove(world, this.body)
  }
}
export default {
  name: 'PlinkoField',
  components: { PlinkoEditor },
  props: {
    rtp: { type: Number },
    bet: { type: Number },
    risk: { type: String },
    rows: { type: Number },
    answerData: { type: Object },
    arrayRisks: { type: Array },
    arrayRows: { type: Array },
  },
  data() {
    return {
      isTurboMode: false,
      isOpenEditor: false,
      gameRTPError: false,
      gameBlockBalls: false,
      gameRTP: 0,


      gameBallsUse: [],
      gamePlinkoDots: [],
      gamePlinko: [],
      gameHoles: [],
      particleBalls: [],

      gameCTX: null,
      engine: null,
      runner: null,
      animationFrame: null,

      canvasWidth: 1680,
      canvasHeight: 1080,
      canvasCenter: 0,
      particleSize: 5,
      particleSpacing: 35,
      particleSpacingX: 35,

      gamePresets: [
        [
          [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
          [5.6, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 5.6],
          [8.87, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.87],
          [8.36, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 8.36],
          [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
          [8.1, 4, 3, 1.9, 1.2, 0.9, 0.7, 0.7, 0.9, 1.2, 1.9, 3, 4, 8.1],
          [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1],
          [14.6, 8, 3, 2, 1.5, 1.1, 1, 0.7, 0.7, 1, 1.1, 1.5, 2, 3, 8, 14.6],
          [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16],
        ], //low
        [
          [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13], // 8
          [18, 4, 1.7, 0.91, 0.49, 0.49, 0.91, 1.7, 4, 18], // 9
          [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22], // 10
          [23.7, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 23.7], // 11
          [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33], // 12
          [43, 13, 6, 3, 1.3, 0.7, 0.4, 0.4, 0.7, 1.3, 3, 6, 13, 43], // 13
          [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58], // 14
          [87, 18, 11, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 11, 18, 87], // 15
          [107.7, 40.1, 9.79, 4.89, 2.93, 1.46, 0.97, 0.49, 0.29, 0.49, 0.97, 1.46, 2.93, 4.89, 9.79, 40.1, 107.7],
          //[110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110], // 16
          //[220, 50, 12, 5, 3, 1.5, 1, 0.4, 0.3, 0.4, 1, 1.5, 3, 5, 12, 50, 220],
        ], // med
        [
          [30.3, 4, 1.4, 0.28, 0.27, 0.28, 1.4, 4, 30.3],
          [43, 7, 1.99, 0.6, 0.2, 0.2, 0.6, 1.99, 7, 43],
          [75.6, 10, 3, 0.9, 0.3, 0.2, 0.3, 0.9, 3, 10, 75.6],
          [118.4, 14, 5.2, 1.4, 0.4, 0.2, 0.2, 0.4, 1.4, 5.2, 14, 118.4],
          [167.6, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 2, 8.1, 24, 167.6],
          [260, 37, 11, 4, 1, 0.21, 0.19, 0.19, 0.21, 1, 4, 11, 37, 260],
          [422, 56, 18, 5, 1.9, 0.3, 0.2, 0.2, 0.2, 0.3, 1.9, 5, 18, 56, 422],
          [620, 88, 29, 8, 3, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 3, 8, 29, 88, 620],
          [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000],
        ], // high
      ],
    }
  },
  computed: {
    userCurrency: function() {
      return this.$store.getters.getUserCurrency
    },
  },
  watch: {
    risk: function() {
      this.changeRiskOrRows()
    },
    rows: function() {
      this.changeRiskOrRows()
    },
    gameHoles: function(value) {
      this.changeHoles(value)
    },
    answerData: function(value) {
      this.play(value)
    }
  },
  mounted () {
    this.run()

    this.printHoles()
    this.printBackground()
    this.printPlinkoBackground()

    this.setPreset(this.risk, this.rows)

    window.addEventListener('resize', this.handleWindowResize)
  },
  beforeDestroy() {
    this.stop()
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    play: function(answer) {
      this.createBall(answer, this.getBallLevel(), {})
    },
    createBall: function(direction, level, log) {

      //direction = [1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1]
      const cols = []
      let col = 0
      for (let i = 0; i < direction.length; i++) {
        if (direction[i] === 1) col++
        cols.push(col)
      }


      const p = new ParticleBall(this.gameWorld, level, this.canvasCenter + (Math.random() - 0.5), 0, this.ballSize, { isStatic: false, fill: '#00acff' }, direction, cols, log)
      p.borders = this.addBordersBall(this.gameWorld, p)


      this.particleBalls.push(p)
    },
    addBordersBall: function(world, ball) {
      const borders = []
      const degOne = 0.30
      const degTwo = 0.30
      const borderDeg = this.particleSpacingX / 4 + this.ballSize / 4


      let col = 0
      for (let level = 0; level < this.rows; level++) {
        if (level === 0) {
          if (ball.direction[level] === 1) {
            borders.push(new MainBorder(world, ball.worldLevel, this.gamePlinkoDots[0][1].x - this.particleSpacingX / 2, this.gamePlinkoDots[0][1].y - this.particleSpacing + 8, this.particleSpacing * 2, 1, Math.PI * 0.28))
            col++
          } else {
            borders.push(new MainBorder(world, ball.worldLevel, this.gamePlinkoDots[0][1].x + this.particleSpacingX / 2, this.gamePlinkoDots[0][1].y - this.particleSpacing + 8, this.particleSpacing * 2, 1, Math.PI * -0.28))
          }

        } else {

          if (ball.direction[level] === 1) {
            borders.push(new MainBorder(world, ball.worldLevel, this.gamePlinkoDots[level - 1][col].x + borderDeg, this.gamePlinkoDots[level - 1][col].y + this.particleSpacing / 2, this.particleSpacing, 1, Math.PI * degOne))
            borders.push(new MainBorder(world, ball.worldLevel, this.gamePlinkoDots[level - 1][col].x + this.particleSpacingX + borderDeg, this.gamePlinkoDots[level - 1][col].y + this.particleSpacing / 2, this.particleSpacing, 1, Math.PI * degTwo))
            col++
          } else {
            borders.push(new MainBorder(world, ball.worldLevel, this.gamePlinkoDots[level - 1][col].x - borderDeg, this.gamePlinkoDots[level - 1][col].y + this.particleSpacing / 2, this.particleSpacing, 1, Math.PI * -degTwo))
            borders.push(new MainBorder(world, ball.worldLevel, this.gamePlinkoDots[level - 1][col].x + this.particleSpacingX - borderDeg, this.gamePlinkoDots[level - 1][col].y + this.particleSpacing / 2, this.particleSpacing, 1, Math.PI * -degOne))
          }

        }
      }

      return borders
    },
    handleWindowResize: function () {
      this.stop()

      this.run()

      this.printHoles()
      this.printBackground()
      this.printPlinkoBackground()
    },
    run: function() {
      this.gameBallsUse = []
      for (let i = 0; i < 31; i++) this.gameBallsUse.push({ value: Math.pow(2, i + 1), use: false })


      this.engine = Matter.Engine.create()
      this.gameWorld = this.engine.world


      const canvas = document.getElementById('gameCanvas')
      this.gameCTX = canvas.getContext('2d')
      const width = this.canvasWidth
      const height = this.canvasHeight
      this.canvasCenter = width / 2



      const tmp = (0.9 * height / (this.rows - 1))
      this.particleSpacing = tmp * 1.08

      this.particleSize = tmp * 0.16

      this.particleSpacingX = this.particleSpacing + this.particleSize

      this.ballSize = tmp * 0.29
      this.borderDeg = tmp * 0.38

      const self = this


      this.printPlinko(this.gameWorld)

      //их надо перенести на основной уровень вместе с точками
      const mainBorders = []
      mainBorders.push(new MainBorder(this.gameWorld, null, this.canvasWidth / 2 - this.particleSpacingX, 0, 100, 4, Math.PI * 0.5))
      mainBorders.push(new MainBorder(this.gameWorld, null, this.canvasWidth / 2 + this.particleSpacingX, 0, 100, 4, Math.PI * 0.5))


      const firstBorderX = this.canvasWidth / 2 - (this.particleSpacingX * (this.rows / 2 + 0.5))
      for (let j = 0; j < this.rows + 2; j++) {
        mainBorders.push(new MainBorder(this.gameWorld, null, firstBorderX + (this.particleSpacingX * j), 0.105 * this.canvasHeight + (this.particleSpacing - this.particleSize) * (this.rows - 0.5), this.particleSpacing, 4, Math.PI * 0.5))
      }

      this.runner = Matter.Engine.run(this.engine)

      const levels = []
      for (let j = 0; j < this.rows; j++) {
        levels.push(0.1 * height + j * (this.particleSpacing - this.particleSize))
      }



      Matter.Events.on(this.engine, 'afterUpdate', () => {
        // проверяем все шарики
        // если за пределами поля то удаляем его из массива
        // если в поле то контралируем его траекторию

        for (let i = 0; i < this.particleBalls.length; i++) {

          let level = 0
          for (let j = 0; j < levels.length; j++) {
            if (this.particleBalls[i].body.position.y < levels[j]) {
              level = j
              break
            }
          }

          if (level >= 1) {
            const maxY = levels[level]
            const topMinX = this.gamePlinkoDots[level - 1][this.particleBalls[i].cols[level - 1]].x
            const downMinX = this.gamePlinkoDots[level][this.particleBalls[i].cols[level]].x
            // получаем процент прохождения по оси Y, верх 0, низ 1
            const percent = 1 - ((maxY - this.particleBalls[i].body.position.y) / (this.particleSpacing - this.particleSize))

            const currentMinX = topMinX + (downMinX - topMinX) * percent

            let levelSet = false
            if (level > this.particleBalls[i].level) {
              this.particleBalls[i].level = level
              levelSet = true
            }

            //super fast mode
            if (this.isTurboMode && levelSet === true && level < this.rows - 1) {
              //console.log("set ", level)
              this.particleBalls[i].body.position = {
                x: this.gamePlinkoDots[this.particleBalls[i].level][this.particleBalls[i].cols[this.particleBalls[i].level]].x + this.particleSpacingX / 2,
                y: levels[this.particleBalls[i].level + 1] - this.particleSpacing / 2 - this.particleSize
              }
            }




            if (this.particleBalls[i].level > 0 && level + 1 < this.particleBalls[i].level) {
              //console.log("bug ", Math.log2(this.particleBalls[i].worldLevel))
              this.particleBalls[i].body.position = {
                x: this.gamePlinkoDots[this.particleBalls[i].level - 1][this.particleBalls[i].cols[this.particleBalls[i].level - 1]].x + this.particleSpacingX / 2,
                y: levels[this.particleBalls[i].level] - this.particleSpacing / 2 - this.particleSize
              }
            }


            if (this.particleBalls[i].body.position.x < currentMinX) {
              //console.log("left", Math.log2(this.particleBalls[i].worldLevel))
              this.particleBalls[i].body.position.x = this.gamePlinkoDots[this.particleBalls[i].level - 1][this.particleBalls[i].cols[this.particleBalls[i].level - 1]].x + this.particleSpacingX / 2

            }

            if (this.particleBalls[i].body.position.x > currentMinX + this.particleSpacingX) {
              //console.log("right", Math.log2(this.particleBalls[i].worldLevel))
              this.particleBalls[i].body.position.x = this.gamePlinkoDots[this.particleBalls[i].level - 1][this.particleBalls[i].cols[this.particleBalls[i].level - 1]].x + this.particleSpacingX / 2
            }

          }

          // show hole
          if (this.particleBalls[i].leave === false && this.particleBalls[i].body.position.y > this.gamePlinkoDots[this.gamePlinkoDots.length - 1][0].y) {
            this.particleBalls[i].leave = true

            this.animationHole(this.particleBalls[i].cols[this.rows - 1])


            const profit = this.particleBalls[i].log.win - this.particleBalls[i].log.bet
            //this.printResult({ value: this.particleBalls[i].log.data.h[this.particleBalls[i].log.data.r], hash: this.particleBalls[i].log.hash, profit: profit })
            //this.userUpdateBalance(profit, this.particleBalls[i].log.win, profit > 0, this.particleBalls[i].log.curr, this.particleBalls[i].log.nonce)


            //this.$store.dispatch('updateDatabaseStats', this.particleBalls[i].log).then()

          }

          if (this.particleBalls[i].leave === true && this.particleBalls[i].body.position.y > this.gamePlinkoDots[this.gamePlinkoDots.length - 1][0].y + 100) {
            for (let k = 0; k < this.particleBalls[i].borders.length; k++) {
              this.particleBalls[i].borders[k].remove(this.gameWorld)
            }

            this.particleBalls[i].remove(this.gameWorld)

            let useCount = 0
            for (let k = 0; k < this.gameBallsUse.length; k++) {
              if (this.gameBallsUse[k].value === this.particleBalls[i].worldLevel) {
                this.gameBallsUse[k].use = false
              }
              if (this.gameBallsUse[k].use === true) useCount++
            }
            if (useCount < this.gameBallsUse.length) this.gameBlockBalls = false

            this.particleBalls.splice(i, 1)
            i--
          }
        }
      })


      function draw() {

        self.gameCTX.clearRect(0, 0, width, height)
        if (self.particleBalls.length > 0) {
          for (let i = 0; i < self.particleBalls.length; i++) {
            self.particleBalls[i].show(self.gameCTX)
            //for(let j=0;j<this.particleBalls[i].borders.length;j++) this.particleBalls[i].borders[j].show(this.gameCTX);
          }
        }

      }
      function loop() {
        draw()
        self.animationFrame = window.requestAnimationFrame(loop)
      }
      //loop();
      this.animationFrame = window.requestAnimationFrame(loop)
    },
    stop: function() {
      if (this.particleBalls.length > 0) {
        for (let i = 0; i < this.particleBalls.length; i++) {

          //this.printResult({value: this.particleBalls[i].log.data.h[this.particleBalls[i].log.data.r], hash: this.particleBalls[i].log.hash})
          //let profit = this.particleBalls[i].log.win - this.particleBalls[i].log.bet

          //this.userUpdateBalance(profit, this.particleBalls[i].log.win, profit > 0, this.particleBalls[i].log.curr, this.particleBalls[i].log.nonce)

          //this.$store.dispatch('updateDatabaseStats', this.particleBalls[i].log).then()



          for (let k = 0; k < this.particleBalls[i].borders.length; k++) {
            this.particleBalls[i].borders[k].remove(this.gameWorld)
          }

          this.particleBalls[i].remove(this.gameWorld)
          this.particleBalls.splice(i, 1)
          i--
        }
      }

      const canvasBG = document.getElementById('gameBackground')
      if (canvasBG !== null) {
        const ctxBG = canvasBG.getContext('2d')
        ctxBG.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      }

      const canvasPlinkoBG = document.getElementById('gamePlinko')
      if (canvasPlinkoBG !== null) {
        const ctxPlinkoBG = canvasPlinkoBG.getContext('2d')
        ctxPlinkoBG.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      }


      const canvas = document.getElementById('gameCanvas')
      if (canvas !== null) {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      }

      //stop Matter
      Matter.Runner.stop(this.runner)

      window.cancelAnimationFrame(this.animationFrame)
    },
    animationHole: function(col) {
      const elem = document.getElementById('col-' + (col + 1))
      if (elem === null) return

      //const soundRow = this.gameSounds[this.gameRowsVariants.indexOf(this.gameRows)]
      //this.$store.commit('playSound', 'plinkoDrop' + soundRow[col])

      elem.classList.remove('active')
      setTimeout(() => {
        elem.classList.add('active')
        setTimeout(() => {
          elem.classList.remove('active')
        }, 500)
      }, 10)
    },
    printPlinko: function(world) {
      this.gamePlinkoDots = []
      this.gamePlinko = []

      for (let j = 0; j < this.rows; j++) {
        const colsCount = 3 + j
        const startPosition = this.canvasCenter - Math.floor(colsCount / 2) * (this.particleSpacingX)
        for (let i = 0; i < colsCount; i++) {

          const x = startPosition + (i * this.particleSpacingX) + (this.particleSpacingX * (j % 2)) / 2

          const y = 0.1 * this.canvasHeight + j * (this.particleSpacing - this.particleSize)
          const p = new Plinko(world, x, y, this.particleSize)

          this.gamePlinko.push(p)

          const data = { x: x, y: y }
          if (this.gamePlinkoDots[j] === undefined) {
            const arr = []
            arr.push(data)
            this.gamePlinkoDots.push(arr)
          } else {
            this.gamePlinkoDots[j].push(data)
          }
        }
      }
    },
    printHoles: function() {
      const center = this.canvasWidth / 2
      const width = Math.floor((3 + this.rows) / 2) * this.particleSpacingX - this.particleSpacingX / 2 - (this.particleSpacingX * ((2 + this.rows) % 2)) / 2


      const positionOne = center - width
      const positionTwo = center + width

      const elem = document.getElementById('holesWrap')
      //const elem2 = document.getElementById('holesEditor')
      const canvasWidth = document.getElementById('gameCanvas').clientWidth
      const percent = this.canvasWidth / canvasWidth

      elem.style.width = ((positionTwo - positionOne) / percent) + 'px'

      //if (this.$store.getters.getDeviceType !== 'mobile')
      //elem2.style.width = ((positionTwo - positionOne) / percent + 16) + 'px'
    },
    printBackground: function() {
      const center = this.canvasWidth / 2
      const width = Math.floor((3 + this.rows) / 2) * this.particleSpacingX - this.particleSpacingX / 2 - (this.particleSpacingX * ((2 + this.rows) % 2)) / 2

      const positionOne = center - width
      const positionTwo = center + width

      const positionOneUp = center - this.particleSpacingX
      const positionTwoUp = center + this.particleSpacingX

      const positionDown = 0.1 * this.canvasHeight + (this.rows - 1) * (this.particleSpacing - this.particleSize)

      const canvas = document.getElementById('gameBackground')
      const ctx = canvas.getContext('2d')

      ctx.beginPath()
      ctx.moveTo(positionOne, positionDown)
      ctx.lineTo(positionTwo, positionDown)
      ctx.lineTo(positionTwoUp, 0.1 * this.canvasHeight)
      ctx.lineTo(positionOneUp, 0.1 * this.canvasHeight)
      ctx.fillStyle = '#1a1d37'

      ctx.fill()

      for (let i = 0; i < this.rows + 1; i++) {
        let xUp = positionTwoUp - (this.particleSpacingX * i)
        let yUp = 0.1 * this.canvasHeight

        let xUpTwo = positionOneUp + (this.particleSpacingX * i)


        if (i > 2) {
          xUp = positionOneUp - (this.particleSpacingX * (i - 2)) + (this.particleSpacingX / 2 * (i - 2))
          yUp = 0.1 * this.canvasHeight + ((this.particleSpacing - this.particleSize) * (i - 2))

          xUpTwo = positionOneUp + this.particleSpacingX * 2 + (this.particleSpacingX * (i - 2)) - (this.particleSpacingX / 2 * (i - 2))
        }

        ctx.beginPath()
        ctx.moveTo(xUp, yUp)
        ctx.lineTo(positionTwo - (this.particleSpacingX * i), positionDown)
        ctx.strokeStyle = '#565e93'
        ctx.stroke()


        ctx.beginPath()
        ctx.moveTo(xUpTwo, yUp)
        ctx.lineTo(positionOne + (this.particleSpacingX * i), positionDown)
        ctx.strokeStyle = '#565e93'
        ctx.stroke()

        if (i < this.rows) {
          const xLineStart = positionOneUp - this.particleSpacingX / 2 * i
          const xLineStop = xLineStart + this.particleSpacingX * (i + 2)
          const yLine = 0.1 * this.canvasHeight + (this.particleSpacing * i) - (this.particleSize * i)

          ctx.beginPath()
          ctx.moveTo(xLineStart, yLine)
          ctx.lineTo(xLineStop, yLine)
          ctx.strokeStyle = '#565e93'
          ctx.stroke()
        }
      }
    },
    printPlinkoBackground: function() {
      const canvas = document.getElementById('gamePlinko')
      const ctx = canvas.getContext('2d')

      for (let j = 0; j < this.rows; j++) {
        const colsCount = 3 + j
        const startPosition = this.canvasCenter - Math.floor(colsCount / 2) * (this.particleSpacingX)

        for (let i = 0; i < colsCount; i++) {
          const x = startPosition + (i * this.particleSpacingX) + (this.particleSpacingX * (j % 2)) / 2
          const y = 0.1 * this.canvasHeight + j * (this.particleSpacing - this.particleSize)

          ctx.save()
          ctx.fillStyle = '#ffdd47'
          ctx.translate(x, y)
          ctx.beginPath()
          ctx.arc(0, 0, this.particleSize, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }
    },
    setPreset: function(risk, rows) {
      const riskIndex = this.arrayRisks.indexOf(risk)
      const rowsIndex = this.arrayRows.indexOf(rows)

      const preset = this.gamePresets[riskIndex][rowsIndex]

      //console.log('set preset ', preset)
      this.setHoles(preset)

      const elem = document.getElementById('holesWrap').firstChild
      //this.holeWidth = this.$store.getters.getDeviceType !== 'mobile' ? elem.clientWidth : 30
    },
    setHoles: function(data) {
      const elements = document.getElementById('holesWrap').getElementsByClassName('hole-data')

      //console.log("elements: "+elements.length)
      for (let i = 0; i < elements.length; i++) {
        elements[i].firstChild.innerHTML = data[i]
        elements[i].getElementsByClassName('hole-data-x')[0].style.display = 'inline'
        if (data[i] > 999) {
          elements[i].getElementsByClassName('hole-data-x')[0].style.display = 'none'
        }
      }

      this.gameHoles = data

      this.updateRTP()
    },
    updateRTP: function() {
      this.gameRTPError = false

      let rtp = 0
      for (let i = 0; i < this.gameHoles.length; i++) {
        rtp += this.gameHoles[i] * this.getChance(i)
      }
      this.gameRTP = parseFloat(rtp.toFixed(4))

      if (this.gameRTP >= this.rtp) {
        this.gameRTPError = true
      }
    },
    getBallLevel: function() {
      let level = 0
      let useCount = 0

      for (let i = 0; i < this.gameBallsUse.length; i++) {
        if (level === 0 && this.gameBallsUse[i].use === false) {

          level = this.gameBallsUse[i].value
          this.gameBallsUse[i].use = true
        }

        if (this.gameBallsUse[i].use === true) useCount++
      }
      if (useCount === this.gameBallsUse.length) this.gameBlockBalls = true
      return level
    },
    getProfit: function(hole) {
      const n = this.gameHoles[hole]

      return n * this.bet - this.bet
    },
    getChance: function(hole) {
      function factorial(nn) {
        if (nn <= 1) return 1
        else return nn * factorial(nn - 1)
      }

      const n = this.rows + 1
      const k = hole

      const result = factorial(n - 1) / (factorial(k) * factorial(n - 1 - k) * Math.pow(2, n - 1))

      return Math.round(result * 100 * 10000) / 10000
    },
    changeRiskOrRows: function () {
      this.stop()
      this.run()
      this.printHoles()
      this.printBackground()
      this.printPlinkoBackground()

      setTimeout(() => {
        this.setPreset(this.risk, this.rows)
      }, 50)
    },
    selectPreset: function (select) {
      const selectRows = this.customPresets[select]

      this.gameHoles = selectRows
      this.setHoles(selectRows)


    },
    changeRisk: function (value) {
      this.$emit('changeRisk', value)
    },
    toggleEditor: function() {
      this.isOpenEditor = !this.isOpenEditor
    },
    changeHoles: function(value) {
      this.$emit('changeHoles', value)
    }
  }
}
</script>


<style lang="scss" scoped>
  .plinko-game-field {
    width: 94%;
    margin: 0 auto;
    position: relative;

    #gameCanvas,
    #gameBackground,
    #gamePlinko {
      top: 0;
      left: 0;
      width: 100%;
      position: absolute;
      display: inline-block;

      transform: translate3d(0,0,0);
      -webkit-backface-visibility: hidden !important;
    }

    .holes {
      width: 100%;

      .holes-wrap {
        display: flex;
        margin: 0 auto;
        justify-content: space-between;
        position: relative;


        .holes-edit {
          position: absolute;
          right: -90px;
          width: 80px;
          text-align: left;
          font-weight: bold;
          a {
            color: #00aceb;
            transition: .2s ease;
            &:hover {
              color: #00769c;
            }
          }
        }
      }


      .holes-wrap .holes-edit-left {
        position: absolute;
        left: -90px;
        width: 80px;
        text-align: right;
        font-weight: bold;
      }

    }

    &:before {
      content: "";
      display: block;
      padding-top: 62%;
    }
  }
</style>
