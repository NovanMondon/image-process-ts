import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process026({ tImage, setResult }: ImageProcessUtilityProps) {
    const process = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tScale = 1.5
        const tWidth_ = Math.round(aImage.width * tScale)
        const tHeight_ = Math.round(aImage.height * tScale)
        const tImageData_ = newImageData(tWidth_, tHeight_)
        for (let x = 0; x < tWidth_; x++) {
            for (let y = 0; y < tHeight_; y++) {
                const tSourceX = Math.floor(x / tScale)
                const tSourceY = Math.floor(y / tScale)
                const tDx = x / tScale - tSourceX
                const tDy = y / tScale - tSourceY
                const tX0Y0 = aImage.data[tSourceX][tSourceY]
                const tX1Y0 = tSourceX + 1 < aImage.width ? aImage.data[tSourceX + 1][tSourceY] : tX0Y0
                const tX0Y1 = tSourceY + 1 < aImage.height ? aImage.data[tSourceX][tSourceY + 1] : tX0Y0
                const tX1Y1 = tSourceX + 1 < aImage.width && tSourceY + 1 < aImage.height ? aImage.data[tSourceX + 1][tSourceY + 1] : tX0Y0

                const tRGB_ = AM.addAll(
                    AM.mul(tX0Y0, (1 - tDx) * (1 - tDy)),
                    AM.mul(tX1Y0, tDx * (1 - tDy)),
                    AM.mul(tX0Y1, (1 - tDx) * tDy),
                    AM.mul(tX1Y1, tDx * tDy)
                )
                tImageData_[x][y] = tRGB_
            }
        }

        return { width: tWidth_, height: tHeight_, data: tImageData_ }
    })

    return (
        <button onClick={process}>バイリニア補間</button>
    )
}
