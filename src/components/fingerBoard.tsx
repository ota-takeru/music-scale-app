import React from 'react'
import String from './string'
import { useReset } from '../hooks/useReset'
import ResetButton from './resetButton'
import type { FingerboardProps } from '../types'

const Fingerboard: React.FC<FingerboardProps> = ({
  finaldata,
  setFinaldata,
}) => {
  const { resetData } = useReset({
    musicData: finaldata,
    setMusicData: setFinaldata,
  })

  const handleReset = () => {
    resetData()
  }
  return (
    <div className="fretboard-container">
      <div className="fretboard-main">
        <div className="fretboard-inner">
          <div className="fret-numbers">
            <div className="flex flex-1 border-r-[10px] border-transparent border-black"></div>
            {[
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
            ].map((value, index) => (
              <div key={`fret-${index}`} className="fret-number">
                <span className="max-sm:-rotate-90">
                  {['3', '5', '7', '9', '12'].includes(value) ? value : ''}
                </span>
              </div>
            ))}
          </div>
          <div className="strings-container">
            <String
              key="string-e-high"
              finaldata={finaldata}
              setFinaldata={setFinaldata}
              n={7}
            />
            <String
              key="string-b"
              finaldata={finaldata}
              setFinaldata={setFinaldata}
              n={2}
            />
            <String
              key="string-g"
              finaldata={finaldata}
              setFinaldata={setFinaldata}
              n={10}
            />
            <String
              key="string-d"
              finaldata={finaldata}
              setFinaldata={setFinaldata}
              n={5}
            />
            <String
              key="string-a"
              finaldata={finaldata}
              setFinaldata={setFinaldata}
              n={0}
            />
            <String
              key="string-e-low"
              finaldata={finaldata}
              setFinaldata={setFinaldata}
              n={7}
            />
          </div>
        </div>
      </div>
      <ResetButton reset={handleReset} />
    </div>
  )
}

export default Fingerboard
