import speechError from './speechError'
import './types/recognizer'

// throw error if not grant within 30 seconds
const grantTimeout = 30
// throw error if no result within 5 seconds
const defaultTimeout = 5

export default class speechRecognizer {
  grantTimer: number | null
  resultTimer: number | null
  SpeechRecognition: any
  isSpeeching: boolean
  callbackHandler: recognizerCallbak
  recognition: any

  constructor (callbackHandler: recognizerCallbak) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    this.grantTimer = null
    this.resultTimer = null
    this.isSpeeching = false
    this.callbackHandler = callbackHandler

    if (typeof SpeechRecognition === 'function') {
      this.recognition = new SpeechRecognition()
      this.recognition.lang = 'cmn-Hant-TW'
      this.recognition.continuous = false

      this.recognition.onstart = this.onstart.bind(this)
      this.recognition.onend = this.onend.bind(this)
      this.recognition.onspeechstart = this.onspeechstart.bind(this)
      this.recognition.onspeechend = this.onspeechend.bind(this)
      this.recognition.onresult = this.onresult.bind(this)
      this.recognition.onerror = this.onerror.bind(this)
    } else {
      this.callError('Speech recognition is not supported.')
    }
  }

  callError(msg: string) {
    if (this.recognition) {
      this.recognition.stop()
    }
    if (typeof this.callbackHandler?.onerror === 'function') {
      if (this.isSpeeching) {
        const errorMsgs = speechError as { [key: string]: string }
        if (msg in errorMsgs) {
          this.callbackHandler.onerror(errorMsgs[msg])
        } else {
          this.callbackHandler.onerror(msg)
        }
        this.isSpeeching = false
      }
    }
  }

  onstart() {
    if (this.grantTimer !== null) {
      clearTimeout(this.grantTimer)
    }
    this.resultTimer = setTimeout(() => {
      this.callError('no-speech')
    }, defaultTimeout * 1000)
    if (typeof this.callbackHandler?.onstart === 'function') {
      this.callbackHandler.onstart()
    }
  }

  onend() {
    this.isSpeeching = false
  }

  onspeechstart() {
    if (this.resultTimer !== null) {
      clearTimeout(this.resultTimer)
    }
  }

  onspeechend() {
    if (this.resultTimer !== null) {
      clearTimeout(this.resultTimer)
    }
    if (typeof this.callbackHandler?.onstop === 'function') {
      this.callbackHandler.onstop()
    }
  }

  // This runs when the speech recognition service returns result
  onresult(event: SpeechRecognitionEvent) {
    if (this.resultTimer !== null) {
      clearTimeout(this.resultTimer)
    }
    const transcript = event.results[0][0].transcript
    if (typeof this.callbackHandler?.onresult === 'function') {
      this.callbackHandler.onresult(transcript)
    }
    this.recognition.stop()
  }

  onerror(event: SpeechRecognitionErrorEvent) {
    if (this.resultTimer !== null) {
      clearTimeout(this.resultTimer)
    }
    this.callError(event.error)
  }

  speech() {
    if (!this.isSpeeching) {
      try {
        this.isSpeeching = true
        this.recognition.start()
      } catch (err: any) {
        this.callError(err.toString())
      }
      this.grantTimer = setTimeout(() => {
        this.callError('Speech grant timeout.')
      }, grantTimeout * 1000)
    }
  }

  abort() {
    if (this.resultTimer !== null) {
      clearTimeout(this.resultTimer)
    }
    if (typeof this.callbackHandler?.onstop === 'function') {
      this.callbackHandler.onstop()
    }
    this.recognition.abort()
  }
}
