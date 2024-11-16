import { ImageProcessUtility, ProcessedImage } from "./utility"

interface Process001Props {
    tImage: HTMLImageElement | null
    setResultURL: (aURL: string) => void
}

export function Process001({ tImage, setResultURL }: Process001Props) {
    // RGBをBGRに変換
    const rgb2bgr = ImageProcessUtility({ tImage, setResultURL }, (aImage: ProcessedImage) => {
        for (let x = 0; x < aImage.width; x++) {
            for (let y = 0; y < aImage.height; y++) {
                const tRGB = aImage.data[x][y]
                const tBGR = [tRGB[2], tRGB[1], tRGB[0]]
                aImage.data[x][y] = tBGR
            }
        }

        return aImage
    })

    return (
        <button onClick={rgb2bgr}>RGB to BGR</button>
    )
}
