import Select from "react-select";

import { Option } from "../../types/ComponentTypes";

interface SelectDropdownProps {
    options: Option[];
    value: Option | null;
    setValue: (value: Option | null) => void;
    isSearchable: boolean;
}

const SelectDropdown = ({
    options,
    value,
    setValue,
    isSearchable,
}: SelectDropdownProps) => {
    return (
        <div>
            <Select
                options={options}
                value={value}
                onChange={(selectedOption) => setValue(selectedOption)}
                isSearchable={isSearchable}
            />
        </div>
    );
};

export default SelectDropdown;
