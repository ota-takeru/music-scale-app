export const useReset = (
  finaldata,
  setFinaldata,
  finalchord,
  setFinalchord,
  primaryKey,
  setPrimaryKey
) => {
  let data = {}
  if (finaldata) {
    const { key: key, scale: scale, ...rest } = finaldata
    const newFinaldata = Object.fromEntries(
      Object.entries(rest).map(([key, value]) => [key, false])
    )
    data = { key: key, scale: scale, ...newFinaldata }
  } else if (finalchord) {
    const { root: root, type: type, ...rest2 } = finalchord
    const newFinalchord = Object.fromEntries(
      Object.entries(rest2).map(([key, value]) => [key, false])
    )
    data = { root: root, type: type, ...newFinalchord }
  }
  setFinaldata ? setFinaldata(data) : null
  setFinalchord ? setFinalchord(data) : null
  primaryKey ? setPrimaryKey(primaryKey.fill('false')) : null
}
