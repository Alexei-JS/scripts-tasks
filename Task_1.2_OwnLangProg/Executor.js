const streamObj = require("fs");
const readLineSync = require("readline-sync");


function startCompilation(filename, linkRAM, streamObj) {
    /* Заполнения нашей памяти linkRAM командами из импровизированного языка программирования.
     * Далее будет интерпретация команд для исполнения в "VM" (JS), которая поочередно будет выполнять команды.
     *
     * @filename  -- имя файла, который нужно открыть или путь если он в др. директории.
     * @streamObj -- объект для считывания файла.
     * @linkRAM   -- ссылка на нашу импровизированную память для хранения от 0 до 99 команд, от 100 данных.
     * 
     * @returns   -- при успешном завершении 0, в противном случае -1 ошибка компиляции.
    */
    const fileStream = streamObj.readFileSync(filename, "UTF-8").split('\n');
    let command;
    let params;
    let ptrInstruction = 0;

    const oneParam = new Set(["input", "output"]);
    const twoParams = new Set(["writedata", "goto", "add", "sub", "mul"]);

    for (const line of fileStream) {
        if (line == "exit" || line == "") { linkRAM[ptrInstruction] = "exit"; return 0; }

        command = line.slice(0, line.indexOf(' '));
        params = line.slice(line.indexOf(' ') + 1).trim().split(' '); // убираем \n с конца строки
        linkRAM[ptrInstruction++] = command;


        if (oneParam.has(command)) {
            linkRAM[ptrInstruction++] = Number(params[0]);
        }
        else if (twoParams.has(command)) {
            linkRAM[ptrInstruction++] = Number(params[0]);
            linkRAM[ptrInstruction++] = Number(params[1]);
        }
        else if (command == "min") {
            linkRAM[ptrInstruction++] = Number(params[0]);
            linkRAM[ptrInstruction++] = Number(params[1]);
            linkRAM[ptrInstruction++] = Number(params[2]);
        }
        else if (command == "isGeneralDiv") {
            linkRAM[ptrInstruction++] = Number(params[0]);
            linkRAM[ptrInstruction++] = Number(params[1]);
            linkRAM[ptrInstruction++] = Number(params[2]);
            linkRAM[ptrInstruction++] = Number(params[3]);
        }
        else {
            console.log("Error: -->", command);
            console.log("\n==================\nОшибка компиляции\n==================\n\n");
            return -1;
        }
    }
    linkRAM[ptrInstruction] = "exit";
    return 0;
}


function startExecutorProgram(RAM, readLineSync) {
    let ptrRAM = 0;
    while (RAM[ptrRAM] != "exit")
    {
        switch (RAM[ptrRAM])
        {
            case "input":
                RAM[RAM[ptrRAM + 1]] = parseInt(readLineSync.question("Введи число: "));
                ptrRAM += 2;
                continue;
            
            case "output":
                console.log(RAM[RAM[ptrRAM + 1]]);
                ptrRAM += 2;
                continue;
            
            case "writedata":
                RAM[RAM[ptrRAM + 2]] = RAM[ptrRAM + 1];
                ptrRAM += 3;
                continue;
            
            case "goto":
                if (RAM[RAM[ptrRAM + 1]] >= 1) { ptrRAM = RAM[ptrRAM + 2]}
                else { ptrRAM += 3; }
                continue;
            
            case "add":
                RAM[RAM[ptrRAM + 1]] += RAM[RAM[ptrRAM + 2]];
                ptrRAM += 3;
                continue;

            case "sub":
                RAM[RAM[ptrRAM + 1]] -= RAM[ptrRAM + 2];
                ptrRAM += 3;
                continue;

            case "mul":
                RAM[RAM[ptrRAM + 1]] *= RAM[RAM[ptrRAM + 2]];
                ptrRAM += 3;
                continue;
            
            case "min":
                RAM[RAM[ptrRAM + 3]] = Math.min(RAM[RAM[ptrRAM + 1]], RAM[RAM[ptrRAM + 2]]) + 1;
                ptrRAM += 4;
                continue;

            case "isGeneralDiv":
                RAM[RAM[ptrRAM + 4]] = ((RAM[RAM[ptrRAM + 1]] % RAM[RAM[ptrRAM + 3]]) !== 0);
                RAM[RAM[ptrRAM + 4]] ||= ((RAM[RAM[ptrRAM + 2]] % RAM[RAM[ptrRAM + 3]]) !== 0);
                RAM[RAM[ptrRAM + 4]] = Number(RAM[RAM[ptrRAM + 4]]);
                ptrRAM += 5;
                continue;
        }
    }
}




/* ====== Основной ход программы ====== */
let programChoice = ["add-program.txt", "factorial-program.txt", "gcd-program.txt"];
let RAM = [];
if (startCompilation(programChoice[0], RAM, streamObj) == -1) {
    process.exit(0); // Выходим из программы, получая сообщение через консоль в процедуре.
}

console.log("Память до исполнения:\n=========\n", RAM, "\n=========\n\n");
startExecutorProgram(RAM, readLineSync);
console.log("\n\nПамять после исполнения:\n=========\n", RAM, "\n=========\n\n");