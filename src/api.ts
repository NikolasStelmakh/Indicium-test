import * as fs from 'fs';
import * as csv from 'fast-csv';
import { TableIdValue, TableJsonValue } from './types';

export const executeTransformation = (fileName: string) => {
    const csvOutputStream = csv.format({ headers: true });
    csvOutputStream.pipe(process.stdout);

    fs.createReadStream(fileName)
        .pipe(csv.parse({ headers: true }))
        .on('error', (error) => console.error(error))
        .on('data', (row: { id: string; json: string }) => {
            const { id, json } = row;
            if (id.length && json.length) {
                const result = rotateMatrix(JSON.parse(json), JSON.parse(id));
                csvOutputStream.write({
                    id: `${id}`,
                    json: JSON.stringify(result),
                    is_valid: !!result.length,
                });
            } else {
                console.log('Data is not valid: ' + JSON.stringify(row))
            }
        })
        .on('end', (rowCount: number) => {
            // console.log(`\nEnd. Parsed ${rowCount} rows.`);
            process.exit(0);
        });
};

export const rotateMatrix = (
    data: TableJsonValue,
    id: TableIdValue, // could be useful for logging
) => {
    // in the task matrix length and height are equal
    const matrixLength = Math.sqrt(data.length);
    const matrixHeight = matrixLength;

    let isTableValid = false;
    if (data.length && Number.isInteger(matrixLength)) isTableValid = true;

    if (!isTableValid) {
        // console.log(`invalid data: id=${id}, data=${JSON.stringify(data)}, returning []`);
        return [];
    }

    const framesCount = Math.floor((matrixLength > matrixHeight ? matrixHeight : matrixLength) / 2)

    for (let frameIndex = 0; frameIndex < framesCount; frameIndex++) {
        const frameTopStartIndex = frameIndex*(matrixLength + 1);
        const frameTopEndIndex = (matrixLength - 1)*(frameIndex + 1);
        const frameBottomStartIndex = data.length - 1 - frameIndex*(matrixLength + 1);
        const frameBottomEndIndex = data.length - 1 - (frameIndex + 1)*(matrixLength - 1);

        let index = frameTopStartIndex;
        let temporaryValue;

        // top -> move right
        do {
            let nextIndex = index + 1
            const nextElement = data[nextIndex];
            data[nextIndex] = temporaryValue ? temporaryValue : data[index];
            temporaryValue = nextElement;

            index = nextIndex;
        } while (index !== frameTopEndIndex);

        // right -> move down
        do {
            let nextIndex = index + matrixLength
            const nextElement = data[nextIndex];
            data[nextIndex] = temporaryValue;
            temporaryValue = nextElement;

            index = nextIndex;
        } while (index !== frameBottomStartIndex);

        // bottom -> move left
        do {
            let nextIndex = index - 1
            const nextElement = data[nextIndex];
            data[nextIndex] = temporaryValue;
            temporaryValue = nextElement;

            index = nextIndex;
        } while (index !== frameBottomEndIndex);

        // left -> move up
        do {
            let nextIndex = index - matrixLength
            const nextElement = data[nextIndex];
            data[nextIndex] = temporaryValue;
            temporaryValue = nextElement;

            index = nextIndex;
        } while (index !== frameTopStartIndex);
    }

    return data;
}
