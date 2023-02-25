export const isOdd = (num: number) => {
    return num % 2 === 1;
};

export const csvFileExtensionRegex = /.+(\.csv)$/;

export const isNumber = (value: any) => {
    return typeof value === 'number' && isFinite(value);
}


