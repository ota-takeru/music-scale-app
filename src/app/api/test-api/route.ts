import { NextRequest, NextResponse } from 'next/server'
import { fetchKey, fetchChordsWithName } from '../../../api'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing API endpoints...')

    // スケールデータの取得テスト
    console.log('Testing fetchKey (C major)...')
    const scaleResponse = await fetchKey('C', 'major')
    console.log('Scale response:', scaleResponse)
    const scaleData = scaleResponse.data || []

    // コードデータの取得テスト
    console.log('Testing fetchChordsWithName (C major)...')
    const chordResponse = await fetchChordsWithName('C', 'major')
    console.log('Chord response:', chordResponse)
    const chordData = chordResponse.data || []

    return NextResponse.json({
      status: 'success',
      tests: {
        scale: {
          query: { key: 'C', scale: 'major' },
          apiSuccess: scaleResponse.success,
          error: scaleResponse.error,
          result: scaleData,
          count: scaleData.length,
          hasData: scaleData.length > 0,
          sampleData: scaleData[0] || null,
        },
        chord: {
          query: { root: 'C', type: 'major' },
          apiSuccess: chordResponse.success,
          error: chordResponse.error,
          result: chordData,
          count: chordData.length,
          hasData: chordData.length > 0,
          sampleData: chordData[0] || null,
          noteAnalysis: chordData[0]
            ? {
                allKeys: Object.keys(chordData[0]),
                noteKeys: Object.keys(chordData[0]).slice(2),
                noteValues: Object.values(chordData[0]).slice(2),
                trueNotes: Object.keys(chordData[0])
                  .slice(2)
                  .filter(
                    (key, index) => Object.values(chordData[0]).slice(2)[index]
                  ),
                allNotesAreFalse: Object.values(chordData[0])
                  .slice(2)
                  .every((val) => val === false),
              }
            : null,
        },
      },
    })
  } catch (error) {
    console.error('API test error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json(
      {
        status: 'error',
        error: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    )
  }
}
