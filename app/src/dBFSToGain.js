export function dBFSToGain(dbfs) {
  return Math.pow(10, dbfs / 20)
}

export function gainToDBFS(gain) {
  return 20 * Math.log10(gain)
}
