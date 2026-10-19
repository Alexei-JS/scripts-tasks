exit                             -- завершение программы


input address                     -- считывает в адрес a значение из консоли
output address                    -- отправляет значение адреса в консоль


writedata value address           -- записывает по адресу а значение value
goto cond address                  -- если cond == 1 или больше, то переходим по адресу address
                                                                 иначе не переходим на адрес address
add main_address other_address     -- вычисляет сумму значений адресов, результат в main_a
sub main_address value            -- !!! вычитает число value из значения по адресу main_a !!!
mul main_address other_address     -- умножает значения адресов и записывает их в main_a


min address1 adress2 main_adress    -- ищет минимум из значений a1 и a2, результат в main_a
                                      также main_a всегда будет добавлять +1 к результату


isGeneralDiv address1 address2 div main_address -- записывает 1 если a1 и a2 деляться на div
                                            0 в любом другом случае

                            
