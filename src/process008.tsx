import { ImageProcessUtility, ImageProcessUtilityProps, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process008({ tImage, setResult }: ImageProcessUtilityProps) {
    const max_pooling = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tGridSize = 8
        for (let tGridX = 0; tGridX < aImage.width / tGridSize; tGridX++) {
            for (let tGridY = 0; tGridY < aImage.height / tGridSize; tGridY++) {
                let tMax = [0, 0, 0]
                for (let x = 0; x < tGridSize; x++) {
                    for (let y = 0; y < tGridSize; y++) {
                        const tRGB = aImage.data[tGridX * tGridSize + x][tGridY * tGridSize + y]
                        tMax = AM.max(tMax, tRGB)
                    }
                }

                for (let x = 0; x < tGridSize; x++) {
                    for (let y = 0; y < tGridSize; y++) {
                        aImage.data[tGridX * tGridSize + x][tGridY * tGridSize + y] = tMax
                    }
                }
            }
        }

        return aImage
    })

    return (
        <button onClick={max_pooling}>Maxプーリング</button>
    )
}
