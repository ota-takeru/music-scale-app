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
  const { data, error } = await query
  return data || {}
}

export const fetchChords = async (array) => {
  if (!array || array.length === 0) {
    return []
  }
  const query = array.map(value => `${value}.eq.true`).join(',')
  const { data } = await supabase.from('chords').select('*').or(query)
  return data
}

export const fetchChordsWithNote = async (obj) => {
  let query = supabase.from('chords').select('*')
  const [, value] = Object.entries(obj)[1];
  Object.entries(obj).forEach(([key, value]) => {
    if (key !== 'root' && key !== 'type' && value === true) {
      query = query.eq(key, true);
    }
  });
  const { data, error } = await query;
  return data;
}


export const fetchChordsWithName = async (root, type) => {
  const { data } = await supabase
    .from('chords')
    .select('*')
    .eq('root', root)
    .eq('type', type)
  return data
}