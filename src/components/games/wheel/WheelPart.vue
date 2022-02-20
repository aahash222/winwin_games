<template>
  <svg id="svgPart" viewBox="0 0 100 100" style="transform: rotate(-90deg)"></svg>

</template>

<script>
export default {
  name: 'WheelPart',
  mounted () {
    const svgEl = document.getElementById('svgPart')
    const percent = 0.1
    const color = '#00ab6b'
    let cumulativePercent = 0

    function getCoordinatesForPercent(percent) {
      const x = Math.cos(2 * Math.PI * percent) * 100
      const y = Math.sin(2 * Math.PI * percent) * 100
      return [x, y]
    }


    // destructuring assignment sets the two variables at once
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent)

    // each slice starts where the last slice ended, so keep a cumulative percent
    cumulativePercent += percent

    const [endX, endY] = getCoordinatesForPercent(cumulativePercent)

    // if the slice is more than 50%, take the large arc (the long way around)
    const largeArcFlag = percent > 0.5 ? 1 : 0

    // create an array and join it just for code readability
    const pathData = [
      `M ${startX} ${startY}`, // Move
      `A 100 100 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
      `L ${endX * 0.9} ${endY * 0.9}`, // Line
      `A 100 100 0 1 0 ${endX * 0.9} 0`,
    ].join(' ')

    // create a <path> and append it to the <svg> element
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    pathEl.setAttribute('d', pathData)
    pathEl.setAttribute('fill', color)
    svgEl.appendChild(pathEl)

  }
}
</script>

<style scoped>

</style>
