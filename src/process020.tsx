import { ResultState } from "./App"
import { CalcImage, ImageProcessUtilityProps, LoadImageData, ProcessedImage } from "./utility"

export function Process020({ tImage, setResult }: ImageProcessUtilityProps) {
    const process = () => {
        if (!tImage) return

        // 画像データを取得
        const tData = LoadImageData(tImage)
        const tProcessedImage: ProcessedImage = CalcImage(tData, tImage.width, tImage.height)

        // 画像データを処理
        const tHistogramData = Array(256).fill(0)
        for (let x = 0; x < tProcessedImage.width; x++) {
            for (let y = 0; y < tProcessedImage.height; y++) {
                const tRGB = tProcessedImage.data[y][x]
                tRGB.forEach((aValue) => {
                    tHistogramData[aValue]++
                })
            }
        }

        // ヒストグラム表示
        let tResult = new ResultState()
        tResult.histogramProp = { values: tHistogramData }
        setResult(tResult)
    }

    return (
        <button onClick={process}>ヒストグラム表示</button>
    )
}
