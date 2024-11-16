import { ImageProcessUtility, ImageProcessUtilityProps, ProcessedImage } from "./utility"

export function Process003({ tImage, setResultURL }: ImageProcessUtilityProps) {
    // 二値化
    const grayscale = ImageProcessUtility({ tImage, setResultURL }, (aImage: ProcessedImage) => {
        for (let x = 0; x < aImage.width; x++) {
            for (let y = 0; y < aImage.height; y++) {
                const tRGB = aImage.data[x][y]
                const tGray = tRGB[0] * 0.2126 + tRGB[1] * 0.7152 + tRGB[2] * 0.0722
                const tThreshold = 128
                const tBinary = tGray > tThreshold ? 255 : 0
                aImage.data[x][y] = [tBinary, tBinary, tBinary]
            }
        }

        return aImage
    })

    return (
        <button onClick={grayscale}>二値化</button>
    )
}
