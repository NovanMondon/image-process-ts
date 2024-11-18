import { ImageProcessUtility, ImageProcessUtilityProps, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process012({ tImage, setResultURL }: ImageProcessUtilityProps) {
    const process = ImageProcessUtility({ tImage, setResultURL }, (aImage: ProcessedImage) => {
        const tKernelSize = 3
        const tKernelOffset = -1
        const tKernel = AM.div2D([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ], 3)
        const tPadding = [0, 0, 0]

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
                aImage.data[x][y] = tFiltered
            }
        }

        return aImage
    })

    return (
        <button onClick={process}>モーションフィルタ</button>
    )
}
