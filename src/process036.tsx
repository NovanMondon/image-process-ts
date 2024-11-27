import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process036({ tImage, setResult }: ImageProcessUtilityProps) {
    const process = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tWidth_ = aImage.width
        const tHeight_ = aImage.height

        const tT = 8
        const tDiscreteCosineTransform = newImageData(tWidth_, tHeight_)
        for (let tYs = 0; tYs < tHeight_; tYs += tT) {
            for (let tXs = 0; tXs < tWidth_; tXs += tT) {
                console.log("離散コサイン変換 " + tYs + "行 " + tXs + "列");
                for (let v = 0; v < tT; v++) {
                    for (let u = 0; u < tT; u++) {
                        const tCu = (u === 0) ? 1 / Math.sqrt(2) : 1
                        const tCv = (v === 0) ? 1 / Math.sqrt(2) : 1
                        let tSum = [0, 0, 0]
                        for (let y = 0; y < tT; y++) {
                            for (let x = 0; x < tT; x++) {
                                if (tYs + y >= tHeight_ || tXs + x >= tWidth_) {
                                    continue
                                }
                                const tCos = Math.cos(((2 * x + 1) * u * Math.PI) / (2 * tT)) * Math.cos(((2 * y + 1) * v * Math.PI) / (2 * tT))
                                tSum = AM.add(tSum, AM.mul(aImage.data[tYs + y][tXs + x], tCos))
                            }
                        }
                        tSum = AM.mul(tSum, 2 / tT * tCu * tCv)
                        tDiscreteCosineTransform[tYs + v][tXs + u] = tSum
                    }
                }
            }
        }

        const tImage_ = newImageData(tWidth_, tHeight_)
        const tK = 8
        for (let tYs = 0; tYs < tHeight_; tYs += tT) {
            for (let tXs = 0; tXs < tWidth_; tXs += tT) {
                console.log("離散コサイン変換 復元 " + tYs + "行 " + tXs + "列");
                for (let y = 0; y < tT; y++) {
                    for (let x = 0; x < tT; x++) {
                        let tSum = [0, 0, 0]
                        for (let u = 0; u < tK; u++) {
                            for (let v = 0; v < tK; v++) {
                                const tCu = (u === 0) ? 1 / Math.sqrt(2) : 1
                                const tCv = (v === 0) ? 1 / Math.sqrt(2) : 1
                                const tCos = Math.cos(((2 * x + 1) * u * Math.PI) / (2 * tT)) * Math.cos(((2 * y + 1) * v * Math.PI) / (2 * tT))
                                tSum = AM.add(tSum, AM.mul(tDiscreteCosineTransform[tYs + v][tXs + u], tCos * tCu * tCv))
                            }
                        }
                        tSum = AM.mul(tSum, 2 / tT)
                        tImage_[tYs + y][tXs + x] = tSum
                    }
                }
            }
        }

        return { data: tImage_, width: tWidth_, height: tHeight_ }
    })

    return (
        <button onClick={process}>JPEG圧縮 (Step.1)離散コサイン変換</button>
    )
}
