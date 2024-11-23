import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"

export function Process013({ tImage, setResult }: ImageProcessUtilityProps) {
    const process = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tKernelSize = 3
        const tKernelOffset = -1
        const tPadding = [0, 0, 0]
        const tResultData = newImageData(aImage.width, aImage.height)

        for (let x = 0; x < aImage.width; x++) {
            for (let y = 0; y < aImage.height; y++) {
                let tMax = 0
                let tMin = 255
                for (let tKernelX = 0; tKernelX < tKernelSize; tKernelX++) {
                    for (let tKernelY = 0; tKernelY < tKernelSize; tKernelY++) {
                        const tSourceX = x + tKernelX + tKernelOffset
                        const tSourceY = y + tKernelY + tKernelOffset
                        if (tSourceX < 0 || tSourceX >= aImage.width || tSourceY < 0 || tSourceY >= aImage.height) {
                            // 画像の外側の場合はパディングを使う
                            const tGray = tPadding[0] * 0.2126 + tPadding[1] * 0.7152 + tPadding[2] * 0.0722
                            tMax = Math.max(tMax, tGray)
                            tMin = Math.min(tMin, tGray)
                        } else {
                            const tRGB = aImage.data[tSourceY][tSourceX]
                            const tGray = tRGB[0] * 0.2126 + tRGB[1] * 0.7152 + tRGB[2] * 0.0722
                            tMax = Math.max(tMax, tGray)
                            tMin = Math.min(tMin, tGray)
                        }
                    }
                }
                const tMaxMinusMin = tMax - tMin
                tResultData[y][x] = [tMaxMinusMin, tMaxMinusMin, tMaxMinusMin]
            }
        }

        aImage.data = tResultData
        return aImage
    })

    return (
        <button onClick={process}>MAX-MINフィルタ</button>
    )
}
