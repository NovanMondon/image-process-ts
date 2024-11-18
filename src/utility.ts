export type ProcessedImage = {
    width: number
    height: number
    data: number[][][]
}

export interface ImageProcessUtilityProps {
    tImage: HTMLImageElement | null
    setResultURL: (aURL: string) => void
}

export function ImageProcessUtility(
    { tImage, setResultURL }: ImageProcessUtilityProps,
    aProcess: ((aImageData: ProcessedImage) => ProcessedImage))
    : (() => void) {
    // console.log(tImage);

    return () => {
        if (!tImage) return

        // Canvasを作成
        const tCanvas = document.createElement('canvas')
        const tContext = tCanvas.getContext('2d')
        if (!tContext) return
        tCanvas.width = tImage.width
        tCanvas.height = tImage.height
        // console.log(tCanvas.width, tCanvas.height);

        // 画像をCanvasに描画
        tContext.drawImage(tImage, 0, 0)

        // 画像データを取得
        const tImageData = tContext.getImageData(0, 0, tImage.width, tImage.height)
        const tData = tImageData.data

        const tProcessedImage: ProcessedImage = {
            width: tImage.width,
            height: tImage.height,
            data: []
        }
        for (let x = 0; x < tImage.width; x++) {
            tProcessedImage.data[x] = []
            for (let y = 0; y < tImage.height; y++) {
                const tIndex = (y * tImage.width + x) * 4
                tProcessedImage.data[x][y] = [tData[tIndex], tData[tIndex + 1], tData[tIndex + 2]]
            }
        }

        // 画像データを処理
        const tResult = aProcess(tProcessedImage)
        const tResultData = new Uint8ClampedArray(tResult.width * tResult.height * 4)
        for (let x = 0; x < tResult.width; x++) {
            for (let y = 0; y < tResult.height; y++) {
                const tIndex = (y * tResult.width + x) * 4
                tResultData[tIndex] = tResult.data[x][y][0]
                tResultData[tIndex + 1] = tResult.data[x][y][1]
                tResultData[tIndex + 2] = tResult.data[x][y][2]
                tResultData[tIndex + 3] = 255
            }
        }

        tImageData.data.set(tResultData)
        // 画像データをCanvasに描画
        tContext.putImageData(tImageData, 0, 0)

        // 画像を表示
        setResultURL(tCanvas.toDataURL())
    }
}

export const ArrayMath = {
    add: (aArray1: number[], aArray2: number[]) => aArray1.map((aValue, aI) => aValue + aArray2[aI]),
    sub: (aArray1: number[], aArray2: number[]) => aArray1.map((aValue, aI) => aValue - aArray2[aI]),
    mul: (aArray: number[], aScalar: number) => aArray.map(aValue => aValue * aScalar),
    div: (aArray: number[], aScalar: number) => aArray.map(aValue => aValue / aScalar),
}
