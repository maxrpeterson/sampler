import 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.58/Tone.js'

import { inputSelect } from './loadAudioInputOptions.js'

// prioritize sustained playback
const context = new Tone.Context({ latencyHint: 'interactive', lookAhead: 0.01 })
// set this context as the global Context
Tone.setContext(context)
// the global context is gettable with Tone.getContext()
console.log(Tone.getContext().latencyHint)

const startButton = document.querySelector('.js-start')
const micMeterOutput = document.querySelector('.audio-input-meter')
window.micMeterOutput = micMeterOutput

let mic
let micVolumeMeter

function meterReading() {
  micMeterOutput.style.setProperty(
    '--volume-level',
    `${micVolumeMeter && micVolumeMeter.getValue() * 100}%`,
  )
  // console.log('meter reading: ', micVolumeMeter.getValue())
  window.requestAnimationFrame(meterReading)
}

function startMonitoring(deviceId = 'default') {
  if (mic) mic.close()
  mic = new Tone.UserMedia()
  window.mic = mic
  mic.open(deviceId).then(() => {
    mic.connect(micVolumeMeter)
    window.requestAnimationFrame(meterReading)
  })
}

async function start() {
  micVolumeMeter = new Tone.Meter({ normalRange: true })
  window.micVolumeMeter = micVolumeMeter

  startMonitoring()

  inputSelect.addEventListener('change', ({ target: { value } }) => {
    console.log('changing mic id: ', value)
    startMonitoring(value)
  })
}

startButton.addEventListener('click', start)
