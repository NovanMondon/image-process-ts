import { ResultState } from "./App"

export type ProcessedImage = {
    width: number
    height: number
    data: number[][][]
}

export interface ImageProcessUtilityProps {
    tImage: HTMLImageElement | null
    setResult: (aResult: ResultState) => void
}

export function ImageProcessUtility(
    { tImage, setResult }: ImageProcessUtilityProps,
    aProcess: ((aImageData: ProcessedImage) => ProcessedImage | ProcessedImage[]),
): (() => void) {
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
        let tResult: ResultState = { imageURL: [] }
        let tProcessedImages: ProcessedImage | ProcessedImage[] = aProcess(tProcessedImage)
        if (!Array.isArray(tProcessedImages)) {
            tProcessedImages = [tProcessedImages]
        }
        for (let i = 0; i < tProcessedImages.length; i++) {
            const tCanvas = document.createElement('canvas')
            const tContext = tCanvas.getContext('2d')
            if (!tContext) return
            tCanvas.width = tImage.width
            tCanvas.height = tImage.height

            const tProcessedImage = tProcessedImages[i]
            const tProcessedData = calcResultData(tProcessedImage)

            const tProcessedImageData = tContext.createImageData(tImage.width, tImage.height)

            tProcessedImageData.data.set(tProcessedData)
            // 画像データをCanvasに描画
            tContext.putImageData(tProcessedImageData, 0, 0)

            tResult.imageURL.push(tCanvas.toDataURL())
        }
        // 画像を表示
        setResult(tResult)
    }
}

function calcResultData(aImage: ProcessedImage): Uint8ClampedArray {
    const tResultData = new Uint8ClampedArray(aImage.width * aImage.height * 4)
    for (let x = 0; x < aImage.width; x++) {
        for (let y = 0; y < aImage.height; y++) {
            const tIndex = (y * aImage.width + x) * 4
            tResultData[tIndex] = aImage.data[x][y][0]
            tResultData[tIndex + 1] = aImage.data[x][y][1]
            tResultData[tIndex + 2] = aImage.data[x][y][2]
            tResultData[tIndex + 3] = 255
        }
    }
    return tResultData
}

export const ArrayMath = {
    // stats
    sMedian: (aArray: number[]) => {
        const tSorted = aArray.slice().sort((aA, aB) => aA - aB)
        if (tSorted.length % 2 === 0) {
            return (tSorted[tSorted.length / 2 - 1] + tSorted[tSorted.length / 2]) / 2
        } else {
            return tSorted[(tSorted.length - 1) / 2]
        }
    },
    sAverage: (aArray: number[]) => aArray.reduce((aSum, aValue) => aSum + aValue, 0) / aArray.length,

    // calc
    add: (aArray1: number[], aArray2: number[]) => aArray1.map((aValue, aI) => aValue + aArray2[aI]),
    sub: (aArray1: number[], aArray2: number[]) => aArray1.map((aValue, aI) => aValue - aArray2[aI]),
    mul: (aArray: number[], aScalar: number) => aArray.map(aValue => aValue * aScalar),
    div: (aArray: number[], aScalar: number) => aArray.map(aValue => aValue / aScalar),
    max: (aArray1: number[], aArray2: number[]) => aArray1.map((aValue, aI) => Math.max(aValue, aArray2[aI])),
    min: (aArray1: number[], aArray2: number[]) => aArray1.map((aValue, aI) => Math.min(aValue, aArray2[aI])),

    // 2Dim
    add2D: (aArray1: number[][], aArray2: number[][]) => aArray1.map((aValue, aI) => ArrayMath.add(aValue, aArray2[aI])),
    sub2D: (aArray1: number[][], aArray2: number[][]) => aArray1.map((aValue, aI) => ArrayMath.sub(aValue, aArray2[aI])),
    mul2D: (aArray: number[][], aScalar: number) => aArray.map(aValue => ArrayMath.mul(aValue, aScalar)),
    div2D: (aArray: number[][], aScalar: number) => aArray.map(aValue => ArrayMath.div(aValue, aScalar)),

    // others
    new: (aWidth: number, aHeight: number, aInit: number) => {
        const tArray: number[][] = []
        for (let x = 0; x < aWidth; x++) {
            tArray[x] = []
            for (let y = 0; y < aHeight; y++) {
                tArray[x][y] = aInit
            }
        }
        return tArray
    }
}

export function newImageData(aWidth: number, aHeight: number): number[][][] {
    const tData: number[][][] = []
    for (let x = 0; x < aWidth; x++) {
        tData[x] = []
        for (let y = 0; y < aHeight; y++) {
            tData[x][y] = [0, 0, 0]
        }
    }
    return tData
}

