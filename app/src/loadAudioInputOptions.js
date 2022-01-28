export const inputSelect = document.querySelector('#audio-input-select')

function createOptionTag({ deviceId, label }) {
  const tag = document.createElement('option')
  tag.value = deviceId
  tag.textContent = label
  return tag
}

Tone.UserMedia.enumerateDevices().then((devices) => {
  console.log('devices: ', devices)
  while (inputSelect.firstChild) {
    inputSelect.removeChild(inputSelect.lastChild)
  }

  devices.forEach((device) => {
    const optionTag = createOptionTag(device)
    inputSelect.appendChild(optionTag)
  })
})
