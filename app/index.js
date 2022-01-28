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

const userSampler = new Tone.Sampler({
  release: 0.2,
}).toDestination()

window.kickSampler = kickSampler
window.userSampler = userSampler

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

console.log('kickSampler buffer: ', kickSampler._buffers._buffers.get('33')._buffer)

kick.addEventListener('touchstart', play(kickSampler))
kick.addEventListener('mousedown', play(kickSampler))
clap.addEventListener('touchstart', play(clapSampler))
clap.addEventListener('mousedown', play(clapSampler))
userPad.addEventListener('touchstart', play(userSampler))
userPad.addEventListener('mousedown', play(userSampler))
userPad.addEventListener('touchend', stop(userSampler))
userPad.addEventListener('mouseup', stop(userSampler))

document.querySelector('.js-start').addEventListener('click', function start() {
  Tone.start()
})

const mediaRecorder = new Tone.Recorder()
const mic = new Tone.UserMedia()
mic.connect(mediaRecorder)

let recording

const pad4 = document.querySelector('.js-pad-4')

async function record() {
  await mic.open(inputSelect.value)
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
  sampler.add('A1', recordingBlob, () => console.log('blob url loaded'))
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
