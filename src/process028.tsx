import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"

export function Process028({ tImage, setResult }: ImageProcessUtilityProps) {
    const affineInverse = (a: number, b: number, c: number, d: number, tx: number, ty: number, x: number, y: number) => {
        const det = a * d - b * c
        const x_ = (d * x - b * y) / det - tx
        const y_ = (-c * x + a * y) / det - ty
        return [x_, y_] as [number, number]
    }

    const process = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tImage_: ProcessedImage = { width: aImage.width, height: aImage.height, data: newImageData(aImage.width, aImage.height) }

        const tTx = +30
        const tTy = -30
        const tPadding = [0, 0, 0]
        for (let x = 0; x < tImage_.width; x++) {
            for (let y = 0; y < tImage_.height; y++) {
                const [tSourceX, tSourceY] = affineInverse(1, 0, 0, 1, tTx, tTy, x, y)

                if (tSourceX < 0 || tSourceX >= aImage.width || tSourceY < 0 || tSourceY >= aImage.height) {
                    tImage_.data[x][y] = tPadding
                    continue
                }

                tImage_.data[x][y] = aImage.data[tSourceX][tSourceY]
            }
        }

        return tImage_
    })

    return (
        <button onClick={process}>アフィン変換(平行移動)</button>
    )
}
