import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process024({ tImage, setResult }: ImageProcessUtilityProps) {
    const process = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tC = 1
        const tGamma = 2.2
        for (let x = 0; x < aImage.width; x++) {
            for (let y = 0; y < aImage.height; y++) {
                const tRGB = aImage.data[x][y]
                const tRGB_ = tRGB.map((aValue) => {
                    const tValue01 = aValue / 255
                    const tValue01_ = Math.pow(1 / tC * tValue01, 1 / tGamma)
                    return Math.round(tValue01_ * 255)
                })
                aImage.data[x][y] = tRGB_
            }
        }

        return aImage
    })

    return (
        <button onClick={process}>ガンマ補正</button>
    )
}
