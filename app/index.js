import 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.58/Tone.js'

import { inputSelect } from './src/loadAudioInputOptions.js'

function preventDefaultThen(fn) {
  return (e) => {
    e.preventDefault()
    fn(e)
  }
}

// prioritize sustained playback
const context = new Tone.Context({ latencyHint: 'interactive', lookAhead: 0.01 })
// set this context as the global Context
Tone.setContext(context)
// the global context is gettable with Tone.getContext()
console.log(Tone.getContext().latencyHint)

const kickUrl = 'samples/DX Bass 8 Med.wav'

const kickSampler = new Tone.Sampler({
  urls: { A1: kickUrl },
  release: 1,
}).toDestination()
const clapSampler = new Tone.Sampler({
  urls: { A1: 'samples/DX Clap 16.wav' },
  release: 1,
}).toDestination()
// const hihatClosedSampler = new Tone.Sampler('samples/DX Hi-Hat Closed 14.wav').toDestination()

const userBuffer = new Tone.ToneAudioBuffer()

let userSampler

window.kickSampler = kickSampler
window.userSampler = userSampler
window.userBuffer = userBuffer

const kick = document.querySelector('.js-pad-kick')
const clap = document.querySelector('.js-pad-clap')
const userPad = document.querySelector('.js-pad-3')

function play(player) {
  return preventDefaultThen(() => {
    player.triggerAttack('A1', Tone.now())
  })
}

function stop(player) {
  return preventDefaultThen(() => {
    player.triggerRelease('A1', Tone.now())
  })
}

function playBuffer(buffer) {
  if (userSampler && userSampler.state === 'started') {
    userSampler.stop(Tone.now())
  }
  userSampler = new Tone.ToneBufferSource({
    url: buffer,
    // playbackRate: Tone.intervalToFrequencyRatio(-2),
  }).toDestination()
  userSampler.start(Tone.now(), /* offset */ 0)
}

// function stopBuffer(buffer) {
//   userSampler.stop(Tone.now())
// }

console.log('kickSampler buffer: ', kickSampler._buffers._buffers.get('33')._buffer)

kick.addEventListener('touchstart', play(kickSampler))
kick.addEventListener('mousedown', play(kickSampler))
clap.addEventListener('touchstart', play(clapSampler))
clap.addEventListener('mousedown', play(clapSampler))
userPad.addEventListener('touchstart', preventDefaultThen(() => playBuffer(userBuffer)))
userPad.addEventListener('mousedown', preventDefaultThen(() => playBuffer(userBuffer)))
// userPad.addEventListener('touchend', preventDefaultThen(() => stopBuffer(userBuffer)))
// userPad.addEventListener('mouseup', preventDefaultThen(() => stopBuffer(userBuffer)))

document.querySelector('.js-start').addEventListener('click', function start() {
  Tone.start()
})

const micMeterOutput = document.querySelector('.audio-input-meter')
const micVolumeMeter = new Tone.Meter({ normalRange: true })

window.micMeterOutput = micMeterOutput
window.micVolumeMeter = micVolumeMeter

function meterReading() {
  micMeterOutput.style.setProperty(
    '--volume-level',
    `${micVolumeMeter.getValue() * 100}%`,
  )
  // console.log('meter reading: ', micVolumeMeter.getValue())
  window.requestAnimationFrame(meterReading)
}

const mediaRecorder = new Tone.Recorder()
const mic = new Tone.UserMedia()
window.mic = mic
mic.open().then(() => {
  mic.fan(micVolumeMeter, mediaRecorder)
  window.requestAnimationFrame(meterReading)

  // const audioContext = mic.context._context._nativeAudioContext
  // const analyserNode = audioContext.createAnalyser()
  // mic._mediaStream._nativeAudioNode.connect(analyserNode)
  //
  // const pcmData = new Float32Array(analyserNode.fftSize)
  // const onFrame = () => {
  //   analyserNode.getFloatTimeDomainData(pcmData)
  //   let sumSquares = 0.0
  //   for (const amplitude of pcmData) { sumSquares += amplitude * amplitude }
  //   console.log(Math.sqrt(sumSquares / pcmData.length))
  //   window.requestAnimationFrame(onFrame)
  // }
  // window.requestAnimationFrame(onFrame)
})

inputSelect.addEventListener('change', ({ target: { value } }) => {
  mic.close().open(value)
})

let recording

const pad4 = document.querySelector('.js-pad-4')

async function record() {
  await mic.close().open(inputSelect.value)
  mediaRecorder.start()
  console.log('mediaRecorder.state', mediaRecorder.state)
}

async function stopRecording() {
  console.log('stopRecording#mediaRecorder.state', mediaRecorder.state)
  recording = await mediaRecorder.stop()
  const recordingBlob = URL.createObjectURL(recording)
  console.log('blob: ', recordingBlob)
  return recordingBlob
}

async function stopRecordingAndAssignToSampler(sampler) {
  const recordingBlob = await stopRecording()
  userBuffer.load(recordingBlob).then(() => console.log(`loaded blob: ${recordingBlob}`))
}

function assignToUserSampler() {
  stopRecordingAndAssignToSampler(userSampler)
}

pad4.addEventListener('touchstart', preventDefaultThen(record))
pad4.addEventListener('mousedown', preventDefaultThen(record))
pad4.addEventListener('touchend', preventDefaultThen(assignToUserSampler))
pad4.addEventListener('mouseup', preventDefaultThen(assignToUserSampler))

// const meter = new Tone.Meter()
// const mic = new Tone.UserMedia().connect(meter)
//
// mic.open().then(() => {
//   // promise resolves when input is available
//   console.log('mic open')
//   // print the incoming mic levels in decibels
//   setInterval(() => console.log(meter.getValue()), 100)
// }).catch(e => {
//   // promise is rejected when the user doesn't have or allow mic access
//   console.log('mic not open')
// })
