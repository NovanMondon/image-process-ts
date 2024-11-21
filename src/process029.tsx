import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"

export function Process029({ tImage, setResult }: ImageProcessUtilityProps) {
    const affineInverse = (a: number, b: number, c: number, d: number, tx: number, ty: number, x: number, y: number) => {
        const det = a * d - b * c
        const x_ = (d * x - b * y) / det - tx
        const y_ = (-c * x + a * y) / det - ty
        return [x_, y_] as [number, number]
    }

    const process = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tScaleX = 1.3
        const tScaleY = 0.8
        const tWidth_ = Math.round(aImage.width * tScaleX)
        const tHeight_ = Math.round(aImage.height * tScaleY)

        const tImage0_: ProcessedImage = {
            width: tWidth_,
            height: tHeight_,
            data: newImageData(tWidth_, tHeight_),
        }

        const tTx = +30
        const tTy = -30
        const tPadding = [0, 0, 0]
        for (let x = 0; x < tImage0_.width; x++) {
            for (let y = 0; y < tImage0_.height; y++) {
                const [tSourceX, tSourceY] = affineInverse(tScaleX, 0, 0, tScaleY, 0, 0, x, y).map(Math.floor)

                if (tSourceX < 0 || tSourceX >= aImage.width || tSourceY < 0 || tSourceY >= aImage.height) {
                    tImage0_.data[x][y] = tPadding
                    continue
                }
                tImage0_.data[x][y] = aImage.data[tSourceX][tSourceY]
            }
        }

        const tImage1_: ProcessedImage = {
            width: tWidth_,
            height: tHeight_,
            data: newImageData(tWidth_, tHeight_),
        }

        for (let x = 0; x < tImage1_.width; x++) {
            for (let y = 0; y < tImage1_.height; y++) {
                const [tSourceX, tSourceY] = affineInverse(tScaleX, 0, 0, tScaleY, tTx, tTy, x, y).map(Math.floor)

                if (tSourceX < 0 || tSourceX >= aImage.width || tSourceY < 0 || tSourceY >= aImage.height) {
                    tImage1_.data[x][y] = tPadding
                    continue
                }
                tImage1_.data[x][y] = aImage.data[tSourceX][tSourceY]
            }
        }

        return [tImage0_, tImage1_]
    })

    return (
        <button onClick={process}>アフィン変換(拡大縮小)</button>
    )
}
