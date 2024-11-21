import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process027({ tImage, setResult }: ImageProcessUtilityProps) {
    const process = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tScale = 1.5
        const tWidth_ = Math.round(aImage.width * tScale)
        const tHeight_ = Math.round(aImage.height * tScale)
        const tImageData_ = newImageData(tWidth_, tHeight_)
        for (let x = 0; x < tWidth_; x++) {
            for (let y = 0; y < tHeight_; y++) {
                const tSourceX = Math.floor(x / tScale)
                const tSourceY = Math.floor(y / tScale)

                const tStart = -1
                const tEnd = 2
                let tRGBSum = [0, 0, 0]
                let tHSum = 0
                for (let x_ = tStart; x_ <= tEnd; x_++) {
                    for (let y_ = tStart; y_ <= tEnd; y_++) {
                        const tX = tSourceX + x_
                        const tY = tSourceY + y_
                        if (tX < 0 || tX >= aImage.width || tY < 0 || tY >= aImage.height) {
                            continue
                        }
                        const tRGB = aImage.data[tX][tY]
                        const tDx = Math.abs(x / tScale - tX)
                        const tDy = Math.abs(y / tScale - tY)
                        const tA = -1
                        const tH = (tT: number) => {
                            if (tT <= 1) {
                                return (tA + 2) * tT ** 3 - (tA + 3) * tT ** 2 + 1
                            } else if (tT <= 2) {
                                return tA * tT ** 3 - 5 * tA * tT ** 2 + 8 * tA * tT - 4 * tA
                            } else {
                                return 0
                            }
                        }
                        const tHx = tH(tDx)
                        const tHy = tH(tDy)
                        tRGBSum = AM.add(tRGBSum, AM.mul(tRGB, tHx * tHy))
                        tHSum += tHx * tHy
                    }
                }
                tRGBSum = AM.div(tRGBSum, tHSum)
                tImageData_[x][y] = tRGBSum
            }
        }

        return { width: tWidth_, height: tHeight_, data: tImageData_ }
    })

    return (
        <button onClick={process}>バイキュービック補間</button>
    )
}
