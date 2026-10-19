/* Стоит сразу обозначить логику построения таблицы.
Во-первых, алгоритм основан на том, что мы будем просматривать элементы совпадения с конца.
Есть два типа элементов, встречающиеся в нашей подсроке поиска и не встречающиеся:
    1) Не встречающиеся символы сразу будут нести наиболее выгодную информацию для нас, т.к. при просмотре с конца,
       мы точно понимаем, что сдвинуть шаблон назад никаким образом нельзя, также очевидно что этот символ вообще можно перепрыгнуть,
       поскольку в подстроке, соответсвенно в ответе его быть не должно
       
    2) Встречающиеся. Тут немного сложнее, сразу нужно понимать, что подстрока может содержать несколько одинаковых символов.
       Соответственно для таких символов была придумана таблица сдвигов, т.е. такие сдвиги для каждого символа, на которые безопасnно
       можно сдвинуть нашу подстроку относительно строки, чтобы не пропустить совпадение подстроки в строке.

       Ну и закономерное решение для конкретного символа совпадения с основным текстом будет таким:
       т.к. расчет идет с конца, то можно взять всю длину нашей подстроки и вычесть из нее порядковых номер нашего символа,
       такого, который находиться как можно ближе к концу*** (ну из той логики, что он нам быстрее попадется если просматривать с конца)
       


(P.S. ***организутеся это за счет цикла, просто последняя буква перетрет значение предпоследней
      **также в переборе не учитываем последний символ подстроки, т.к. он и будет сравниваться с текущим "совпадением" в строке) 

*/

/* !!!
Т.к. equalIndex всегда указывает на начало вхождения, при этом сама строка
полностью совпадает, тогда нам достаточно обратиться к последнему такому же символу
и узнать насколько его можно сдвинуть относительно строки, чтобы мы не успели пропустить
новый такой же символ. В нашем случаем обращение к последнему такому же символу в шаблоне дает понять,
что он хранит число, которое нужно чтобы перешагнуть известные нам символы в подстроке, которые точно не стоит учитывать
*/


function createShiftTable(targetString)
{
    let table = {};
    for (let index = 0; index < targetString.length - 1; ++index) // **
        { table[targetString[index]] = targetString.length - index - 1; }

    return table
}


function searchBoyeraMuraHorspul(substring, string, shiftTable, startIndex)
{
    for (let globalIndex = startIndex + substring.length - 1; globalIndex < string.length;)
    {
        // Случай совпадения крайнего элемента шаблона
        if (string[globalIndex] == substring[substring.length - 1])
        {
            let oldIndex = globalIndex; // Для проверки сдвига, если его не будет, то значит произошло полное совпадение

            for (let equalIndex = 1; equalIndex < substring.length; ++equalIndex) // От 1, т.к. крайний символ шаблона уже совпал.
            {
                if (string[globalIndex - equalIndex] != substring[substring.length - equalIndex - 1])
                {
                    globalIndex += shiftTable[string[globalIndex]] ?? substring.length;
                    break;
                }
            }

            if (globalIndex == oldIndex) { return oldIndex - substring.length + 1; } // Если равны, то полное совпадение с шаблоном
        }
        // Случай не совпадения крайнего элемента шаблона
        else { globalIndex += shiftTable[string[globalIndex]] ?? substring.length; }
    }

    return null;
}


function fullAnalysisBoyeraMuraHorspul(substring, string)
{
    if (substring === "" || string === "") { return []; }

    let shiftTable = createShiftTable(substring);
    let arrayIndex = []; // Массив индексов вхождения

    let equalIndex = 0;
    while (equalIndex < string.length - 1) {
        equalIndex = searchBoyeraMuraHorspul(substring, string, shiftTable, equalIndex);

        if (equalIndex === null) { return arrayIndex; }
        
        arrayIndex.push(equalIndex);
        equalIndex += shiftTable[string[equalIndex]] ?? substring.length; // !!!
    }
    return arrayIndex;
}


// ================ ТЕСТЫ ====================
console.log(fullAnalysisBoyeraMuraHorspul("бойер", "бойербойер бойер абойера"));
console.log(fullAnalysisBoyeraMuraHorspul("bbbbb", "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"));
console.log(fullAnalysisBoyeraMuraHorspul("", ""));
console.log(fullAnalysisBoyeraMuraHorspul("", "................."));
console.log(fullAnalysisBoyeraMuraHorspul("бойер", ""));
console.log(fullAnalysisBoyeraMuraHorspul("lan", "languagelanglan-cablegolang"));
console.log(fullAnalysisBoyeraMuraHorspul("бойер", "01234567 бойер 76543210"));
console.log(fullAnalysisBoyeraMuraHorspul("ana", "banana"));
