function encodeWithCaesar(string, shift, alphabet = "abcdefghijklmnopqrstuvwxyz")
{
    let encodeString = "";
    shift = shift % alphabet.length;

    for (let index = 0; index < string.length; ++index)
    {
        const indexSymbol = alphabet.indexOf(string[index].toLowerCase()); // Проверка вхождения в алфавит

        if (indexSymbol !== -1)
        {
            let encodeIndex = (alphabet.length + indexSymbol + shift) % alphabet.length;  // Индекс кодируемого элемента

            if (string[index] === string[index].toUpperCase())
                { encodeString += alphabet[encodeIndex].toUpperCase(); }
            else
                { encodeString += alphabet[encodeIndex]; }
        }
        else
            { encodeString += string[index]; }
    }

    return encodeString;
}


function createFreqAnalysis(string, alphabet = new Set("abcdefghijklmnopqrstuvwxyz")) {
    /* Принимает на вход строку и делает её частотный анализ.
     * returns: словарь частот
    */

    let freqAnalysis = {};
    let countLetters = 0;
    for (let index = 0; index < string.length; ++index) {
        if (alphabet.has(string[index])) {
            freqAnalysis[string[index]] = (freqAnalysis[string[index]] ?? 0) + 1;
            countLetters += 1;
        }
    }

    for (let symbol in freqAnalysis) {
        freqAnalysis[symbol] = freqAnalysis[symbol] / countLetters;
    }

    return freqAnalysis;
}


function createNormFactor(analysis, tableFrequencyLang) {
    /* Функция считает сумму разностей квадратов, текущих частот и глобальных.
     * @analysis - частотный анализ текущего текста
     * @tableFrequencyLang - частотный анализ для предполагаемого нами языка
     *
     * @returns - возвращает число, т.е. модуль отклонения от нормы.
    */

    let totalDeviate = 0; // Задается для подсчета общего отклонения всех символов от нормы
    for (let symbol in tableFrequencyLang) { // Основная идея в том, что промашка в более вероятностном числе будет стоит дороже и норма неохотно будет идти к нулю
        totalDeviate += Math.pow((analysis[symbol] ?? 0) - tableFrequencyLang[symbol], 2);
    }
    return totalDeviate;
}


function decodeWithCaesar(string, shift, alphabet = "abcdefghijklmnopqrstuvwxyz")
{
    let decodeString = "";
    shift = shift % alphabet.length;

    for (let index = 0; index < string.length; ++index)
    {
        const indexSymbol = alphabet.indexOf(string[index].toLowerCase());

        if (indexSymbol !== -1)
        {
            let decodeIndex = (alphabet.length + indexSymbol - shift) % alphabet.length;

            if (string[index] === string[index].toUpperCase())
                { decodeString += alphabet[decodeIndex].toUpperCase(); }
            else
                { decodeString += alphabet[decodeIndex]; }
        }
        else
            { decodeString += string[index]; }
    }

    return decodeString;
}


let message = "The quick brown fox jumps over the lazy dog while the sun slowly sets behind" +
           "the distant mountains casting long shadows across the quiet valley where a" +
           "gentle breeze moves through the tall grass and the birds sing their evening" +
           "songs before the darkness settles over the peaceful land";

let message_1 = "Every winter the old lighthouse keeper would climb the narrow spiral stairs just" +
              "before sunset to check that the great lamp was burning steady against the darkening" +
              "horizon many ships depended on that quiet beam of light to find their way safely past the jagged rocks hidden beneath the waves";

let shift = 34
let cipher = encodeWithCaesar(message, shift)


console.log("Исходные данные -->\n=====\n", message, "\n=====\nЗакодированное сообщение -->\n=====\n", cipher, "\n=====\n\n\n");





const tableFrequencyLang = {
    a:0.0817, b:0.0149, c:0.0278, d:0.0425, e:0.1270, f:0.0223,
    g:0.0202, h:0.0609, i:0.0697, j:0.0015, k:0.0077, l:0.0403,
    m:0.0241, n:0.0675, o:0.0751, p:0.0193, q:0.0010, r:0.0599,
    s:0.0633, t:0.0906, u:0.0276, v:0.0098, w:0.0236, x:0.0015,
    y:0.0197, z:0.0007
};


let resultShift;  // Итоговый сдвиг алфавита относительно др.
let resultNormFactor = 100; // Фактор который определят насколько хорошо накладываются наши частоты на преполагаемые идеал 0, отклонение по модулю смотрим.
let currentNormFactor;

let guessDeconde; // Предполагаемая строка ответа, которая будет проверена частотным анализом
let freqAnalysis; // Переменная для хранения текущего анализа для предполагаемого расшифрованного текста

cipher = cipher.toLowerCase()


for (let guessShift = 0; guessShift < 26; guessShift++) {
    guessDeconde = decodeWithCaesar(cipher, guessShift);
    freqAnalysis = createFreqAnalysis(guessDeconde);
    currentNormFactor = createNormFactor(freqAnalysis, tableFrequencyLang);

    if (currentNormFactor < resultNormFactor) {
        resultNormFactor = currentNormFactor;
        resultShift = guessShift;
    }
}

console.log("Лучший сдвиг, который показал наименьшее отклонение по сравнению с оригинальной частотой символов в англ.алф:", resultShift);


























/*
for (let count = 1; count <= alphabet.length; count += 3) {
    console.log(
        decodeWithCaesar(cipher, count),      ` ${count}      `,
        decodeWithCaesar(cipher, count + 1),  ` ${count + 1}      `,
        decodeWithCaesar(cipher, count + 2),  ` ${count + 2}      `
    );
}
*/