
function rleEscapeEncodeString(string, unpack_symbol = "#")
{
    if (string === unpack_symbol) { return `${unpack_symbol}1${unpack_symbol}`; }
    if (string.length <= 1) { return string; }

    let amount = 1;
    let res_sequence = "";

    for (let index = 0; index < string.length - 1; index++)
    {
        if (string[index] === string[index + 1]) // знак строгово равенства, вплоть до типа без приведения "5" != 5
        {
            amount += 1;
        }
        else if (amount >= 2)
        {
            res_sequence += `${unpack_symbol}${amount}${string[index]}`;
            amount = 1;
        }
        else if (string[index] !== unpack_symbol)
        {
            res_sequence += string[index];
        }
        else
        {
            res_sequence += `${unpack_symbol}${amount}${string[index]}`;
        }
    }

    if (amount >= 2 || string[string.length - 1] === unpack_symbol)
        { res_sequence += `${unpack_symbol}${amount}${string[string.length - 1]}`; }
    else { res_sequence += string[string.length - 1]; }

    return res_sequence;
}


function rleEscapeEncode(string, unpack_symbol = "#")
{
    if (string === unpack_symbol) { return [unpack_symbol.charCodeAt(0), 1, unpack_symbol.charCodeAt(0)]; }
    if (string.length === 1) { return [string.charCodeAt(0)]; }
    if (string.length === 0) { return []; }

    let amount = 1;
    let res_bytes = [];

    for (let index = 0; index < string.length - 1; index++)
    {
        if (string[index] === string[index + 1]) // знак строгово равенства, вплоть до типа без приведения "5" != 5
        {
            amount += 1;
        }
        else if (amount >= 2)
        {
            res_bytes.push(unpack_symbol.charCodeAt(0));
            res_bytes.push(amount);
            res_bytes.push(string[index].charCodeAt(0));
            amount = 1;
        }
        else if (string[index] !== unpack_symbol)
        {
            res_bytes.push(string[index].charCodeAt(0));
        }
        else
        {
            res_bytes.push(unpack_symbol.charCodeAt(0));
            res_bytes.push(amount);
            res_bytes.push(string[index].charCodeAt(0));
        }
    }

    if (amount >= 2 || string[string.length - 1] === unpack_symbol)
    {
        res_bytes.push(unpack_symbol.charCodeAt(0));
        res_bytes.push(amount);
        res_bytes.push(string[string.length - 1].charCodeAt(0));
    }
    else { res_bytes.push(string[string.length - 1].charCodeAt(0)); }

    return res_bytes;
}


function rleJumpEncode(string)
{
    if (string.length === 1) { return [1, string.charCodeAt(0)]; }
    if (string.length === 0) { return ""; }

    let group_amount = 1;
    let flag_equal_group = Boolean(string[0] === string[1]);
    let res_byte_seq = [];

    if (!flag_equal_group) { 
        res_byte_seq.push(0);
    }

    for (let index = 0; index < string.length - 1; index++)
    {

        // 1 случай - символы не равны, а флаг эдентичности состояния группы --> true
        if (string[index] !== string[index + 1] && flag_equal_group)
        {
            // console.log(res_byte_seq, index, group_amount); // Проверка символов без кодов
            res_byte_seq.push(-group_amount);
            res_byte_seq.push(string.charCodeAt(index)); // Проверка символов без кодов

            flag_equal_group = false;
            group_amount = 0;
            res_byte_seq.push(0);
        }
        // 2 случай - символы равны, а флаг эдентичночти группы --> false
        else if (string[index] === string[index + 1] && !flag_equal_group) // знак строгово равенства ===, вплоть до типа без приведения "5" == 5 => true, "5" === 5 => false
        {
            //console.log(res_byte_seq, index, group_amount - 1);
            res_byte_seq[res_byte_seq.length - group_amount] += group_amount - 1;
            flag_equal_group = true;
            group_amount = 1;
        }
        // 3 случай - символы не равны и соответственно эдентичность стоит в false
        else if (string[index] !== string[index + 1] && !flag_equal_group)
        {
            res_byte_seq.push(string.charCodeAt(index)); // Всегда принимает класс строки и дает возможность выбора символа для первода в byte // Проверка символов без кодов
        }
        // 4 случай - символы равны и соответственно эдентичность стоит в true
        else
        {
            // Ничего не делаем
        }
        group_amount += 1;
    }


    if (flag_equal_group)
    {
        res_byte_seq.push(-group_amount);
        res_byte_seq.push(string.charCodeAt(string.length - 1));  // Проверка символов без кодов
    }
    else
    {
        res_byte_seq.push(string.charCodeAt(string.length - 1)); // Проверка символов без кодов
        res_byte_seq[res_byte_seq.length - group_amount - 1] += group_amount;
    }

    return res_byte_seq;
}










console.log(rleEscapeEncode("abc"));     // abc
console.log(rleEscapeEncode("aaa"));     // #3a
console.log(); // #3a#2bc#1#
console.log(rleEscapeEncode("#"));       // #1#
console.log(rleEscapeEncode(""));

console.log(rleJumpEncode("abcllasdhlkjgaslkgggggggdfghj"));






const fileSystem = require("fs");  // Файловый модуль
const binaryData1 = Buffer.from(rleEscapeEncode("aaabbc#"));
fileSystem.writeFileSync("encode_escape_rle.bin", binaryData1); 



const binaryData2 = Buffer.from(rleJumpEncode("abclllgyypl"));
fileSystem.writeFileSync("encode_jump_rle.bin", binaryData2);
