import * as readline from 'readline';
import { executeTransformation } from './src/api';
import { csvFileExtensionRegex } from './src/helpers';

const defaultSourceFileName = 'input.csv';

const dialog = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const startDialog = (question: string) => {
    try {
        const sourceFileName = process.argv[2];

        if (
            sourceFileName?.length &&
            !csvFileExtensionRegex.test(sourceFileName)
        ) {
            console.log('Incorrect input file name.');
            process.exit(1);
        }

        if (!sourceFileName?.length) {
            dialog.question(question, (answer: string) => {
                const isValidOutputCsvFileName =
                    !answer.length || csvFileExtensionRegex.test(answer);
                answer = answer?.length ? answer : defaultSourceFileName;

                if (isValidOutputCsvFileName) {
                    dialog.write(`Source file name: ${answer}\n`);

                    executeTransformation(answer);
                } else {
                    startDialog(
                        'Source file name is incorrect, please try again: ',
                    );
                }
            });
        } else {
            executeTransformation(sourceFileName);
        }
    } catch (e: any) {
        console.log('Something went wrong:');
        console.log(e.stack);
        process.exit(1);
    }
};

startDialog(
    `Please, type input file name (default is "${defaultSourceFileName}"): `,
);
