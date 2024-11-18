import { ImageProcessUtility, ImageProcessUtilityProps, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process010({ tImage, setResultURL }: ImageProcessUtilityProps) {
    const median = ImageProcessUtility({ tImage, setResultURL }, (aImage: ProcessedImage) => {
        const tKernelSize = 3
        const tKernelOffset = -1
        const tKernel = AM.div2D([
            [1, 2, 1],
            [2, 4, 2],
            [1, 2, 1]
        ], 16)
        const tPadding = [0, 0, 0]

        for (let x = 0; x < aImage.width; x++) {
            for (let y = 0; y < aImage.height; y++) {
                let tRGBs: number[][] = [[], [], []]
                for (let tKernelX = 0; tKernelX < tKernelSize; tKernelX++) {
                    for (let tKernelY = 0; tKernelY < tKernelSize; tKernelY++) {
                        const tSourceX = x + tKernelX + tKernelOffset
                        const tSourceY = y + tKernelY + tKernelOffset
                        if (tSourceX < 0 || tSourceX >= aImage.width || tSourceY < 0 || tSourceY >= aImage.height) {
                            // 画像の外側の場合はパディングを使う
                            tRGBs.map((tRGB_, i) => tRGB_.push(tPadding[i]))
                        } else {
                            const tRGB = aImage.data[tSourceX][tSourceY]
                            tRGBs.map((tRGB_, i) => tRGB_.push(tRGB[i]))
                        }
                    }
                }
                const tMedian = tRGBs.map(tRGB => AM.sMedian(tRGB))

                aImage.data[x][y] = tMedian
            }
        }

        return aImage
    })

    return (
        <button onClick={median}>メディアンフィルタ</button>
    )
}
