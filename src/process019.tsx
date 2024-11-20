import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process019({ tImage, setResult }: ImageProcessUtilityProps) {
    const process = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tKernelSize = 5
        const tKernelOffset = -2
        const tPadding = [0, 0, 0]
        const filter = (aImage: ProcessedImage, aKernel: number[][]) => {
            const tResultData = newImageData(aImage.width, aImage.height)
            for (let x = 0; x < aImage.width; x++) {
                for (let y = 0; y < aImage.height; y++) {
                    let tFiltered = 0
                    for (let tKernelX = 0; tKernelX < tKernelSize; tKernelX++) {
                        for (let tKernelY = 0; tKernelY < tKernelSize; tKernelY++) {
                            const tSourceX = x + tKernelX + tKernelOffset
                            const tSourceY = y + tKernelY + tKernelOffset
                            if (tSourceX < 0 || tSourceX >= aImage.width || tSourceY < 0 || tSourceY >= aImage.height) {
                                // 画像の外側の場合はパディングを使う
                                const tGray = tPadding[0] * 0.2126 + tPadding[1] * 0.7152 + tPadding[2] * 0.0722
                                tFiltered += tGray * aKernel[tKernelX][tKernelY]
                            } else {
                                const tRGB = aImage.data[tSourceX][tSourceY]
                                const tGray = tRGB[0] * 0.2126 + tRGB[1] * 0.7152 + tRGB[2] * 0.0722
                                tFiltered += tGray * aKernel[tKernelX][tKernelY]
                            }
                        }
                    }
                    tResultData[x][y] = [tFiltered, tFiltered, tFiltered]
                }
            }
            return tResultData
        }

        let tKernel = AM.new(tKernelSize, tKernelSize, 0)
        const tSigma = 3
        let tSum = 0
        for (let x = 0; x < tKernelSize; x++) {
            for (let y = 0; y < tKernelSize; y++) {
                const tKernelX = x + tKernelOffset
                const tKernelY = y + tKernelOffset
                tKernel[x][y] = (tKernelX**2 + tKernelY**2 - tSigma**2) / (2 * Math.PI * tSigma**6) * Math.exp(-(tKernelX**2 + tKernelY**2) / (2 * tSigma**2))
                tSum += tKernel[x][y]
            }
        }
        tKernel = AM.div2D(tKernel, tSum)

        const tResultData = filter(aImage, tKernel)
        const aResultImage = { width: aImage.width, height: aImage.height, data: tResultData }
        return aResultImage
    })

    return (
        <button onClick={process}>LoGフィルタ</button>
    )
}
