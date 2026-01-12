interface DefinitionTextProps {
    text: string;
}

const DefinitionText = ({ text }: DefinitionTextProps) => {
    return <p className="mb-2 p-2 text-xs rounded-md bg-gray-200">{text}</p>;
};

export default DefinitionText;
