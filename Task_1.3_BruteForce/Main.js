/**
 * Будет осуществлять поиск через алгоритм грубой силы подстроки в строке,
 * используя хэш-значения, которые будут пересчитан реккурентно,
 * благодаря тому, что мы будем частично использовать старый хэш,
 * с пересчетом только новых символов + удаления старых значений.
 * 
 * @callback TemplateSearchSubstring
 * 
 * @param {string} string - Основной текст
 * @param {string} substring - Шаблон, который нужно найти в {@link string}
 * @returns {Statistics} Массив индексов первых вхождений подстрок из string, совпадающий с substring
 */












// ========= ВСПОМОГАТЕЛЬНЫЕ ОБЪЕКТЫ ==========

class Statistics {
    constructor(matches = 0, collision = 0) {
        this.matches = matches;      // Количество совпадений подстроки
        this.collision = collision;  // Количество коллизий
        this.executingTime = null;   // Время выполнения
        this.arrayIndex = [];        // Массив вхождений
    }

    updateData(matchFlag) {
        this.matches += matchFlag;
        this.collision += (matchFlag) ? (0) : (1);
    }
}

function isEdgeCase(string, substring) {
    return substring.length > string.length
}

/* 1 - searchWithHashSum; 2 - searchWithHashSquareSum; 3 - searchWithHashPolynomSum */
function computingHash(hashString, modeNumber)
{
    let resultHash = 0;
    switch (modeNumber)
    {
        case 1:
            for (let index = 0; index < hashString.length; ++index) {
                resultHash += hashString.charCodeAt(index);
            }
            break;
        case 2:
            for (let index = 0; index < hashString.length; ++index) {
                resultHash += hashString.charCodeAt(index) * hashString.charCodeAt(index);
            }
            break;
        case 3:
            resultHash = 0n; // Указываем что тим BigInt
            for (let index = 0; index < hashString.length; ++index) {
                resultHash += (1n << BigInt(index)) * BigInt(hashString[index].charCodeAt(0));
            }
            break;
    }
    return resultHash;
}

function Timer(targetFunction, param1, param2, param3) {
    const start = performance.now();
    let statisticObj = targetFunction(param1, param2, param3);
    
    statisticObj.executingTime = performance.now() - start;
    return statisticObj;
}














// ========= АЛГОРИТМЫ ==========


/**
 *  Классический алгоритм brute-forse. Основная идея перебора и сравнение с подстрокой,
 *  пока не найдем полное совпадение, при неудачном сравнении смещаемся на 1 символ.
 * 
 * @string - текст для поиска шаблона
 * @substring - шаблон который требуется найти в тексте
 * 
 * @return {Statistics}
 */
function searchBruteForce(string, substring) {
    statisticObj = new Statistics();
    let matchFlag;

    for (let stringIndex = 0; stringIndex < string.length - substring.length; ++stringIndex)
    {
        matchFlag = 1
        for (let substrIndex = 0; substrIndex < substring.length; ++substrIndex) {
            if (substring[substrIndex] !== string[stringIndex + substrIndex]) { matchFlag = 0; break; }
        }

        if (matchFlag === 1) {
            statisticObj.matches += 1;
            statisticObj.arrayIndex.push(stringIndex);
        }
    }
    return statisticObj;
}




/**
 * @type {TemplateSearchSubstring}
 * Вид хэша: сумма всех кодов символов {@link substring}
 */
function searchWithHashSum(string, substring, mode = 1) {
    if (isEdgeCase(string, substring)) { return new Statistics()}

    let statistic = new Statistics(0, 0);
    let matchFlag = 1; // 1 если совпадение, иначе 0 - коллизия
    let substringHash = computingHash(substring, mode);
    let currentHash = computingHash(string.slice(0, substring.length), mode);

    // Обработка первого случая для запуска цикла.
    if (currentHash === substringHash) {
        matchFlag = (substring === string.slice(0, substring.length));
        statistic.updateData(matchFlag);
    }

    for (let globalIndex = 1; globalIndex <= (string.length - substring.length); ++globalIndex)
    {
        matchFlag = 1;
        currentHash += string[globalIndex + substring.length - 1].charCodeAt(0)
                       - string[globalIndex - 1].charCodeAt(0); // Обновляем значение хэша, т.к. 0 уже прорверен

        if (currentHash === substringHash)
        {
            for (let countEquals = 0; countEquals < substring.length; ++countEquals) {
                if (string[globalIndex + countEquals] !== substring[countEquals])
                    { matchFlag = 0; break; }
            }
            statistic.updateData(matchFlag);
            if (matchFlag === 1) {
                statistic.arrayIndex.push(globalIndex);
            }
        }
    }

    return statistic;
}


