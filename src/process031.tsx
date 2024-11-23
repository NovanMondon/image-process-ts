import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"

export function Process031({ tImage, setResult }: ImageProcessUtilityProps) {
    const affineInverse = (a: number, b: number, c: number, d: number, tx: number, ty: number, x: number, y: number) => {
        const det = a * d - b * c
        const x_ = (d * x - b * y) / det - tx
        const y_ = (-c * x + a * y) / det - ty
        return [x_, y_] as [number, number]
    }

    const process = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tWidth_ = aImage.width
        const tHeight_ = aImage.height

        const tPadding = [0, 0, 0]

        const tImage0_: ProcessedImage = (() => {
            const tDx = 30
            let tA = tDx / tWidth_
            const tImage_ = {
                width: tWidth_ + tDx,
                height: tHeight_,
                data: newImageData(tWidth_ + tDx, tHeight_),
            }

            const [a, b, c, d] = [1, tA, 0, 1]

            for (let x = 0; x < tImage_.width; x++) {
                for (let y = 0; y < tImage_.height; y++) {
                    const [tSourceX, tSourceY] = affineInverse(a, b, c, d, 0, 0, x, y).map(Math.floor)

                    if (tSourceX < 0 || tSourceX >= aImage.width || tSourceY < 0 || tSourceY >= aImage.height) {
                        tImage_.data[y][x] = tPadding
                        continue
                    }
                    tImage_.data[y][x] = aImage.data[tSourceY][tSourceX]
                }
            }
            return tImage_
        })()

        const tImage1_: ProcessedImage = (() => {
            const tDy = 30
            let tA = tDy / tHeight_
            const tImage_ = {
                width: tWidth_,
                height: tHeight_ + tDy,
                data: newImageData(tWidth_, tHeight_ + tDy),
            }

            const [a, b, c, d] = [1, 0, tA, 1]

            for (let x = 0; x < tImage_.width; x++) {
                for (let y = 0; y < tImage_.height; y++) {
                    const [tSourceX, tSourceY] = affineInverse(a, b, c, d, 0, 0, x, y).map(Math.floor)

                    if (tSourceX < 0 || tSourceX >= aImage.width || tSourceY < 0 || tSourceY >= aImage.height) {
                        tImage_.data[y][x] = tPadding
                        continue
                    }
                    tImage_.data[y][x] = aImage.data[tSourceY][tSourceX]
                }
            }
            return tImage_
        })()


        const tImage2_: ProcessedImage = (() => {
            const tDx = 30
            const tDy = 30
            const tImage_ = {
                width: tWidth_ + tDx,
                height: tHeight_ + tDy,
                data: newImageData(tWidth_ + tDx, tHeight_ + tDy),
            }
            const [a, b, c, d] = [1, tDy / tHeight_, tDx / tWidth_, 1]

            for (let x = 0; x < tImage_.width; x++) {
                for (let y = 0; y < tImage_.height; y++) {
                    const [tSourceX, tSourceY] = affineInverse(a, b, c, d, 0, 0, x, y).map(Math.floor)

                    if (tSourceX < 0 || tSourceX >= aImage.width || tSourceY < 0 || tSourceY >= aImage.height) {
                        tImage_.data[y][x] = tPadding
                        continue
                    }
                    tImage_.data[y][x] = aImage.data[tSourceY][tSourceX]
                }
            }
            return tImage_
        })()

        return [tImage0_, tImage1_, tImage2_]
    })

    return (
        <button onClick={process}>アフィン変換(スキュー)</button>
    )
}
