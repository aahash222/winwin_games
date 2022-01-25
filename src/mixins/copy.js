export default {

  methods: {
    copy: function(e, id) {
      const copyTextarea = document.getElementById(id)
      copyTextarea.readOnly = false
      copyTextarea.focus()
      copyTextarea.select()
      copyTextarea.setSelectionRange(0, 9999)

      try {
        document.execCommand('copy')
        copyTextarea.readOnly = true

        const button = copyTextarea.nextSibling
        button.classList.add('tooltip-active')
        setTimeout(function () {
          button.classList.remove('tooltip-active')
        }, 2000)
      } catch (err) {
        // console.log('Oops, unable to copy')
      }
    }
  }
}
