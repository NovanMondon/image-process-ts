/** @jsxImportSource @emotion/react */
import { useState } from 'react'
import { css } from '@emotion/react'
import { Process001 } from './process001'
import { Process002 } from './process002'
import { Process003 } from './process003'
import { Process004 } from './process004'
import { Process005 } from './process005'
import { Process006 } from './process006'
import { Process007 } from './process007'
import { Process008 } from './process008'
import { Process009 } from './process009'
import { Process010 } from './process010'
import { Process011 } from './process011'
import { Process012 } from './process012'
import { Process013 } from './process013'
import { Process014 } from './process014'
import { Process015 } from './process015'
import { Process016 } from './process016'
import { Process017 } from './process017'
import { Process018 } from './process018'
import { Process019 } from './process019'
import Histogram, { HistogramProp } from './components/histogram'
import { Process020 } from './process020'
import { Process021 } from './process021'
import { Process022 } from './process022'
import { Process023 } from './process023'
import { Process024 } from './process024'
import { Process025 } from './process025'
import { Process026 } from './process026'
import { Process027 } from './process027'
import { Process028 } from './process028'
import { Process029 } from './process029'
import { Process030 } from './process030'
import { Process031 } from './process031'
import { Process032 } from './process032'
import { Process033 } from './process033'
import { Process034 } from './process034'
import { Process035 } from './process035'
import { Process036 } from './process036'
import { Process037 } from './process037'
import { Process038 } from './process038'

export class ResultState {
  imageURL: string[]
  histogramProp: HistogramProp | null

  constructor() {
    this.imageURL = []
    this.histogramProp = null
  }
}

function App() {
  const [tImage, setImage] = useState<HTMLImageElement | null>(null)
  const [tResult, setResult] = useState<ResultState>(new ResultState())

  // ファイルを選択して画像を読み込む
  const handleFileChange = (aEvent: React.ChangeEvent<HTMLInputElement>) => {
    const tFile = aEvent.target.files?.[0]
    if (!tFile) return
    const tImage = new Image()
    tImage.src = URL.createObjectURL(tFile)
    tImage.onload = () => { setImage(tImage) }
  }

  // ファイルをドロップして画像を読み込む
  const handleDrop = (aEvent: React.DragEvent<HTMLDivElement>) => {
    aEvent.preventDefault()
    const tFile = aEvent.dataTransfer.files?.[0]
    if (!tFile) return
    const tImage = new Image()
    tImage.src = URL.createObjectURL(tFile)
    tImage.onload = () => { setImage(tImage) }
  }



  const tBorderLineCSS = css({
    border: '1px solid black',
  })

  const tImageViewCSS = css({
    width: 512,
    height: 512,
    // 画像が大きい場合に縮小表示
    img: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
  })

  const tGraphViewCSS = css({
    width: 1024,
    height: 512,
  })

  const tVerticalCSS = css({
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  })

  const tHorizontalCSS = css({
    display: 'flex',
    gap: 8,
  })

  const tEnableNewLineCSS = css({
    flexWrap: 'wrap',
  })

  return (
    <div>
      <h1>Image Process TS</h1>
      <div css={css(tHorizontalCSS)} >
        <aside css={css(tBorderLineCSS, tVerticalCSS, { padding: 8, width: 160, flexShrink: 0, height: 720, overflow: "auto" })} >
          <Process001 tImage={tImage} setResult={setResult} />
          <Process002 tImage={tImage} setResult={setResult} />
          <Process003 tImage={tImage} setResult={setResult} />
          <Process004 tImage={tImage} setResult={setResult} />
          <Process005 tImage={tImage} setResult={setResult} />
          <Process006 tImage={tImage} setResult={setResult} />
          <Process007 tImage={tImage} setResult={setResult} />
          <Process008 tImage={tImage} setResult={setResult} />
          <Process009 tImage={tImage} setResult={setResult} />
          <Process010 tImage={tImage} setResult={setResult} />
          <Process011 tImage={tImage} setResult={setResult} />
          <Process012 tImage={tImage} setResult={setResult} />
          <Process013 tImage={tImage} setResult={setResult} />
          <Process014 tImage={tImage} setResult={setResult} />
          <Process015 tImage={tImage} setResult={setResult} />
          <Process016 tImage={tImage} setResult={setResult} />
          <Process017 tImage={tImage} setResult={setResult} />
          <Process018 tImage={tImage} setResult={setResult} />
          <Process019 tImage={tImage} setResult={setResult} />
          <Process020 tImage={tImage} setResult={setResult} />
          <Process021 tImage={tImage} setResult={setResult} />
          <Process022 tImage={tImage} setResult={setResult} />
          <Process023 tImage={tImage} setResult={setResult} />
          <Process024 tImage={tImage} setResult={setResult} />
          <Process025 tImage={tImage} setResult={setResult} />
          <Process026 tImage={tImage} setResult={setResult} />
          <Process027 tImage={tImage} setResult={setResult} />
          <Process028 tImage={tImage} setResult={setResult} />
          <Process029 tImage={tImage} setResult={setResult} />
          <Process030 tImage={tImage} setResult={setResult} />
          <Process031 tImage={tImage} setResult={setResult} />
          <Process032 tImage={tImage} setResult={setResult} />
          <Process033 tImage={tImage} setResult={setResult} />
          <Process034 tImage={tImage} setResult={setResult} />
          <Process035 tImage={tImage} setResult={setResult} />
          <Process036 tImage={tImage} setResult={setResult} />
          <Process037 tImage={tImage} setResult={setResult} />
          <Process038 tImage={tImage} setResult={setResult} />
        </aside>

        <main css={css(tVerticalCSS)} >
          <input type="file" onChange={handleFileChange} />
          <div css={css(tHorizontalCSS, tEnableNewLineCSS)} >
            <div css={css(tImageViewCSS, tBorderLineCSS)}
              onDrop={handleDrop}
              onDragOver={(aEvent) => aEvent.preventDefault()} // ドロップを許可
            >
              {tImage && <img src={tImage.src} alt="Original" />}
            </div>
            {tResult.imageURL.map((url, index) => (
              <div key={index} css={css(tImageViewCSS, tBorderLineCSS)} >
                <img src={url} alt={`Result ${index}`} />
              </div>
            ))}
            {tResult.histogramProp &&
              <div css={css(tGraphViewCSS, tBorderLineCSS)} >
                <Histogram prop={tResult.histogramProp} />
              </div>
            }
          </div>
        </main>

      </div>
    </div >
  )
}

export default App
