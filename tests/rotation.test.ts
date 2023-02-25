import {describe, expect, test} from '@jest/globals';
import {rotateMatrix} from "../src/api";

const tableWithSizeOfSeven = [1, 2 ,3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49];
const tableWithSizeOfSix = [1, 2 ,3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
const tableWithSizeOfFive = [1, 2 ,3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
const tableWithSizeOfFour = [1, 2 ,3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const tableWithSizeOfThree = [1, 2 ,3, 4, 5, 6, 7, 8, 9];
const tableWithSizeOfTwo = [1, 2 ,3, 4];
const tableWithSizeOfOne = [1];

test('Rotation, size = 1', () => {
    expect(JSON.stringify(rotateMatrix(tableWithSizeOfOne, 1))).toBe(JSON.stringify([1]));
});
test('Rotation, size = 2', () => {
    expect(JSON.stringify(rotateMatrix(tableWithSizeOfTwo, 1))).toBe(JSON.stringify([3,1,4,2]));
});
test('Rotation, size = 3', () => {
    expect(JSON.stringify(rotateMatrix(tableWithSizeOfThree, 1))).toBe(JSON.stringify([4,1,2,7,5,3,8,9,6]));
});
test('Rotation, size = 4', () => {
    expect(JSON.stringify(rotateMatrix(tableWithSizeOfFour, 1))).toBe(JSON.stringify([5,1,2,3,9,10,6,4,13,11,7,8,14,15,16,12]));
});
test('Rotation, size = 5', () => {
    expect(JSON.stringify(rotateMatrix(tableWithSizeOfFive, 1))).toBe(JSON.stringify([6,1,2,3,4,11,12,7,8,5,16,17,13,9,10,21,18,19,14,15,22,23,24,25,20]));
});
test('Rotation, size = 6', () => {
    expect(JSON.stringify(rotateMatrix(tableWithSizeOfSix, 1))).toBe(JSON.stringify([7,1,2,3,4,5,13,14,8,9,10,6,19,20,21,15,11,12,25,26,22,16,17,18,31,27,28,29,23,24,32,33,34,35,36,30]));
});
test('Rotation, size = 7', () => {
    expect(JSON.stringify(rotateMatrix(tableWithSizeOfSeven, 1))).toBe(JSON.stringify([8,1,2,3,4,5,6,15,16,9,10,11,12,7,22,23,24,17,18,13,14,29,30,31,25,19,20,21,36,37,32,33,26,27,28,43,38,39,40,41,34,35,44,45,46,47,48,49,42]));
});
