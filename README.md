# Matrix-rotation

 `Cli` works as expected, execution covers all table sizes (limited only by javascript engine limitations. To improve this, could be used any library (like `big.js`) that makes calculations by using `String` instead of `Number`).<br />
 Input data is read by using stream from the .csv file (`input.csv` if you leave the argument empty and don't answer the question) and written to stdout.

# Setup

1) Install packages: run `npm install` in terminal.
2) Create build from ts files: run `npm run build:webpack` in terminal.

# Run
To run cli, you can do in two ways:
1) Use ts-node by running `npm run cli input.csv`.
2) Run `node cli.js input.csv`.

# Test
There are several examples of different table sizes. </br>
`npm run test`

# Task Description
![description](./visual-description.png)
