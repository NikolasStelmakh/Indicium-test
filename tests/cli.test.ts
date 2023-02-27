import { exec } from 'child_process';
import { describe, test } from '@jest/globals';

describe('Cli.js script.', () => {
    test('Run script', (done) => {
        const startTime = performance.now();

        exec(
            // 'node cli.js input.csv',
            'node cli.js tests/input-big.csv',
            (error, stdout, stderr) => {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);

                const endTime = performance.now();
                console.log(`Cli execution time: ${endTime - startTime} ms`);
                done();
            },
        );
    });
});
