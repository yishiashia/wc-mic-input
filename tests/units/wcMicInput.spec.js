import '@testing-library/jest-dom'
import { fireEvent } from '@testing-library/dom'
import MicInput from '../../src/wcMicInput'

function fail(reason = "fail was called in a test.") {
  throw new Error(reason);
}

describe('wcMicInput.js', () => {
  window.customElements.define('mic-input', MicInput);

  test('Test dom element is rendered', () => {
    document.body.innerHTML = `
      <mic-input
        id="mic-input"
        name="message"
        height="36"
      ></mic-input>
    `
    const customElement = document.getElementById("mic-input")
    if (customElement !== null) {
      const micIcon = customElement.shadowRoot?.querySelector("#mic-icon")
      if (micIcon === null || micIcon === undefined) {
        fail("Fail to render mic icon element.")
      }
    } else {
      fail("Fail to render mic-input element.")
    }
  })

})
