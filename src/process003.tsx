import { ImageProcessUtility, ImageProcessUtilityProps, ProcessedImage } from "./utility"

export function Process003({ tImage, setResult }: ImageProcessUtilityProps) {
    // 二値化
    const binary_ize = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        for (let x = 0; x < aImage.width; x++) {
            for (let y = 0; y < aImage.height; y++) {
                const tRGB = aImage.data[y][x]
                const tGray = tRGB[0] * 0.2126 + tRGB[1] * 0.7152 + tRGB[2] * 0.0722
                const tThreshold = 128
                const tBinary = tGray > tThreshold ? 255 : 0
                aImage.data[y][x] = [tBinary, tBinary, tBinary]
            }
        }

        return aImage
    })

    return (
        <button onClick={binary_ize}>二値化</button>
    )
}