/**
 * @type {TemplateSearchSubstring}
 * Вид хэша: общая сумма каждого кода символа {@link substring} в квадрате
 */
function searchWithHashSquareSum(string, substring, mode = 2) {
    if (isEdgeCase(string, substring)) { return new Statistics()}

    let statistic = new Statistics(0, 0);
    let matchFlag = 1; // 1 если совпадение, иначе 0 - коллизия
    let substringHash = computingHash(substring, mode);
    let currentHash = computingHash(string.slice(0, substring.length), mode);

    // Обработка первого случая для запуска цикла.
    if (currentHash === substringHash) {
        matchFlag = (substring === string.slice(0, substring.length));
        statistic.updateData(matchFlag);
    }

    for (let globalIndex = 1; globalIndex <= (string.length - substring.length); ++globalIndex)
    {
        matchFlag = 1;
        currentHash += Math.pow(string[globalIndex + substring.length - 1].charCodeAt(0), 2)
                       - Math.pow(string[globalIndex - 1].charCodeAt(0), 2); // Обновляем значение хэша, т.к. 0 уже прорверен

        if (currentHash === substringHash)
        {
            for (let countEquals = 0; countEquals < substring.length; ++countEquals) {
                if (string[globalIndex + countEquals] !== substring[countEquals])
                    { matchFlag = 0; break; }
            }
            statistic.updateData(matchFlag);
            if (matchFlag === 1) {
                statistic.arrayIndex.push(globalIndex);
            }
        }
    }

    return statistic;
}


/**
 * @type {TemplateSearchSubstring}
 * Вид хэша: общая сумма для каждого из {@link substring}, учитывая позицию в виде представления
 *           кода с квантификатором, который дает различие в расположении элементов в {@link substring},
 *           т.е. разбиение значимости букв по их позициям
 */
function searchWithHashPolynomSum(string, substring, mode = 3) {
    if (isEdgeCase(string, substring)) { return new Statistics()}

    let statistic = new Statistics(0, 0);
    let matchFlag = 1; // 1 если совпадение, иначе 0 - коллизия
    let substringHash = computingHash(substring, mode);
    let currentHash = computingHash(string.slice(0, substring.length), mode);

    // Обработка первого случая для запуска цикла.
    if (currentHash === substringHash) {
        matchFlag = (substring === string.slice(0, substring.length));
        statistic.updateData(matchFlag);
    }

    for (let globalIndex = 1; globalIndex <= (string.length - substring.length); ++globalIndex)
    {
        matchFlag = 1;

        currentHash -= BigInt(string[globalIndex - 1].charCodeAt(0));
        currentHash >>= 1n;
        currentHash += (1n << BigInt((substring.length - 1))) * BigInt(string[globalIndex + substring.length - 1].charCodeAt(0));

        if (currentHash === substringHash)
        {
            for (let countEquals = 0; countEquals < substring.length; ++countEquals) {
                if (string[globalIndex + countEquals] !== substring[countEquals])
                    { matchFlag = 0; break; }
            }
            statistic.updateData(matchFlag);
            if (matchFlag === 1) {
                statistic.arrayIndex.push(globalIndex);
            }
        }
    }

    return statistic;
}



// ========= ТЕСТЫ ==========
/* Написать функцию замера времени, т.е. передавая ей текст, чтобы она замеряла его анализ по времени */
const fileStream = require("fs");
let statisticObj;

let texts = ["tome1.txt", "tome12.txt", "tome123.txt", "tome1234.txt", "tome1234.txt", "tome1234.txt", "millionAText.txt", "millionAText.txt"];
let substrings = ["князь", "князь", "князь", "князь", "князь Андрей", "князь Андрей Болконский", "a".repeat(100) + "b", "b" + "a".repeat(100)];



for (let index = 0; index < texts.length; ++index) {
    const text = fileStream.readFileSync(texts[index], "UTF-8");
    statisticObj = Timer(searchBruteForce, text, substrings[index]);

    console.log(`Тест №${index + 1} - {${texts[index]}} - Ищем фрагмент: {${substrings[index]}}\nКоличество вхождений: ${statisticObj.matches}`);
    console.log(`Количество коллизий: ${statisticObj.collision}\nМассив вхождений: ${statisticObj.arrayIndex}\nВремя выполнения: ${statisticObj.executingTime}\n\n\n`);
}