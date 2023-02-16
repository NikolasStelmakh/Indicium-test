import readline from "readline";

export type TableChunks = string[][];

const dialog = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const startDialog = (question: string) => {
    dialog.question(question, (answer: string) => {
        const isValidOutputCsvFileName = answer?.length && /.+(\.csv)$/.test(answer);
        if (isValidOutputCsvFileName) {
            dialog.write(`Result will be written into: ${answer}\n`);

            rotateTable(['1','2','3','4', '5', '6', '7', '8', '9']);

            process.exit(1)
        } else {
            startDialog('The output file name is incorrect, please try again: ')
        }
    })
}

startDialog("Please, add output file name (default is \"output.csv\"): ");

const isOdd = (num: number) => {
    return (num % 2) == 1;
}

export const rotateTable = (data: string[]) => {
    const tableSize = Math.sqrt(data.length);
    let isValid = false;
    if (data.length && Number.isInteger(tableSize)) isValid = true;

    if (!isValid) {
        console.log(`invalid data: index=${1}, data=${JSON.stringify(data)}, returning []`);
        return [];
    }

   const chunks = createChunks(data, tableSize);

    console.log(chunks);


    if (isOdd(tableSize)) {

    } else {

    }
}
const createChunks = (data: string[], tableSize: number): TableChunks => {
    return data.reduce((resultArray: TableChunks, item, index) => {
        const chunkIndex = Math.floor(index/tableSize)

        if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])
}
