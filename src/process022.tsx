import { ResultState } from "./App"
import { CalcImage, CalcResultData, GenerateImageURL, ImageProcessUtilityProps, LoadImageData, newImageData, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process022({ tImage, setResult }: ImageProcessUtilityProps) {
    const process = () => {
        if (!tImage) return

        // 画像データを取得
        const tData = LoadImageData(tImage)
        const tProcessedImage: ProcessedImage = CalcImage(tData, tImage.width, tImage.height)

        // 画像データを処理
        let tAllValues = []
        for (let x = 0; x < tProcessedImage.width; x++) {
            for (let y = 0; y < tProcessedImage.height; y++) {
                const tRGB = tProcessedImage.data[x][y]
                tAllValues.push(tRGB[0], tRGB[1], tRGB[2])
            }
        }
        const tMean = AM.sAverage(tAllValues)
        const tStd = AM.sStandardDeviation(tAllValues, tMean)
        const tM0 = 128
        const tS0 = 52

        const tResultData = newImageData(tProcessedImage.width, tProcessedImage.height)
        for (let x = 0; x < tProcessedImage.width; x++) {
            for (let y = 0; y < tProcessedImage.height; y++) {
                const tRGB = tProcessedImage.data[x][y]
                const tRGB_ = tRGB.map((aValue) => {
                    const tValue = Math.round(tS0 / tStd * (aValue - tMean) + tM0)
                    return Math.max(0, Math.min(tValue, 255))
                })
                tResultData[x][y] = tRGB_
            }
        }

        const tHistogramData = Array(256).fill(0)
        for (let x = 0; x < tProcessedImage.width; x++) {
            for (let y = 0; y < tProcessedImage.height; y++) {
                const tRGB = tResultData[x][y]
                tRGB.forEach((aValue) => {
                    tHistogramData[aValue]++
                })
            }
        }

        let tResult = new ResultState()
        tResult.histogramProp = { values: tHistogramData }
        const tResultImageData = CalcResultData({ width: tProcessedImage.width, height: tProcessedImage.height, data: tResultData })
        tResult.imageURL.push(GenerateImageURL(tResultImageData, tProcessedImage.width, tProcessedImage.height))
        setResult(tResult)
    }

    return (
        <button onClick={process}>ヒストグラム操作</button>
    )
}
