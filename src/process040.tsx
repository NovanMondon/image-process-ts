import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process040({ tImage, setResult }: ImageProcessUtilityProps) {
    const process = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tWidth_ = aImage.width
        const tHeight_ = aImage.height

        // 1. RGB を YCbCrに変換
        const tImageYCbCr = newImageData(tWidth_, tHeight_)

        for (let y = 0; y < tHeight_; y++) {
            for (let x = 0; x < tWidth_; x++) {
                const tSource = aImage.data[y][x]
                const tY = 0.299 * tSource[0] + 0.587 * tSource[1] + 0.114 * tSource[2]
                const tCb = -0.168736 * tSource[0] - 0.331264 * tSource[1] + 0.5 * tSource[2] + 128
                const tCr = 0.5 * tSource[0] - 0.418688 * tSource[1] - 0.081312 * tSource[2] + 128

                tImageYCbCr[y][x] = [tY, tCb, tCr]
            }
        }

        // 2. YCbCrをDCT
        const tT = 8
        const tImageDCT = newImageData(tWidth_, tHeight_)
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
                                tSum = AM.add(tSum, AM.mul(tImageYCbCr[tYs + y][tXs + x], tCos))
                            }
                        }
                        tSum = AM.mul(tSum, 2 / tT * tCu * tCv)
                        tImageDCT[tYs + v][tXs + u] = tSum
                    }
                }
            }
        }

        // 3. DCTを量子化
        const tImageDCTQuantized = newImageData(tWidth_, tHeight_)
        const tQ1: number[][] = [
            [16, 11, 10, 16, 24, 40, 51, 61],
            [12, 12, 14, 19, 26, 58, 60, 55],
            [14, 13, 16, 24, 40, 57, 69, 56],
            [14, 17, 22, 29, 51, 87, 80, 62],
            [18, 22, 37, 56, 68, 109, 103, 77],
            [24, 35, 55, 64, 81, 104, 113, 92],
            [49, 64, 78, 87, 103, 121, 120, 101],
            [72, 92, 95, 98, 112, 100, 103, 99]
        ];

        const tQ2: number[][] = [
            [17, 18, 24, 47, 99, 99, 99, 99],
            [18, 21, 26, 66, 99, 99, 99, 99],
            [24, 26, 56, 99, 99, 99, 99, 99],
            [47, 66, 99, 99, 99, 99, 99, 99],
            [99, 99, 99, 99, 99, 99, 99, 99],
            [99, 99, 99, 99, 99, 99, 99, 99],
            [99, 99, 99, 99, 99, 99, 99, 99],
            [99, 99, 99, 99, 99, 99, 99, 99]
        ];
        for (let tYs = 0; tYs < tHeight_; tYs += tT) {
            for (let tXs = 0; tXs < tWidth_; tXs += tT) {
                for (let y = 0; y < tT; y++) {
                    for (let x = 0; x < tT; x++) {
                        for (let c = 0; c < 3; c++) {
                            if (c == 0) {
                                tImageDCTQuantized[tYs + y][tXs + x][c] = Math.round(tImageDCT[tYs + y][tXs + x][c] / tQ1[y][x]) * tQ1[y][x]
                            } else {
                                tImageDCTQuantized[tYs + y][tXs + x][c] = Math.round(tImageDCT[tYs + y][tXs + x][c] / tQ2[y][x]) * tQ2[y][x]
                            }
                        }
                    }
                }
            }
        }

        // 4. 量子化したDCTをDCT逆変換
        const tImageDCTInverse = newImageData(tWidth_, tHeight_)
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
                                tSum = AM.add(tSum, AM.mul(tImageDCTQuantized[tYs + v][tXs + u], tCos * tCu * tCv))
                            }
                        }
                        tSum = AM.mul(tSum, 2 / tT)
                        tImageDCTInverse[tYs + y][tXs + x] = tSum
                    }
                }
            }
        }

        // 5. YCbCrをRGBに変換
        const tImage_ = newImageData(tWidth_, tHeight_)
        for (let y = 0; y < tHeight_; y++) {
            for (let x = 0; x < tWidth_; x++) {
                const tSource = tImageDCTInverse[y][x]

                const tY = tSource[0]
                const tCb = tSource[1]
                const tCr = tSource[2]

                const tR = tY + 1.402 * (tCr - 128)
                const tG = tY - 0.344136 * (tCb - 128) - 0.714136 * (tCr - 128)
                const tB = tY + 1.772 * (tCb - 128)

                tImage_[y][x] = [tR, tG, tB]
            }
        }

        return { width: tWidth_, height: tHeight_, data: tImage_ }
    })

    return (
        <button onClick={process}>JPEG圧縮 (Step.4)YCbCr+DCT+量子化</button>
    )
}
