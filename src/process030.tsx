import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"

export function Process030({ tImage, setResult }: ImageProcessUtilityProps) {
    const affineInverse = (a: number, b: number, c: number, d: number, tx: number, ty: number, x: number, y: number) => {
        const det = a * d - b * c
        const x_ = (d * x - b * y) / det - tx
        const y_ = (-c * x + a * y) / det - ty
        return [x_, y_] as [number, number]
    }

    const process = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tWidth_ = aImage.width
        const tHeight_ = aImage.height

        const tImage0_: ProcessedImage = {
            width: tWidth_,
            height: tHeight_,
            data: newImageData(tWidth_, tHeight_),
        }

        const tAngle = -30 / 180 * Math.PI
        const [a, b, c, d] = [Math.cos(tAngle), -Math.sin(tAngle), Math.sin(tAngle), Math.cos(tAngle)]
        const tPadding = [0, 0, 0]
        for (let x = 0; x < tImage0_.width; x++) {
            for (let y = 0; y < tImage0_.height; y++) {
                const [tSourceX, tSourceY] = affineInverse(a, b, c, d, 0, 0, x, y).map(Math.floor)

                if (tSourceX < 0 || tSourceX >= aImage.width || tSourceY < 0 || tSourceY >= aImage.height) {
                    tImage0_.data[y][x] = tPadding
                    continue
                }
                tImage0_.data[y][x] = aImage.data[tSourceY][tSourceX]
            }
        }

        const tImage1_: ProcessedImage = {
            width: tWidth_,
            height: tHeight_,
            data: newImageData(tWidth_, tHeight_),
        }

        const [tCenterX, tCenterY] = affineInverse(a, b, c, d, 0, 0, tWidth_ / 2, tHeight_ / 2)
        const tCenterDiffX = tWidth_ / 2 - tCenterX
        const tCenterDiffY = tHeight_ / 2 - tCenterY
        for (let x = 0; x < tImage1_.width; x++) {
            for (let y = 0; y < tImage1_.height; y++) {
                const [tSourceX, tSourceY] = affineInverse(a, b, c, d, -tCenterDiffX, -tCenterDiffY, x, y).map(Math.floor)

                if (tSourceX < 0 || tSourceX >= aImage.width || tSourceY < 0 || tSourceY >= aImage.height) {
                    tImage1_.data[y][x] = tPadding
                    continue
                }
                tImage1_.data[y][x] = aImage.data[tSourceY][tSourceX]
            }
        }

        return [tImage0_, tImage1_]
    })

    return (
        <button onClick={process}>アフィン変換(回転)</button>
    )
}
