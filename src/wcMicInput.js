import '@webcomponents/webcomponentsjs/webcomponents-bundle'
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'
import '@webcomponents/custom-elements/custom-elements.min.js'

import Recognizer from './speechRecognizer'
import micStyle from './mic.scss'

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
      onstart: () => {},
      onstop: () => {},
      onresult: (text) => {
        this.shadowRoot.getElementById('mic-input').value = String(text).replace('。', '')
      },
      onerror: (err) => { console.log(err) }
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
        `:host{--input-height: ${getPixel(_self.attributes.height?.value)}px;--icon-scale: ${getPixel(_self.attributes.height?.value) / 50};}`
      )
    )
    styleElement.appendChild(document.createTextNode(micStyle))
    this.shadowRoot.appendChild(styleElement)

    this.valueChange = this.valueChange.bind(this)
    this.speech = this.speech.bind(this)
    this.shadowRoot.getElementById('mic-icon').addEventListener('click', this.speech)
  }

  speech () {
    this.recognizer.speech()
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
        <input id="mic-input" type="text" />
        <div id="mic-icon" class="right-icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M24 26.85Q21.85 26.85 20.4 25.3Q18.95 23.75 18.95 21.55V9Q18.95 6.9 20.425 5.45Q21.9 4 24 4Q26.1 4 27.575 5.45Q29.05 6.9 29.05 9V21.55Q29.05 23.75 27.6 25.3Q26.15 26.85 24 26.85ZM24 15.45Q24 15.45 24 15.45Q24 15.45 24 15.45Q24 15.45 24 15.45Q24 15.45 24 15.45Q24 15.45 24 15.45Q24 15.45 24 15.45Q24 15.45 24 15.45Q24 15.45 24 15.45ZM22.5 42V35.2Q17.2 34.65 13.6 30.75Q10 26.85 10 21.55H13Q13 26.1 16.225 29.2Q19.45 32.3 24 32.3Q28.55 32.3 31.775 29.2Q35 26.1 35 21.55H38Q38 26.85 34.4 30.75Q30.8 34.65 25.5 35.2V42ZM24 23.85Q24.9 23.85 25.475 23.175Q26.05 22.5 26.05 21.55V9Q26.05 8.15 25.45 7.575Q24.85 7 24 7Q23.15 7 22.55 7.575Q21.95 8.15 21.95 9V21.55Q21.95 22.5 22.525 23.175Q23.1 23.85 24 23.85Z"/></svg>
        </div>
      </div>
    `
  }
}
