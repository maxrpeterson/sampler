/* global Tone */
import './Tone.js'

const kickPlayer = new Tone.Player('samples/DX Bass 8 Med.wav').toMaster()
const clapPlayer = new Tone.Player('samples/DX Clap 16.wav').toMaster()
console.log(kickPlayer)

const kick = document.querySelector('.js-pad-kick')
const clap = document.querySelector('.js-pad-clap')

console.log(kick)

function startPlayer(player) {
  if (player.state === 'started') {
    player.restart()
  } else {
    player.start()
  }
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

kick.addEventListener('touchstart', play(kickPlayer))
kick.addEventListener('mousedown', play(kickPlayer))
clap.addEventListener('touchstart', play(clapPlayer))
clap.addEventListener('mousedown', play(clapPlayer))
