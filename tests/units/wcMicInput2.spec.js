import '@testing-library/jest-dom'
import { fireEvent } from '@testing-library/dom'
import MicInput from '../../src/wcMicInput'

jest.mock('../../src/wcMicInput');
beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  MicInput.mockClear();
});

describe('wcMicInput.js - mock test', () => {

  test('test showAnimation', () => {
    const inputObject = new MicInput()
    // console.log(inputObject)
    // inputObject.showAnimation()
    const mockMicInputInstance = MicInput.mock.instances[0];
    console.log(mockMicInputInstance)
    mockMicInputInstance.showAnimation()
    // let animationElement = mockMicInputInstance.shadowRoot.querySelector('#sound-animation')
    // console.log(animationElement)
  })

})