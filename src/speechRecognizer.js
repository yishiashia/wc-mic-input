// throw error if not grant within 30 seconds
const grantTimeout = 30
// throw error if no result within 5 seconds
const defaultTimeout = 5

export default function Speech (callbackHandler) {
  const _self = this
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  let grantTimer = null
  let resultTimer = null

  _self.callbackHandler = callbackHandler

  const callError = function (msg) {
    if (typeof this.callbackHandler?.onerror === 'function') {
      this.callbackHandler.onerror('Speech recognition is not supported.')
    }
  }.bind(_self)

  if (typeof SpeechRecognition === 'function') {
    _self.recognition = new SpeechRecognition()

    _self.recognition.lang = 'cmn-Hant-TW'
    _self.recognition.continuous = false

    _self.recognition.onspeechstart = function () {
      if (grantTimer !== null) {
        clearTimeout(grantTimeout)
      }
      resultTimer = setTimeout(() => {
        callError('Speech timeout.')
      }, defaultTimeout * 1000)
      if (typeof _self.callbackHandler?.onstart === 'function') {
        _self.callbackHandler.onstart()
      }
    }

    _self.recognition.onspeechend = function () {
      if (resultTimer !== null) {
        clearTimeout(resultTimer)
      }
      if (typeof _self.callbackHandler?.onstop === 'function') {
        _self.callbackHandler.onstop()
      }
    }

    // This runs when the speech recognition service returns result
    _self.recognition.onresult = function (event) {
      if (resultTimer !== null) {
        clearTimeout(resultTimer)
      }
      const transcript = event.results[0][0].transcript
      if (typeof _self.callbackHandler?.onresult === 'function') {
        _self.callbackHandler.onresult(transcript)
      }
      _self.recognition.stop()
    }

    _self.recognition.onerror = function (event) {
      if (resultTimer !== null) {
        clearTimeout(resultTimer)
      }
      callError(event.error)
    }

    _self.speech = function (cb, ecb, startcb, endcb) {
      try {
        _self.recognition.start()
      } catch (err) {
        callError(err.toString())
      }
      grantTimer = setTimeout(() => {
        callError('Speech grant timeout.')
      }, grantTimeout * 1000)
    }

    _self.abort = function () {
      if (resultTimer !== null) {
        clearTimeout(resultTimer)
      }
      if (typeof _self.callbackHandler?.onstop === 'function') {
        _self.callbackHandler.onstop()
      }
      _self.recognition.abort()
    }
  } else {
    callError('Speech recognition is not supported.')
  }
}