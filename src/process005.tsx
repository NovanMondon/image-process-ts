import { ArrayMath as AM, ImageProcessUtility, ImageProcessUtilityProps, ProcessedImage } from "./utility"

export function Process005({ tImage, setResultURL }: ImageProcessUtilityProps) {
    const rgb2hsv = (aRGB: number[]) => {
        const [tR, tG, tB] = AM.div(aRGB, 255)
        const tMax = Math.max(tR, tG, tB)
        const tMin = Math.min(tR, tG, tB)
        const tV = tMax
        const tS = tMax - tMin
        const tH = ((() => {
            if (tS === 0) return 0
            if (tMax === tR) return 60 * ((tG - tB) / tS)
            if (tMax === tG) return 60 * ((tB - tR) / tS + 2)
            if (tMax === tB) return 60 * ((tR - tG) / tS + 4)
            return 0
        })() + 360) % 360
        return [tH, tS, tV]
    }
    const hsv2rgb = (aHSV: number[]) => {
        const [tH, tS, tV] = aHSV
        const tC = tV * tS
        const tH_ = tH / 60
        const tX = tC * (1 - Math.abs(tH_ % 2 - 1))
        const tRGB = AM.add(AM.mul([1, 1, 1], tV - tC), (() => {
            if (0 <= tH_ && tH_ < 1) return [tC, tX, 0]
            if (1 <= tH_ && tH_ < 2) return [tX, tC, 0]
            if (2 <= tH_ && tH_ < 3) return [0, tC, tX]
            if (3 <= tH_ && tH_ < 4) return [0, tX, tC]
            if (4 <= tH_ && tH_ < 5) return [tX, 0, tC]
            if (5 <= tH_ && tH_ < 6) return [tC, 0, tX]
            return [0, 0, 0]
        })())
        return AM.mul(tRGB, 255)
    }
    // HSV: H反転
    const hsv_invH = ImageProcessUtility({ tImage, setResultURL }, (aImage: ProcessedImage) => {
        for (let x = 0; x < aImage.width; x++) {
            for (let y = 0; y < aImage.height; y++) {
                const tRGB = aImage.data[x][y]
                const tHSV = rgb2hsv(tRGB)
                tHSV[0] = (tHSV[0] + 180) % 360
                const tRGB_ = hsv2rgb(tHSV)
                aImage.data[x][y] = tRGB_
            }
        }

        return aImage
    })

    return (
        <button onClick={hsv_invH}>HSV: H反転</button>
    )
}
