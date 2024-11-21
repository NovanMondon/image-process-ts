import { ResultState } from "./App"
import { CalcImage, CalcResultData, GenerateImageURL, ImageProcessUtilityProps, LoadImageData, newImageData, ProcessedImage } from "./utility"

export function Process021({ tImage, setResult }: ImageProcessUtilityProps) {
    const process = () => {
        if (!tImage) return

        // 画像データを取得
        const tData = LoadImageData(tImage)
        const tProcessedImage: ProcessedImage = CalcImage(tData, tImage.width, tImage.height)

        // 画像データを処理
        let tMin = 255
        let tMax = 0
        for (let x = 0; x < tProcessedImage.width; x++) {
            for (let y = 0; y < tProcessedImage.height; y++) {
                const tRGB = tProcessedImage.data[x][y]
                tMin = Math.min(tMin, tRGB[0], tRGB[1], tRGB[2])
                tMax = Math.max(tMax, tRGB[0], tRGB[1], tRGB[2])
            }
        }
        const tUpper = 255
        const tLower = 0
        const tCoefficient = (tUpper - tLower) / (tMax - tMin)

        const tResultData = newImageData(tProcessedImage.width, tProcessedImage.height)
        for (let x = 0; x < tProcessedImage.width; x++) {
            for (let y = 0; y < tProcessedImage.height; y++) {
                const tRGB = tProcessedImage.data[x][y]
                const tRGB_ = tRGB.map((aValue) => {
                    if (aValue < tMin) {
                        return tLower
                    } else if (aValue > tMax) {
                        return tUpper
                    } else {
                        return Math.round(tCoefficient * (aValue - tMin) + tLower)
                    }
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
        <button onClick={process}>ヒストグラム正規化</button>
    )
}
