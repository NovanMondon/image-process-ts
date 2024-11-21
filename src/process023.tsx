import { ResultState } from "./App"
import { CalcImage, CalcResultData, GenerateImageURL, ImageProcessUtilityProps, LoadImageData, newImageData, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process023({ tImage, setResult }: ImageProcessUtilityProps) {
    const process = () => {
        if (!tImage) return

        // 画像データを取得
        const tData = LoadImageData(tImage)
        const tProcessedImage: ProcessedImage = CalcImage(tData, tImage.width, tImage.height)

        // 画像データを処理
        const tOldHistogramData = Array(256).fill(0)
        for (let x = 0; x < tProcessedImage.width; x++) {
            for (let y = 0; y < tProcessedImage.height; y++) {
                const tRGB = tProcessedImage.data[x][y]
                tRGB.forEach((aValue) => {
                    tOldHistogramData[aValue]++
                })
            }
        }
        const tS = tProcessedImage.width * tProcessedImage.height * 3
        const tValueRelation: number[] = Array(256).fill(0)
        const tMax = 255
        let tSum = 0
        for (let i = 0; i < 256; i++) {
            tSum += tOldHistogramData[i]
            tValueRelation[i] = Math.round(tMax / tS * tSum)
        }

        const tResultData = newImageData(tProcessedImage.width, tProcessedImage.height)
        for (let x = 0; x < tProcessedImage.width; x++) {
            for (let y = 0; y < tProcessedImage.height; y++) {
                const tRGB = tProcessedImage.data[x][y]
                const tRGB_ = tRGB.map((aValue) => {
                    return Math.round(tValueRelation[aValue])
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
        <button onClick={process}>ヒストグラム平坦化</button>
    )
}
