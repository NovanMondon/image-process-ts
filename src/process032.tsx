import { ImageProcessUtility, ImageProcessUtilityProps, newImageData, ProcessedImage } from "./utility"
import { ArrayMath as AM } from "./utility"

export function Process032({ tImage, setResult }: ImageProcessUtilityProps) {
    const process = ImageProcessUtility({ tImage, setResult }, (aImage: ProcessedImage) => {
        const tWidth_ = aImage.width
        const tHeight_ = aImage.height

        const tGrayImage: number[][][] = []
        for (let y = 0; y < tHeight_; y++) {
            tGrayImage[y] = []
            for (let x = 0; x < tWidth_; x++) {
                const tRGB = aImage.data[y][x]
                const tGray = tRGB[0] * 0.2126 + tRGB[1] * 0.7152 + tRGB[2] * 0.0722
                tGrayImage[y][x] = [tGray, tGray, tGray]
            }
        }

        console.log("フーリエ変換 開始")
        // フーリエ変換
        const tFourierImage: ProcessedImage = { height: tHeight_, width: tWidth_, data: newImageData(tWidth_, tHeight_) }
        const tFourier: number[][][] = []
        for (let l = 0; l < tHeight_; l++) {
            tFourier.push([])
            console.log("フーリエ変換 " + l + "行目");
            for (let k = 0; k < tWidth_; k++) {
                let tT0 = [0, 0]
                for (let y = 0; y < tHeight_; y++) {
                    for (let x = 0; x < tWidth_; x++) {
                        const tGray = tGrayImage[y][x][0]
                        const tTheta = -2 * Math.PI * (k * x / tWidth_ + l * y / tHeight_)
                        tT0 = AM.add(tT0, [tGray * Math.cos(tTheta), tGray * Math.sin(tTheta)])
                    }
                }
                tT0 = AM.div(tT0, Math.sqrt(tWidth_ * tHeight_))
                tFourier[l][k] = tT0
                const tPower = AM.compAbs(tT0)
                tFourierImage.data[l][k] = [tPower, tPower, tPower]
            }
        }

        console.log("フーリエ変換 終了")
        console.log("逆フーリエ変換 開始")
        // 逆フーリエ変換
        const tImage_: ProcessedImage = { height: tHeight_, width: tWidth_, data: newImageData(tWidth_, tHeight_) }
        for (let y = 0; y < tHeight_; y++) {
            console.log("逆フーリエ変換 " + y + "行目");
            for (let x = 0; x < tWidth_; x++) {
                let tT0 = [0, 0]
                for (let l = 0; l < tHeight_; l++) {
                    for (let k = 0; k < tWidth_; k++) {
                        const tG = tFourier[l][k]
                        const tTheta = 2 * Math.PI * (k * x / tWidth_ + l * y / tHeight_)
                        tT0 = AM.add(tT0, AM.compMul(tG, [Math.cos(tTheta), Math.sin(tTheta)]))
                    }
                }
                tT0 = AM.div(tT0, Math.sqrt(tWidth_ * tHeight_))
                const tPower = AM.compAbs(tT0)
                tImage_.data[y][x] = [tPower, tPower, tPower]
            }
        }
        console.log("逆フーリエ変換 終了")

        return [tImage_, tFourierImage]
    })

    return (
        <button onClick={process}>フーリエ変換</button>
    )
}
