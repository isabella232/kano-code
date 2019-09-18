export interface ITransformationArray {
    [index: number]: number[]
}

export const multiply = (a: any, b: any) => {
    const aNumRows = a.length;
    const aNumCols = a[0].length; 
    const bNumCols = b[0].length;
    const m = new Array(aNumRows);
    for (let r = 0; r < aNumRows; r+=1) {
        m[r] = new Array(bNumCols);
        for (let c = 0; c < bNumCols; c+=1) {
            m[r][c] = 0;
            for (var i = 0; i < aNumCols; i+=1) {
                m[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return m;
}

export function calculateRotation(origin: {x: number, y: number}, angle: number) {
    const r = angle * (Math.PI / 180);
    const xx = Math.cos(r);
    const xy = Math.sin(r);

    const translate1 = [
        [Math.cos(0),-Math.sin(0), -origin.x],
        [Math.sin(0), Math.cos(0), -origin.y],
        [0, 0, 1],
    ];
    const rotate = [
        [xx, -xy, 0],
        [xy, xx, 0],
        [0, 0, 1],
    ];
    const translate2 = [
        [Math.cos(0), -Math.sin(0), origin.x],
        [Math.sin(0), Math.cos(0), origin.y],
        [0, 0, 1],
    ];

    return multiply(multiply(translate2, rotate), translate1);
}

export function calculateFullTransform(origin: {x: number, y: number}, angle: number, scale: number, aspectRatio: number) {

    const r = angle * (Math.PI / 180);
    const xx = Math.cos(r) * aspectRatio;
    const xy = Math.sin(r) * aspectRatio;

    const translate1 = [
        [Math.cos(0),-Math.sin(0), -origin.x],
        [Math.sin(0), Math.cos(0), -origin.y],
        [0, 0, 1],
    ];
    const rotate = [
        [xx, -xy, 0],
        [xy, xx, 0],
        [0, 0, 1],
    ];
    const translate2 = [
        [Math.cos(0), -Math.sin(0), origin.x],
        [Math.sin(0), Math.cos(0), origin.y],
        [0, 0, 1],
    ];
    const resize = [
        [scale, 0, 0],
        [0, scale, 0],
        [0, 0, 1]
    ];

    return multiply(multiply(multiply(translate2, rotate), translate1), resize);

}