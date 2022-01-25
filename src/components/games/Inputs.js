export default class Inputs {


  static checkKeyInput (val, count, key) {
    const lastVal = val
    const text = val.split('.')
    //console.log('press0')

    if (text[1] !== undefined && text[1].length > 0) {
      if (text[1].length > count) {
        return [text[0] + '.' + text[1].substr(0, count), true]
      }
    }

    //console.log('press1')

    if (text.length > 2) {
      return text[0] + '.' + text[1]
    }

    if (key !== 0) {
      //console.log(key)
      //let keyCode = String.fromCharCode(key)
      //if (keyCode === '0' && text[1].length !== count) {
      //  return val
      //}
      if (key === 8 && val.length > 0) {
        return [val, false]
      }

      if (key === 8 && val.length === 0) {
        return [val, true]
      }
    }

    //console.log('press2')

    val = val.replace(',', '.').replace(/(?![0-9.,])\W+|(?![0-9])\w+/g, '')

    if (val === '.') {
      val = '0.'
    }
    //console.log('press3')

    if (val.length === 0 || val === '0' || val === '0.') {
      return [val, true]
    }
    //console.log('press4')

    if (lastVal !== val) {
      return [val, true]
    }

    return [true, null]
  }

  static checkKeyInputData (e, value, min, round) {
    let isValid = true
    if (e !== undefined) {
      const data = this.checkKeyInput(value, round, e.which)
      if (data[0] !== true) {
        value = data[0]
        if (data[1] === true || parseFloat(value) < min) isValid = false
      }
    } else {
      value = this.formatNumber(value, round)
    }

    return { value: parseFloat(value), valid: isValid }
  }

  static checkMin(value, min) {
    if (value < min) return min
    return value
  }

  static checkMax(value, max) {
    if (value > max) return max
    return value
  }

  static keyBet (e, minimumBet, round) {
    return this.checkKeyInputData(e, e.target.value, minimumBet, round)
  }

  static keyChance (e, min, round) {
    return this.checkKeyInputData(e, e.target.value, min, round)
  }

  static keyPayout (e, min, round) {
    return this.checkKeyInputData(e, e.target.value, min, round)
  }

  static keyWin (winAmount, minimumWin, round, e) {
    // console.log('change win')
    let returnAmount = 0

    const check = this.checkKeyInputData(e, winAmount, minimumWin, round)
    if (check.valid === false) return check
    returnAmount = check.value

    if (returnAmount < minimumWin) returnAmount = minimumWin

    return { value: returnAmount, valid: true }
  }

  static formatNumber (val, round) {
    val = val.replace(',', '.').replace(/(?![0-9.,])\W+|(?![0-9])\w+/g, '')
    let pos = -1
    let count = 0
    const posArr = []
    while ((pos = val.indexOf('.', pos + 1)) !== -1) {
      count++
      if (count > 1) {
        posArr.push(pos)
      }
    }
    for (let i = 0; i < posArr.length; i++) {
      val = val.substring(0, posArr[i]) + val.substring(posArr[i] + 1)
    }
    const tmpExplode = val.split('.')
    if (tmpExplode[1] && tmpExplode[1].length > round) {
      val = tmpExplode[0] + '.' + tmpExplode[1].substr(0, round)
    }
    return val
  }

  static decimalAdjust (type, value, exp) {
    // Если степень не определена, либо равна нулю...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value)
    }
    value = +value
    exp = +exp
    // Если значение не является числом, либо степень не является целым числом...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN
    }
    // Сдвиг разрядов
    value = value.toString().split('e')
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)))
    // Обратный сдвиг
    value = value.toString().split('e')
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp))
  }

  static truncatedDown (value, decimals) {
    return this.decimalAdjust('floor', value, -decimals)
  }

  static truncatedUp (value, decimals) {
    return this.decimalAdjust('ceil', value, -decimals)
  }

  static truncatedRound (value, decimals) {
    return this.decimalAdjust('round', value, -decimals)
  }
}
