import { useState } from "react";
import { IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface AdvancedFilterHeaderTextProps {
    title: string;
    definition: string;
}

const AdvancedFilterHeaderText = ({
    title,
    definition,
}: AdvancedFilterHeaderTextProps) => {
    const [showDefinition, setShowDefinition] = useState(false);
    return (
        <>
            <div className="flex justify-center">
                <h6 className="w-fit my-auto text-lg sm:text-xl">{title}</h6>
                <IconButton onClick={() => setShowDefinition(!showDefinition)}>
                    <InfoOutlinedIcon
                        color={showDefinition ? "action" : "primary"}
                        fontSize="small"
                    />
                </IconButton>
            </div>
            <p
                className={`${
                    !showDefinition && "hidden"
                } mb-2 p-2 text-xs rounded-md bg-gray-200`}
            >
                {definition}
            </p>
        </>
    );
};

export default AdvancedFilterHeaderText;
