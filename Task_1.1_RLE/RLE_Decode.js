const fileSystem = require("fs");

function rleEscapeDecodeFile(fileName, unpack_symbol = "#")
{
    const buffer = fileSystem.readFileSync(fileName);

    let resString = "";

    for (let index = 0; index < buffer.length; ++index)
    {
        if (buffer[index] === unpack_symbol.charCodeAt(0))
        {
            resString += String.fromCodePoint(buffer[index + 2]).repeat(buffer[index + 1]);
            index += 2;
        }
        else
        {
            resString += String.fromCodePoint(buffer[index]);
        }
    }

    return resString;
}


function rleJumpDecodeFile(fileName)
{
    const buffer = fileSystem.readFileSync(fileName);

    let resString = "";

    for (let index = 0; index < buffer.length; ++index)
    {
        const signed = buffer.readInt8(index); // Чтение со знаком

        if (signed < 0)
        {
            resString += String.fromCodePoint(buffer[index + 1]).repeat(Math.abs(signed));
            index += 1;
        }
        else
        {
            for (let count = 1; count <= signed; ++count)
            {
                resString += String.fromCodePoint(buffer[index + count]);
            }
            index += signed;
        }
    }

    return resString;
}



console.log(rleEscapeDecodeFile("encode_escape_rle.bin"));
console.log(rleJumpDecodeFile("encode_jump_rle.bin"));