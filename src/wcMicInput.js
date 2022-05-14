import '@webcomponents/webcomponentsjs/webcomponents-bundle'
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'
import '@webcomponents/custom-elements/custom-elements.min.js'

import Recognizer from './speechRecognizer'
import micStyle from './mic.scss'
import soundImg from '../assets/sound'

function getPixel (val) {
  const pixelVal = parseInt(val)
  if (!isNaN(pixelVal) && pixelVal > 0) {
    return pixelVal
  } else {
    return 50
  }
}
export default class MicInput extends HTMLElement {
  constructor () {
    super()

    // Shadow dom
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = this.template()

    this.realInput = null
    this.value_ = '0'
    this.recognizer = new Recognizer({
      onstart: () => { this.showAnimation.bind(this)() },
      onstop: () => { this.hideAnimation.bind(this)() },
      onresult: (text) => {
        this.shadowRoot.getElementById('mic-input').value = String(text).replace('。', '')
        this.hideAnimation.bind(this)()
      },
      onerror: (errMsg) => {
        // console.log(err)
        this.hideAnimation.bind(this)()
        this.displayError.bind(this)(errMsg)
      }
    })
  }

  connectedCallback () {
    const _self = this

    this.realInput = document.createElement('input')
    this.realInput.type = 'hidden'
    this.realInput.name = this.attributes.name?.value
    this.realInput.value = this.value_
    this.appendChild(this.realInput)

    // Style
    const styleElement = document.createElement('style')
    styleElement.appendChild(
      document.createTextNode(
        `:host{--input-height: ${getPixel(_self.attributes.height?.value)}px;--icon-scale: ${getPixel(_self.attributes.height?.value) / 48};}`
      )
    )
    styleElement.appendChild(document.createTextNode(micStyle))
    this.shadowRoot.appendChild(styleElement)

    this.valueChange = this.valueChange.bind(this)
    this.speech = this.speech.bind(this)
    this.shadowRoot.getElementById('mic-icon').addEventListener('click', this.speech)
  }

  speech () {
    const element = this.shadowRoot.getElementById('error-message')
    if (element) {
      element.parentElement.removeChild(element)
    }
    this.recognizer.speech()
  }

  showAnimation () {
    const element = document.createElement('div')
    element.id = 'sound-animation'
    element.classList.add('sound-animation')
    const spanElement = document.createElement('span')
    spanElement.append(document.createTextNode('Listening...'))
    element.appendChild(spanElement)
    const imgElement = document.createElement('img')
    imgElement.src = soundImg
    element.appendChild(imgElement)
    this.shadowRoot.querySelector('.wrap').appendChild(element)
  }

  hideAnimation () {
    const element = this.shadowRoot.getElementById('sound-animation')
    if (element) {
      element.parentElement.removeChild(element)
    }
  }

  displayError (errMsg) {
    const element = document.createElement('div')
    element.id = 'error-message'
    element.classList.add('fade-out')
    const spanElement = document.createElement('span')
    spanElement.append(document.createTextNode(errMsg))
    element.appendChild(spanElement)
    this.shadowRoot.querySelector('.wrap').appendChild(element)

    element.addEventListener('animationend', () => {
      element.parentElement.removeChild(element)
    })
  }

  disconnectedCallback () {
  }

  valueChange () {
    // this.value_ = this.shadowRoot.querySelector('input[type=radio][name="starRate"]:checked').value
    // if (this.realInput) {
    //   this.realInput.value = this.value_
    // }
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
