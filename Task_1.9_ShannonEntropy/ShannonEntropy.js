/*
Наша задача описать насколько уникальный у нас используется набор символов в тексте.
Тогда оставляем таблицу частот, также опираемся на нее узнавая коэффициент заполнения всего алфавита.

Только теперь мы берем за основание логирифма количество уникальных символов в тексте,
тогда взяв логирифм от вероятности встречи симвовола, мы по сути узнаем насколько частей X проводилось
дробление нашего алфавита, где X - это основание логарифма (уникальное число символов)
*/

function logCustom(base, expression) {
    // @base - основание логирифма
    return Math.log2(expression) / Math.log2(base);
}

function shannonEntropy(string)
{
    const frequencyDict = {};
    let entropy = 0, countUniqueSymbol = 0;

    for (const letter of string.toLowerCase())
    {
        if (letter in frequencyDict) {
            frequencyDict[letter] += 1;
        }
        else {
            frequencyDict[letter] = 1;
            countUniqueSymbol += 1;
        }
    }

    if (countUniqueSymbol === 1) { return 0; }

    for (const letter in frequencyDict)
    {
        frequencyDict[letter] = frequencyDict[letter] / string.length;
        entropy += frequencyDict[letter] * logCustom(countUniqueSymbol, frequencyDict[letter]); // * Math.log2(1/frequencyDict[letter]);
    }

    return Math.abs(-entropy); // Получаем ответ на вопрос насколько наша строка уникальная
}


console.log(shannonEntropy("Программирование"));
console.log(shannonEntropy("Folder is open"));
console.log(shannonEntropy(""));