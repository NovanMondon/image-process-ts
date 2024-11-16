import { ImageProcessUtility, ImageProcessUtilityProps, ProcessedImage } from "./utility"

export function Process004({ tImage, setResultURL }: ImageProcessUtilityProps) {
    // 大津の二値化
    const binary_ize2 = ImageProcessUtility({ tImage, setResultURL }, (aImage: ProcessedImage) => {
        // スレッショルドを求める
        const tHist = new Array(256).fill(0)
        for (let x = 0; x < aImage.width; x++) {
            for (let y = 0; y < aImage.height; y++) {
                const tRGB = aImage.data[x][y]
                const tGray = tRGB[0] * 0.2126 + tRGB[1] * 0.7152 + tRGB[2] * 0.0722

                tHist[Math.floor(tGray)]++
            }
        }
        let tThreshold = 0
        let tMaxS2 = 0
        for (let tT = 1; tT < 256; tT++) {
            let tW0 = 0
            let tW1 = 0
            let tSum0 = 0
            let tSum1 = 0
            for (let i = 0; i < 256; i++) {
                if (i < tT) {
                    tW0 += tHist[i]
                    tSum0 += i * tHist[i]
                } else {
                    tW1 += tHist[i]
                    tSum1 += i * tHist[i]
                }
            }
            const tMean0 = tSum0 / tW0
            const tMean1 = tSum1 / tW1
            const tS2 = tW0 * tW1 * (tMean0 - tMean1) * (tMean0 - tMean1)

            if (tS2 > tMaxS2) {
                tMaxS2 = tS2
                tThreshold = tT
            }
        }
        console.log("大津の二値化: ", tThreshold);

        // 二値化
        for (let x = 0; x < aImage.width; x++) {
            for (let y = 0; y < aImage.height; y++) {
                const tRGB = aImage.data[x][y]
                const tGray = tRGB[0] * 0.2126 + tRGB[1] * 0.7152 + tRGB[2] * 0.0722
                const tBinary = tGray > tThreshold ? 255 : 0
                aImage.data[x][y] = [tBinary, tBinary, tBinary]
            }
        }

        return aImage
    })

    return (
        <button onClick={binary_ize2}>大津の二値化</button>
    )
}
