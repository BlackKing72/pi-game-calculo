import { forwardRef } from "react";

const Select = forwardRef (function Select({selectOptions, onSelectionChanged}, ref) {
    return (
        <select ref={ref} onChange={onSelectionChanged}>
            {
                selectOptions.map(selectOption => (
                    <option value={selectOption}>{selectOption}</option>
                ))
            }
        </select>
    );
});

export default Select;