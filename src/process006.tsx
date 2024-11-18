import { ImageProcessUtility, ImageProcessUtilityProps, ProcessedImage } from "./utility"

export function Process006({ tImage, setResultURL }: ImageProcessUtilityProps) {
    const reduction = ImageProcessUtility({ tImage, setResultURL }, (aImage: ProcessedImage) => {
        for (let x = 0; x < aImage.width; x++) {
            for (let y = 0; y < aImage.height; y++) {
                const tRGB = aImage.data[x][y]
                const tRGB_ = tRGB.map((aValue) => {
                    if (aValue < 64) return 32
                    if (aValue < 128) return 96
                    if (aValue < 192) return 160
                    return 224
                })
                aImage.data[x][y] = tRGB_
            }
        }

        return aImage
    })

    return (
        <button onClick={reduction}>減色処理</button>
    )
}
