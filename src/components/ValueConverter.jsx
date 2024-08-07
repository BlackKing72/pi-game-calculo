
const ValueConverter = () => {
    return (
        <div className="value-converter">
            <input type="number"/>
            <select>
                <option>Dividir</option>
                <option>Multiplicar</option>
                <option>Equivale</option>
            </select>
            <p>por</p>
            <input type="number"/>
            <input type="number" readOnly={true} />
        </div>
    )
};

export default ValueConverter;