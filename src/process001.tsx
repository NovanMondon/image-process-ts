interface Process001Props {
    tImage: HTMLImageElement | null
    setResultURL: (aURL: string) => void
}

export function Process001({ tImage, setResultURL }: Process001Props) {
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
        <button onClick={rgb2bgr}>RGB to BGR</button>
    )
}
