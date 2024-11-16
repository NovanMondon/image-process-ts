import { useState } from 'react'

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

  // RGBをBGRに変換
  const rgb2bgr = () => {
    if (!tImage) return

    // Canvasを作成
    const tCanvas = document.createElement('canvas')
    const tContext = tCanvas.getContext('2d')
    if (!tContext) return
    tCanvas.width = tImage.width
    tCanvas.height = tImage.height

    // 画像をCanvasに描画
    tContext.drawImage(tImage, 0, 0)

    // 画像データを取得
    const tImageData = tContext.getImageData(0, 0, tImage.width, tImage.height)
    const tData = tImageData.data

    // RGBをBGRに変換
    for (let i = 0; i < tData.length; i += 4) {
      const tR = tData[i]
      const tG = tData[i + 1]
      const tB = tData[i + 2]
      tData[i] = tB
      tData[i + 1] = tG
      tData[i + 2] = tR
    }

    // 画像データをCanvasに描画
    tContext.putImageData(tImageData, 0, 0)

    // 画像を表示
    setResultURL(tCanvas.toDataURL())
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={rgb2bgr}>RGB to BGR</button>
      <div
        onDrop={handleDrop}
        onDragOver={(aEvent) => aEvent.preventDefault()} // ドロップを許可
        style={{ width: 256, height: 256, border: '1px solid black' }}
      >
        {tImage && <img src={tImage.src} alt="Original" />}
      </div>
      <div
        style={{ width: 256, height: 256, border: '1px solid black' }}
      >
        {tResultURL && <img src={tResultURL} alt="Result" />}
      </div>
    </div>
  )
}

export default App
