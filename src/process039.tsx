import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"

export function Process039({ tImage, setResult }: ImageProcessUtilityProps) {
    const process = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tWidth_ = aImage.width
        const tHeight_ = aImage.height
        const tImage_ = newImageData(tWidth_, tHeight_)

        for(let y = 0; y < tHeight_; y++) {
            for(let x = 0; x < tWidth_; x++) {
                const tSource = aImage.data[y][x]
                const tY = 0.299 * tSource[0] + 0.587 * tSource[1] + 0.114 * tSource[2]
                const tCb = -0.168736 * tSource[0] - 0.331264 * tSource[1] + 0.5 * tSource[2] + 128
                const tCr = 0.5 * tSource[0] - 0.418688 * tSource[1] - 0.081312 * tSource[2] + 128

                const tY_ = tY * 0.7

                const tR = tY_ + 1.402 * (tCr - 128)
                const tG = tY_ - 0.344136 * (tCb - 128) - 0.714136 * (tCr - 128)
                const tB = tY_ + 1.772 * (tCb - 128)

                tImage_[y][x] = [tR, tG, tB]
            }
        }

        return { width: tWidth_, height: tHeight_, data: tImage_ }
    })

    return (
        <button onClick={process}>JPEG圧縮 (Step.3)YCbCr表色系</button>
    )
}
