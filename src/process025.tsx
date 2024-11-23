import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"

export function Process025({ tImage, setResult }: ImageProcessUtilityProps) {
    const process = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tScale = 1.5
        const tWidth_ = Math.round(aImage.width * tScale)
        const tHeight_ = Math.round(aImage.height * tScale)
        const tImageData_ = newImageData(tWidth_, tHeight_)
        for(let x = 0; x < tWidth_; x++) {
            for(let y = 0; y < tHeight_; y++) {
                const tSourceX = Math.round(x / tScale)
                const tSourceY = Math.round(y / tScale)
                tImageData_[y][x] = aImage.data[tSourceY][tSourceX]
            }
        }

        return { width: tWidth_, height: tHeight_, data: tImageData_ }
    })

    return (
        <button onClick={process}>最近傍補間</button>
    )
}
