interface FilterToggleButtonProps {
    text: string;
    isActive: boolean;
    onClick: () => void;
}

const FilterToggleButton = ({
    text,
    isActive,
    onClick,
}: FilterToggleButtonProps) => {
    return (
        <button
            type="button"
            className={`block mx-auto p-2 text-sm sm:text-base rounded-md transition-all hover:shadow-md ${
                isActive ? "bg-palette-lightbrown" : "bg-gray-200"
            }`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default FilterToggleButton;
