import * as fs from 'fs';
import * as csv from 'fast-csv';
import { isOdd } from './helpers';
import { TableChunks, TableIdValue, TableJsonValue } from './types';

export const executeTransformation = (fileName: string) => {
    const csvOutputStream = csv.format({ headers: true });
    csvOutputStream.pipe(process.stdout);

    fs.createReadStream(fileName)
        .pipe(csv.parse({ headers: true }))
        .on('error', (error) => console.error(error))
        .on('data', (row: { id: string; json: string }) => {
            const { id, json } = row;
            if (id.length && json.length) {
                const result = rotateTable(JSON.parse(json), JSON.parse(id));
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

export const rotateTable = (
    data: TableJsonValue,
    id?: TableIdValue, // could be useful for logging
): TableJsonValue => {
    const tableChunkLength = Math.sqrt(data.length);
    let isTableValid = false;
    if (data.length && Number.isInteger(tableChunkLength)) isTableValid = true;

    if (!isTableValid) {
        // console.log(`invalid data: id=${id}, data=${JSON.stringify(data)}, returning []`);
        return [];
    }

    const chunks = createChunks(data, tableChunkLength);
    const tableChunkHeight = chunks.length; // variable added in case we have non-square table, for example: 4x5 (functional not implemented on 100%, but variable added to make less work in future)

    const rotatedTableResult: TableJsonValue = [];

    if (isOdd(tableChunkLength)) {
        // odd table size
        chunks.forEach((chunk, rowIndex) => {
            const tableMiddleRowIndex = Math.floor(tableChunkHeight / 2);

            chunk.forEach((elem, columnIndex) => {
                const originalIndex = rowIndex * tableChunkLength + columnIndex;
                const isUpperPartOfTheTable = rowIndex < tableMiddleRowIndex; // chunk is from upper part of the table
                const isLowerPartOfTheTable = rowIndex > tableMiddleRowIndex; // chunk is from lower part of the table
                const columnSquareStartIndex = isUpperPartOfTheTable
                    ? rowIndex
                    : tableChunkLength - 1 - rowIndex; // square can mean subsquare as well
                const columnSquareEndIndex = isUpperPartOfTheTable
                    ? tableChunkLength - 1 - rowIndex
                    : rowIndex; // square can mean subsquare as well

                if (isUpperPartOfTheTable) {
                    if (
                        columnIndex >= columnSquareStartIndex &&
                        columnIndex < columnSquareEndIndex
                    ) {
                        rotatedTableResult[originalIndex + 1] = elem; // move right
                    } else if (columnIndex < columnSquareStartIndex) {
                        rotatedTableResult[originalIndex - tableChunkLength] =
                            elem; // move up
                    } else if (columnIndex >= columnSquareEndIndex) {
                        rotatedTableResult[originalIndex + tableChunkLength] =
                            elem; // move down
                    }
                } else if (isLowerPartOfTheTable) {
                    if (
                        columnIndex > columnSquareStartIndex &&
                        columnIndex <= columnSquareEndIndex
                    ) {
                        rotatedTableResult[originalIndex - 1] = elem; // move left
                    } else if (columnIndex <= columnSquareStartIndex) {
                        rotatedTableResult[originalIndex - tableChunkLength] =
                            elem; // move up
                    } else if (columnIndex > columnSquareEndIndex) {
                        rotatedTableResult[originalIndex + tableChunkLength] =
                            elem; // move down
                    }
                } else {
                    // chunk is from the middle of the table
                    const chunkSingularElemIndex = Math.floor(
                        tableChunkLength / 2,
                    );
                    if (columnIndex === chunkSingularElemIndex) {
                        rotatedTableResult[originalIndex] = elem;
                    } else if (columnIndex < chunkSingularElemIndex) {
                        rotatedTableResult[originalIndex - tableChunkLength] =
                            elem; // move up
                    } else if (columnIndex > chunkSingularElemIndex) {
                        rotatedTableResult[originalIndex + tableChunkLength] =
                            elem; // move down
                    }
                }
            });
        });
    } else {
        // even table size
        chunks.forEach((chunk, rowIndex) => {
            const tableLastUpperRowIndex = tableChunkHeight / 2 - 1;

            chunk.forEach((elem, columnIndex) => {
                const originalIndex = rowIndex * tableChunkLength + columnIndex;
                const isUpperPartOfTheTable =
                    rowIndex <= tableLastUpperRowIndex; // chunk is from upper part of the table
                const columnSquareStartIndex = isUpperPartOfTheTable
                    ? rowIndex
                    : tableChunkLength - 1 - rowIndex; // square can mean subsquare as well
                const columnSquareEndIndex = isUpperPartOfTheTable
                    ? tableChunkLength - 1 - rowIndex
                    : rowIndex; // square can mean subsquare as well

                if (isUpperPartOfTheTable) {
                    if (
                        columnIndex >= columnSquareStartIndex &&
                        columnIndex < columnSquareEndIndex
                    ) {
                        rotatedTableResult[originalIndex + 1] = elem; // move right
                    } else if (columnIndex < columnSquareStartIndex) {
                        rotatedTableResult[originalIndex - tableChunkLength] =
                            elem; // move up
                    } else if (columnIndex >= columnSquareEndIndex) {
                        rotatedTableResult[originalIndex + tableChunkLength] =
                            elem; // move down
                    }
                } else {
                    // lower part of the table
                    if (
                        columnIndex > columnSquareStartIndex &&
                        columnIndex <= columnSquareEndIndex
                    ) {
                        rotatedTableResult[originalIndex - 1] = elem; // move left
                    } else if (columnIndex <= columnSquareStartIndex) {
                        rotatedTableResult[originalIndex - tableChunkLength] =
                            elem; // move up
                    } else if (columnIndex > columnSquareEndIndex) {
                        rotatedTableResult[originalIndex + tableChunkLength] =
                            elem; // move down
                    }
                }
            });
        });
    }

    return rotatedTableResult;
};
export const createChunks = (
    data: TableJsonValue,
    chunkSize: number,
): TableChunks => {
    return data.reduce((resultArray: TableChunks, item, index) => {
        const chunkIndex = Math.floor(index / chunkSize);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
    }, []);
};
