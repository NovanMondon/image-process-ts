import { ImageProcessUtility, ImageProcessUtilityProps, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process007({ tImage, setResult }: ImageProcessUtilityProps) {
    const mean_pooling = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tGridSize = 8
        for (let tGridX = 0; tGridX < aImage.width / tGridSize; tGridX++) {
            for (let tGridY = 0; tGridY < aImage.height / tGridSize; tGridY++) {
                // グリッド内のRGBの平均を求める
                let tSum = [0, 0, 0]
                for (let x = 0; x < tGridSize; x++) {
                    for (let y = 0; y < tGridSize; y++) {
                        const tRGB = aImage.data[tGridY * tGridSize + y][tGridX * tGridSize + x]
                        tSum = AM.add(tSum, tRGB)
                    }
                }
                const tMean = AM.div(tSum, tGridSize * tGridSize)

                // グリッド内のRGBを平均で置き換える
                for (let x = 0; x < tGridSize; x++) {
                    for (let y = 0; y < tGridSize; y++) {
                        aImage.data[tGridY * tGridSize + y][tGridX * tGridSize + x] = tMean
                    }
                }
            }
        }

        return aImage
    })

    return (
        <button onClick={mean_pooling}>平均プーリング</button>
    )
}
