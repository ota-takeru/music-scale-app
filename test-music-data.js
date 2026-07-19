// Node.js環境でのテスト
const { isScaleData, isChordData } = require('./src/utils/musicDataHelpers')

// テストデータ
const sampleScaleData = {
  key: 'C',
  scale: 'major',
  a: false,
  a_sharp: false,
  b: false,
  c: true,
  c_sharp: false,
  d: true,
  d_sharp: false,
  e: true,
  f: true,
  f_sharp: false,
  g: true,
  g_sharp: false,
}

const sampleChordData = {
  root: 'C',
  type: 'major',
  a: false,
  a_sharp: false,
  b: false,
  c: true,
  c_sharp: false,
  d: false,
  d_sharp: false,
  e: true,
  f: false,
  f_sharp: false,
  g: true,
  g_sharp: false,
}

const invalidData = {
  a: false,
  a_sharp: false,
  b: false,
  c: true,
  c_sharp: false,
  d: true,
  d_sharp: false,
  e: true,
  f: true,
  f_sharp: false,
  g: true,
  g_sharp: false,
  // key/scale または root/type がない
}

console.log('🧪 isScaleData テスト')
console.log('sampleScaleData:', isScaleData(sampleScaleData))
console.log('sampleChordData:', isScaleData(sampleChordData))
console.log('invalidData:', isScaleData(invalidData))

console.log('\n🧪 isChordData テスト')
console.log('sampleScaleData:', isChordData(sampleScaleData))
console.log('sampleChordData:', isChordData(sampleChordData))
console.log('invalidData:', isChordData(invalidData))

console.log('\n📋 データ構造確認')
console.log('sampleScaleDataのキー:', Object.keys(sampleScaleData))
console.log('key in sampleScaleData:', 'key' in sampleScaleData)
console.log('scale in sampleScaleData:', 'scale' in sampleScaleData)

console.log('\nsampleChordDataのキー:', Object.keys(sampleChordData))
console.log('root in sampleChordData:', 'root' in sampleChordData)
console.log('type in sampleChordData:', 'type' in sampleChordData)

console.log('\ninvalidDataのキー:', Object.keys(invalidData))
console.log('key in invalidData:', 'key' in invalidData)
console.log('scale in invalidData:', 'scale' in invalidData)
