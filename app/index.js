/* global Tone */
import './Tone.js'

const kickUrl = 'samples/DX Bass 8 Med.wav'

const kickSampler = new Tone.Sampler({
  urls: { A1: 'samples/DX Bass 8 Med.wav' },
}).toDestination()
const clapSampler = new Tone.Sampler({
  urls: { A1: 'samples/DX Clap 16.wav' },
}).toDestination()
// const hihatClosedSampler = new Tone.Sampler('samples/DX Hi-Hat Closed 14.wav').toDestination()

const kick = document.querySelector('.js-pad-kick')
const clap = document.querySelector('.js-pad-clap')

function startPlayer(player) {
  // player.releaseAll(0)
  player.triggerAttack('A1', 0)
}

function play(player) {
  return (e) => {
    e.preventDefault()
    if (Tone.context.state !== 'running') {
      Tone.start()
        .then(() => startPlayer(player))
    } else {
      startPlayer(player)
    }
  }
}

kick.addEventListener('touchstart', play(kickSampler))
kick.addEventListener('mousedown', play(kickSampler))
clap.addEventListener('touchstart', play(clapSampler))
clap.addEventListener('mousedown', play(clapSampler))
