function createMachineTable(substring) {
    let uniqueSymbols = new Set(substring);
    let machineTable = new Array(substring.length + 1);

    // инициализируем словари внутри массива
    for (let index = 0; index < machineTable.length; ++index) {
        machineTable[index] = new Map();
        
        for (let symbol of uniqueSymbols) {
            machineTable[index].set(symbol, 0);
        }
    }

    let previous; // Переменная для сохранения запасного состояния строки
    for (let index = 0; index < substring.length; ++index) {
        previous = machineTable[index].get(substring[index]); // Запоминаем состояние на текущий момент

        machineTable[index].set(substring[index], index + 1); // Следующее верное состояние при совпадении

        // Прокидываем прошлое состояние на уровень выше, тем самым запоминая его для каждого символа
        for (const symbol of uniqueSymbols) {
            machineTable[index + 1].set(symbol, machineTable[previous].get(symbol));
        }
    }

    return machineTable;
}


let state = 0;
let matches = 0;

let string = "fjjfjffjddfjjffd"
let substring = "ffjd"

// Алгоритм поиска по готовому автомату состояний
let machineTable = createMachineTable(substring);

for (let globalIndex = 0; globalIndex < string.length; ++globalIndex) {
    state = machineTable[state].get(string[globalIndex]) ?? 0; // ?? 0 защита от постороннего символа не встреч. в подстроке

    if (state === substring.length) {
        matches += 1;
    }
}

console.log(`Найдено ${matches} совпадений`);