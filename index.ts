import readline from "readline";

export type TableChunks = string[][];

const defaultOutputFileName = "output.csv";

const dialog = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const startDialog = (question: string) => {
    dialog.question(question, (answer: string) => {
        const isValidOutputCsvFileName = !answer.length || /.+(\.csv)$/.test(answer);
        answer = answer?.length ? answer : defaultOutputFileName

        if (isValidOutputCsvFileName) {
            dialog.write(`Result will be written into: ${answer}\n`);

            // rotateTable(['1','2','3','4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49']);
            // rotateTable(['1','2','3','4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36']);
            // rotateTable(['1','2','3','4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25']);
            // rotateTable(['1','2','3','4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']);
            // rotateTable(['1','2','3','4', '5', '6', '7', '8', '9']);
            rotateTable(['1','2','3','4']);

            process.exit(1)
        } else {
            startDialog('The output file name is incorrect, please try again: ')
        }
    })
}

startDialog(`Please, add output file name (default is "${defaultOutputFileName}"): `);

const isOdd = (num: number) => {
    return (num % 2) == 1;
}

export const rotateTable = (data: string[]) => {
    const tableChunkLength = Math.sqrt(data.length);
    let isValid = false;
    if (data.length && Number.isInteger(tableChunkLength)) isValid = true;

    if (!isValid) {
        console.log(`invalid data: index=${1}, data=${JSON.stringify(data)}, returning []`);
        return [];
    }

    const chunks = createChunks(data, tableChunkLength);
    const tableChunkHeight = chunks.length; // variable added in case we have non-square table, for example: 4x5 (functional not implemented on 100%, but variable added to make less work in future)

    const rotatedTableResult: string[] = [];

    console.log(chunks);


    if (isOdd(tableChunkLength)) { // odd table size
        chunks.forEach((chunk, rowIndex) => {
            const tableMiddleRowIndex = Math.floor(tableChunkHeight/2);

            chunk.forEach((elem, columnIndex) => {
                const originalIndex = rowIndex * (tableChunkLength) + columnIndex;
                const isUpperPartOfTheTable = rowIndex < tableMiddleRowIndex; // chunk is from upper part of the table
                const isLowerPartOfTheTable = rowIndex > tableMiddleRowIndex; // chunk is from lower part of the table
                const columnSquareStartIndex = isUpperPartOfTheTable ? rowIndex : (tableChunkLength - 1) - rowIndex; // square can mean subsquare as well
                const columnSquareEndIndex = isUpperPartOfTheTable ? (tableChunkLength - 1) - rowIndex : rowIndex; // square can mean subsquare as well

                if (isUpperPartOfTheTable) {
                    if (columnIndex >= columnSquareStartIndex && columnIndex < columnSquareEndIndex) {
                        rotatedTableResult[originalIndex + 1] = elem; // move right
                    } else if (columnIndex < columnSquareStartIndex) {
                        rotatedTableResult[originalIndex - tableChunkLength] = elem; // move up
                    } else if (columnIndex >= columnSquareEndIndex) {
                        rotatedTableResult[originalIndex + tableChunkLength] = elem; // move down
                    }
                } else if (isLowerPartOfTheTable) {
                    if (columnIndex > columnSquareStartIndex && columnIndex <= columnSquareEndIndex) {
                        rotatedTableResult[originalIndex - 1] = elem; // move left
                    } else if (columnIndex <= columnSquareStartIndex) {
                        rotatedTableResult[originalIndex - tableChunkLength] = elem; // move up
                    } else if (columnIndex > columnSquareEndIndex) {
                        rotatedTableResult[originalIndex + tableChunkLength] = elem; // move down
                    }
                } else { // chunk is from the middle of the table
                    const chunkSingularElemIndex = Math.floor(tableChunkLength / 2)
                    if (columnIndex === chunkSingularElemIndex) {
                        rotatedTableResult[originalIndex] = elem;
                    } else if (columnIndex < chunkSingularElemIndex) {
                        rotatedTableResult[originalIndex - tableChunkLength] = elem; // move up
                    } else if (columnIndex > chunkSingularElemIndex) {
                        rotatedTableResult[originalIndex + tableChunkLength] = elem; // move down
                    }
                }
            })
        })
    } else { // even table size
        chunks.forEach((chunk, rowIndex) => {
            const tableLastUpperRowIndex = tableChunkHeight/2 - 1;

            chunk.forEach((elem, columnIndex) => {
                const originalIndex = rowIndex * (tableChunkLength) + columnIndex;
                const isUpperPartOfTheTable = rowIndex <= tableLastUpperRowIndex; // chunk is from upper part of the table
                const columnSquareStartIndex = isUpperPartOfTheTable ? rowIndex : (tableChunkLength - 1) - rowIndex; // square can mean subsquare as well
                const columnSquareEndIndex = isUpperPartOfTheTable ? (tableChunkLength - 1) - rowIndex : rowIndex; // square can mean subsquare as well

                if (isUpperPartOfTheTable) {
                    if (columnIndex >= columnSquareStartIndex && columnIndex < columnSquareEndIndex) {
                        rotatedTableResult[originalIndex + 1] = elem; // move right
                    } else if (columnIndex < columnSquareStartIndex) {
                        rotatedTableResult[originalIndex - tableChunkLength] = elem; // move up
                    } else if (columnIndex >= columnSquareEndIndex) {
                        rotatedTableResult[originalIndex + tableChunkLength] = elem; // move down
                    }
                } else { // lower part of the table
                    if (columnIndex > columnSquareStartIndex && columnIndex <= columnSquareEndIndex) {
                        rotatedTableResult[originalIndex - 1] = elem; // move left
                    } else if (columnIndex <= columnSquareStartIndex) {
                        rotatedTableResult[originalIndex - tableChunkLength] = elem; // move up
                    } else if (columnIndex > columnSquareEndIndex) {
                        rotatedTableResult[originalIndex + tableChunkLength] = elem; // move down
                    }
                }
            })
        })
    }

    console.log(rotatedTableResult)

    return rotatedTableResult
}
const createChunks = (data: string[], chunkSize: number): TableChunks => {
    return data.reduce((resultArray: TableChunks, item, index) => {
        const chunkIndex = Math.floor(index/chunkSize)

        if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])
}
