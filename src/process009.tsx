import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process009({ tImage, setResult }: ImageProcessUtilityProps) {
    const gaussian = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tKernelSize = 3
        const tKernelOffset = -1
        const tKernel = AM.div2D([
            [1, 2, 1],
            [2, 4, 2],
            [1, 2, 1]
        ], 16)
        const tPadding = [0, 0, 0]
        const tResultData = newImageData(aImage.width, aImage.height)

        for (let x = 0; x < aImage.width; x++) {
            for (let y = 0; y < aImage.height; y++) {
                let tFiltered = [0, 0, 0]
                for (let tKernelX = 0; tKernelX < tKernelSize; tKernelX++) {
                    for (let tKernelY = 0; tKernelY < tKernelSize; tKernelY++) {
                        const tSourceX = x + tKernelX + tKernelOffset
                        const tSourceY = y + tKernelY + tKernelOffset
                        if (tSourceX < 0 || tSourceX >= aImage.width || tSourceY < 0 || tSourceY >= aImage.height) {
                            // 画像の外側の場合はパディングを使う
                            tFiltered = AM.add(tFiltered, AM.mul(tPadding, tKernel[tKernelX][tKernelY]))
                        } else {
                            const tRGB = aImage.data[tSourceX][tSourceY]
                            tFiltered = AM.add(tFiltered, AM.mul(tRGB, tKernel[tKernelX][tKernelY]))
                        }
                    }
                }
                tResultData[x][y] = tFiltered
            }
        }

        aImage.data = tResultData
        return aImage
    })

    return (
        <button onClick={gaussian}>ガウシアンフィルタ</button>
    )
}
