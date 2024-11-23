import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process011({ tImage, setResult }: ImageProcessUtilityProps) {
    const smoothing = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tKernelSize = 3
        const tKernelOffset = -1
        const tPadding = [0, 0, 0]
        const tResultData = newImageData(aImage.width, aImage.height)

        for (let x = 0; x < aImage.width; x++) {
            for (let y = 0; y < aImage.height; y++) {
                let tSum = [0, 0, 0]
                for (let tKernelX = 0; tKernelX < tKernelSize; tKernelX++) {
                    for (let tKernelY = 0; tKernelY < tKernelSize; tKernelY++) {
                        const tSourceX = x + tKernelX + tKernelOffset
                        const tSourceY = y + tKernelY + tKernelOffset
                        if (tSourceX < 0 || tSourceX >= aImage.width || tSourceY < 0 || tSourceY >= aImage.height) {
                            // 画像の外側の場合はパディングを使う
                            tSum = AM.add(tSum, tPadding)
                        } else {
                            const tRGB = aImage.data[tSourceY][tSourceX]
                            tSum = AM.add(tSum, tRGB)
                        }
                    }
                }

                const tAverage = AM.div(tSum, tKernelSize * tKernelSize)

                tResultData[y][x] = tAverage
            }
        }

        aImage.data = tResultData
        return aImage
    })

    return (
        <button onClick={smoothing}>平滑化フィルタ</button>
    )
}
