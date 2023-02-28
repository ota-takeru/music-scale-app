import supabase from '../utils/supabase'
import { useState } from 'react'

export const fetchKey = async (key, scale) => {
  const { data, error } = await supabase
    .from('key')
    .select('*')
    .eq('key', key)
    .eq('scale', scale)
  return data
}

export const fetchKeyWithNote = async (prevArray) => {
  const array = { ...prevArray }
  const keys = Object.keys(array) // キーの配列を取得
  const lastTwoKeys = keys.splice(0, 2) // 最後から２つのキーを取得

  const deleteKeys = (array, keys) => {
    const newArray = { ...array }
    keys.forEach((key) => {
      delete newArray[key] // オブジェクトからキーと値を削除
    })
    return newArray
  }

  const keyList = { ...deleteKeys(array, lastTwoKeys) }
  if (Object.values(keyList).every((v) => v !== true)) {
    // すべての値が"True"ではない場合(初期値)
    return
  }

  let query = supabase.from('key').select('*')
  Object.keys(keyList).forEach((key) => {
    if (keyList[key] === true) {
      query = query.eq(key, true)
    }
  })

  const { data: data, error } = await query
  if (data) {
    return data
  } else {
    return {}
  }
}
