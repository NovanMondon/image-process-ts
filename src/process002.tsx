import { ImageProcessUtility, ImageProcessUtilityProps, ProcessedImage } from "./utility"

export function Process002({ tImage, setResult }: ImageProcessUtilityProps) {
    // グレースケールに変換
    const grayscale = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        for (let x = 0; x < aImage.width; x++) {
            for (let y = 0; y < aImage.height; y++) {
                const tRGB = aImage.data[x][y]
                const tGray = tRGB[0] * 0.2126 + tRGB[1] * 0.7152 + tRGB[2] * 0.0722
                aImage.data[x][y] = [tGray, tGray, tGray]
            }
        }

        return aImage
    })

    return (
        <button onClick={grayscale}>グレースケール</button>
    )
}
