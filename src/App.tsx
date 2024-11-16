/** @jsxImportSource @emotion/react */
import { useState } from 'react'
import { css } from '@emotion/react'
import { Process001 } from './process001'
import { Process002 } from './process002'
import { Process003 } from './process003'
import { Process004 } from './process004'

function App() {
  const [tImage, setImage] = useState<HTMLImageElement | null>(null)
  const [tResultURL, setResultURL] = useState<string | null>(null)

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

  const tVerticalCSS = css({
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  })

  const tHorizontalCSS = css({
    display: 'flex',
    gap: 8,
  })

  return (
    <div>
      <h1>Image Process TS</h1>
      <div css={css(tHorizontalCSS)} >

        <aside css={css(tBorderLineCSS, tVerticalCSS, { padding: 8 })} >
          <Process001 tImage={tImage} setResultURL={setResultURL} />
          <Process002 tImage={tImage} setResultURL={setResultURL} />
          <Process003 tImage={tImage} setResultURL={setResultURL} />
          <Process004 tImage={tImage} setResultURL={setResultURL} />
        </aside>

        <main css={css(tVerticalCSS)} >
          <input type="file" onChange={handleFileChange} />
          <div css={css(tHorizontalCSS)} >
            <div css={css(tImageViewCSS, tBorderLineCSS)}
              onDrop={handleDrop}
              onDragOver={(aEvent) => aEvent.preventDefault()} // ドロップを許可
            >
              {tImage && <img src={tImage.src} alt="Original" />}
            </div>
            <div css={css(tImageViewCSS, tBorderLineCSS)} >
              {tResultURL && <img src={tResultURL} alt="Result" />}
            </div>
          </div>
        </main>

      </div>
    </div >
  )
}

export default App
