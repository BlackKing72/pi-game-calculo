import { createRef, useState } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";

const converterOptions = [
    { 
        name: 'Não converter', 
        convert: (l, r) => l,
        validate: (l, r) => true
    },
    { 
        name: 'Dividir', 
        convert: (l, r) => l / r,
        validate: (l, r) => r !== 0
    },
    { 
        name: 'Multiplicar', 
        convert: (l, r) => l * r,
        validate: (l, r) => true
    },
]

const ValueConverter = () => {
    // const [converter, setConverter] = useState(converterOptions[0]);

    const valueRef = createRef();
    const selectRef = createRef();
    const resultRef = createRef();
    const converterRef = createRef();

    const handleSelectConverter = () => {
        const selectedOption = selectRef.current.value;
        const selectedConverter = converterOptions.find((option) => {
            return option.name == selectedOption; }
        );
        
        if (selectedConverter === null) {
            console.warn(`A seleção era nula, algo estranho deve ter acontecido.`);
            return;
        }

        const inputValue = valueRef.current.value;
        const convertValue = converterRef.current.value;

        if (!selectedConverter.validate(inputValue, convertValue)) {
            console.warn(`Algum dos valores é invalido. ${inputValue} ${selectedOption} ${convertValue}`);
            return;
        }

        const result = selectedConverter.convert(inputValue, convertValue);
        
        resultRef.current.value = result;
    };

    return (
        <div className="value-converter">
            <input ref={valueRef} onChange={handleSelectConverter} className="spacing-m" type="number" />
            <div>
                <select ref={selectRef} onChange={handleSelectConverter}>
                    {
                        converterOptions.map(option => (
                            <option value={option.name} >
                                {option.name}
                            </option>
                        ))
                    }
                </select>
                <span>por</span>
                <input ref={converterRef} onChange={handleSelectConverter} className="spacing-m" type="number" />
            </div>
            <input ref={resultRef} type="number" readOnly={true} />
        </div>
    )
};

export default ValueConverter;