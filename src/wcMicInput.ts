import '@webcomponents/webcomponentsjs/webcomponents-bundle'
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'
import '@webcomponents/custom-elements/custom-elements.min.js'
import micStyle from './mic.scss'
import soundImg from '../assets/sound'
import speechRecognizer from './speechRecognizer'

function getPixel (val: string) {
  const pixelVal = parseInt(val)
  if (!isNaN(pixelVal) && pixelVal > 0) {
    return pixelVal
  } else {
    return 50
  }
}
export default class MicInput extends HTMLElement {
  recognizer: speechRecognizer | null
  realInput: HTMLInputElement | null
  value_: string

  constructor () {
    super()
    // Shadow dom
    this.attachShadow({ mode: 'open' })
    if (this.shadowRoot !== null) {
      this.shadowRoot.innerHTML = this.template()
    }
    this.recognizer = null
    this.realInput = null
    this.value_ = '0'
  }

  connectedCallback () {
    if (this.shadowRoot !== null) {
      this.realInput = document.createElement('input')
      this.realInput.type = 'hidden'
      const inputName = this.getAttribute('name')
      if (typeof inputName === 'string') {
        this.realInput.name = inputName
      }
      this.realInput.value = this.value_
      this.appendChild(this.realInput)
      const micInput = this.shadowRoot.getElementById('mic-input') as HTMLInputElement
      const micIcon = this.shadowRoot.getElementById('mic-icon') as HTMLElement
      this.recognizer = new speechRecognizer({
        onstart: () => { this.showAnimation.bind(this)() },
        onstop: () => { this.hideAnimation.bind(this)() },
        onresult: (text) => {
          if (this.shadowRoot !== null) {
            if (micInput !== null) {
              micInput.value = String(text).replace('。', '')
            }
          }
          this.valueChange()
          this.hideAnimation.bind(this)()
        },
        onerror: (errMsg) => {
          // console.log(err)
          this.hideAnimation.bind(this)()
          this.displayError.bind(this)(errMsg)
        }
      })
      // Style
      const styleElement = document.createElement('style')
      const givenHeight = this.getAttribute('height')
      styleElement.appendChild(document.createTextNode(`:host{--input-height: ${getPixel(String(givenHeight))}px;--icon-scale: ${getPixel(String(givenHeight)) / 48};}`))
      styleElement.appendChild(document.createTextNode(micStyle))
      this.shadowRoot.appendChild(styleElement)
      this.valueChange = this.valueChange.bind(this)
      this.speech = this.speech.bind(this)
      micIcon.addEventListener('click', this.speech)
      micInput.addEventListener('change', this.valueChange)
    }
  }

  speech () {
    if (this.shadowRoot !== null) {
      const element = this.shadowRoot.getElementById('error-message')
      if (element && element.parentElement) {
        element.parentElement.removeChild(element)
      }
      if (this.recognizer !== null) {
        this.recognizer.speech()
      }
    }
  }

  showAnimation () {
    if (this.shadowRoot !== null) {
      const element = document.createElement('div')
      element.id = 'sound-animation'
      element.classList.add('sound-animation')
      const spanElement = document.createElement('span')
      spanElement.append(document.createTextNode('Listening...'))
      element.appendChild(spanElement)
      const imgElement = document.createElement('img')
      imgElement.src = soundImg
      element.appendChild(imgElement)
      this.shadowRoot.querySelector('.wrap')?.appendChild(element)
    }
  }

  hideAnimation () {
    if (this.shadowRoot !== null) {
      const element = this.shadowRoot.getElementById('sound-animation')
      if (element) {
        element.parentElement?.removeChild(element)
      }
    }
  }

  displayError (errMsg: string) {
    if (this.shadowRoot !== null) {
      const element = document.createElement('div')
      element.id = 'error-message'
      element.classList.add('fade-out')
      const spanElement = document.createElement('span')
      spanElement.append(document.createTextNode(errMsg))
      element.appendChild(spanElement)
      this.shadowRoot.querySelector('.wrap')?.appendChild(element)
      element.addEventListener('animationend', () => {
        element.parentElement?.removeChild(element)
      })
    }
  }

  disconnectedCallback () {
  }

  valueChange () {
    if (this.shadowRoot !== null) {
      const inputElement = this.shadowRoot.getElementById('mic-input') as HTMLInputElement
      if (inputElement !== null) {
        this.value_ = inputElement.value
        if (this.realInput) {
          this.realInput.value = this.value_
        }
      }
    }
  }

  template () {
    return `
    <div class="wrap">
      <div class="input-block">
        <input id="mic-input" type="text" />
        <div id="mic-icon" class="right-icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>
        </div>
      </div>
    </div>
  `
  }
}
