import { useRef, useState } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import Select from "./Select";

import { units, getConverter } from "../models/UnitConverters";

// const convertUnits = [
//     'Mililitro',
//     'Litro',
//     'Miligrama',
//     'Grama',
//     'Gota',
//     'Microgota',
//     'Colher de Sopa',
//     'Colher de Sobremesa',
//     'Colher de Chá',
//     'Colher de Café',
// ];

const convertOptions = [
    {
        name: 'Não converter',
        convert: (l, r) => l,
        validate: (l, r) => true
    },
    {
        name: 'Dividir por',
        convert: (l, r) => l / r,
        validate: (l, r) => r !== 0
    },
    {
        name: 'Multiplicar por',
        convert: (l, r) => l * r,
        validate: (l, r) => true
    },
];

const convertOptionNames = convertOptions.map(x => x.name);

const ValueConverter = () => {
    const [converter, setConverter] = useState(convertOptions[0]);

    const valueRef = useRef();
    const selectRef = useRef();
    const resultRef = useRef();
    const converterRef = useRef();

    const inputUnitRef = useRef();
    const resultUnitRef = useRef();

    const handleSelectConverter = () => {
        const selectedOption = selectRef.current.value;
        const selectedConverter = convertOptions.find((option) => {
            return option.name == selectedOption;
        });

        if (selectedConverter === null) {
            console.warn(`A seleção era nula, algo estranho deve ter acontecido.`);
            return;
        }

        setConverter(selectedConverter);

        const inputValue = valueRef.current.value;
        const convertValue = converterRef.current.value;

        if (!selectedConverter.validate(inputValue, convertValue)) {
            console.warn(`Algum dos valores é invalido. ${inputValue} ${selectedOption} ${convertValue}`);
            return;
        }

        let result = selectedConverter.convert(inputValue, convertValue);
        if (Number.isNaN(result)) {
            result = 0;
        }
        resultRef.current.value = result;

        const fromUnit = units.find(x => x.displayName === inputUnitRef.current.value);
        const toUnit = units.find(x => x.displayName === resultUnitRef.current.value);

        console.warn(`from: ${fromUnit.displayName} | to: ${toUnit.displayName}`);

        const converter = getConverter(fromUnit, toUnit);
        if (!converter) {
            console.log(`Possível erro do usuário. Não foi possível achar uma conversão [${fromUnit.displayName} > ${toUnit.displayName}].`);
            return;
        }

        const validateResult = converter.validate(inputValue);

        if (result != validateResult) {
            console.log(`Possível erro do usuário. Estava esperando o resultado ${validateResult} mas a resposta atual é ${result}`);
        }
        else {
            console.log(`A resposta parece estar certa! :)`);
        }

    };

    return (
        <div className="value-converter">
            <div>
                <input ref={valueRef} onChange={handleSelectConverter} type="number" />
                <Select ref={inputUnitRef} selectOptions={units.map(x => x.displayName)} onSelectionChanged={handleSelectConverter} />
            </div>
            <div className={converter !== convertOptions[0] ? '' : 'disabled'}>
                <Select ref={selectRef} selectOptions={convertOptionNames} onSelectionChanged={handleSelectConverter} />
                <input ref={converterRef} onChange={handleSelectConverter} type="number" defaultValue={1} />
            </div>
            <div>
                <input ref={resultRef} type="number" readOnly={true} />
                <Select ref={resultUnitRef} selectOptions={units.map(x => x.displayName)} onSelectionChanged={handleSelectConverter} />
            </div>
        </div>
    )
};

export default ValueConverter;