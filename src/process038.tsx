import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process038({ tImage, setResult }: ImageProcessUtilityProps) {
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
        // 量子化
        const tQ: number[][] = [
            [16, 11, 10, 16, 24, 40, 51, 61],
            [12, 12, 14, 19, 26, 58, 60, 55],
            [14, 13, 16, 24, 40, 57, 69, 56],
            [14, 17, 22, 29, 51, 87, 80, 62],
            [18, 22, 37, 56, 68, 109, 103, 77],
            [24, 35, 55, 64, 81, 104, 113, 92],
            [49, 64, 78, 87, 103, 121, 120, 101],
            [72, 92, 95, 98, 112, 100, 103, 99]
        ];
        for (let tYs = 0; tYs < tHeight_; tYs += tT) {
            for (let tXs = 0; tXs < tWidth_; tXs += tT) {
                for (let y = 0; y < tT; y++) {
                    for (let x = 0; x < tT; x++) {
                        for (let c = 0; c < 3; c++) {
                            tDiscreteCosineTransform[tYs + y][tXs + x][c] = Math.round(tDiscreteCosineTransform[tYs + y][tXs + x][c] / tQ[y][x]) * tQ[y][x]
                        }
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

        const tVMax = 255
        // 平均二乗誤差
        let tSum = 0
        for (let y = 0; y < tHeight_; y++) {
            for (let x = 0; x < tWidth_; x++) {
                for (let c = 0; c < 3; c++) {
                    tSum += Math.pow(aImage.data[y][x][c] - tImage_[y][x][c], 2)
                }
            }
        }
        const tMSE = tSum / (tWidth_ * tHeight_)
        const tPSNR = 10 * Math.log10(tVMax * tVMax / tMSE)
        const tBitrate = 8 * tT * tT / (8 * 8)
        console.log("PSNR: " + tPSNR + ", Bitrate: " + tBitrate)

        return { data: tImage_, width: tWidth_, height: tHeight_ }
    })

    return (
        <button onClick={process}>JPEG圧縮 (Step.2)DCT+量子化</button>
    )
}
