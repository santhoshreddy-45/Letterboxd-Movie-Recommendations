import { useContext, useEffect, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import TuneIcon from "@mui/icons-material/Tune";
import { AiOutlineClose } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";

import DefinitionModal from "./Modals/DefinitionModal";
import DefinitionText from "./Text/DefinitionText";
import FilterToggleButton from "./Buttons/FilterToggleButton";
import HorizontalDivider from "./Layout/HorizontalDivider";
import MultiSelectDropdown from "./Selection/MultiSelectDropdown";
import SelectDropdown from "./Selection/SelectDropdown";

import { MovieFilterContext } from "../contexts/MovieFilterContext";

import useIsScreenMd from "../hooks/useIsScreenMd";
import useScrollLock from "../hooks/useScrollLock";

const filterPresetOptions = [
    { label: "None", value: "none" },
    { label: "Animania", value: "animania" },
    { label: "Classic Cinema", value: "classic_cinema" },
    { label: "Date Night", value: "date_night" },
    { label: "Educational", value: "educational" },
    { label: "Epic Films", value: "epic_films" },
    { label: "Family Night", value: "family_night" },
    { label: "Hidden Gems", value: "hidden_gems" },
    { label: "Horror Night", value: "horror_night" },
];

const genreOptions = [
    { label: "Action", value: "action" },
    { label: "Adventure", value: "adventure" },
    { label: "Animation", value: "animation" },
    { label: "Comedy", value: "comedy" },
    { label: "Crime", value: "crime" },
    {
        label: "Documentary",
        value: "documentary",
    },
    { label: "Drama", value: "drama" },
    { label: "Family", value: "family" },
    { label: "Fantasy", value: "fantasy" },
    { label: "History", value: "history" },
    { label: "Horror", value: "horror" },
    { label: "Music", value: "music" },
    { label: "Mystery", value: "mystery" },
    { label: "Romance", value: "romance" },
    {
        label: "Science Fiction",
        value: "science_fiction",
    },
    { label: "TV Movie", value: "tv_movie" },
    { label: "Thriller", value: "thriller" },
    { label: "War", value: "war" },
    { label: "Western", value: "western" },
];

const contentTypeOptions = [
    { label: "Movie", value: "movie" },
    { label: "TV", value: "tv" },
];

const popularityOptions = [
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
];

const filterDefinitions = {
    "Filter Preset":
        "Applies preset filters that are useful for common film-watching scenarios, settings, and moods.",
    Genres: "Filters by genre. Movies can usually be recommended if any of its genres are selected. Animation, documentary, and horror genres will only be recommended if selected. Movies whose only genre is music are excluded by default.",
    "Content Types":
        "Filters by content type. The options are movie and TV, as defined by TMDB. Movies are recommended by default.",
    "Release Year":
        "Filters by release year. Includes movies that were released within the specified range (inclusive).",
    Runtime:
        "Filters by runtime (minutes). Includes movies that have a runtime within the specified range (inclusive).",
    Popularity:
        "Filters by popularity, based on the number of Letterboxd ratings. Low includes movies with less than 25,000 ratings, medium includes movies with 25,000-100,000 ratings, and high includes movies with more than 100,000 ratings. More popular movies are considered by default.",
};

interface FiltersProps {
    allowRewatches: boolean;
}

const Filters = ({ allowRewatches }: FiltersProps) => {
    const context = useContext(MovieFilterContext);
    if (!context) {
        throw new Error(
            "Movie filters must be used within a MovieFilterProvider"
        );
    }
    const [state, dispatch] = context;

    const isScreenMd = useIsScreenMd();

    const presetHandler = (presetValue: string) => {
        switch (presetValue) {
            case "animania":
                dispatch({ type: "setAnimaniaPreset" });
                break;
            case "classic_cinema":
                dispatch({ type: "setClassicCinemaPreset" });
                break;
            case "date_night":
                dispatch({ type: "setDateNightPreset" });
                break;
            case "educational":
                dispatch({ type: "setEducationalPreset" });
                break;
            case "epic_films":
                dispatch({ type: "setEpicFilmsPreset" });
                break;
            case "family_night":
                dispatch({ type: "setFamilyNightPreset" });
                break;
            case "hidden_gems":
                dispatch({ type: "setHiddenGemsPreset" });
                break;
            case "horror_night":
                dispatch({ type: "setHorrorNightPreset" });
                break;
            case "none":
                dispatch({ type: "reset" });
                break;
            default:
                break;
        }
    };

    const [smallFilterDrawerOpen, setSmallFilterDrawerOpen] = useState(false);
    const [mediumFilterDrawerOpen, setMediumFilterDrawerOpen] = useState(false);
    useEffect(() => {
        if (isScreenMd) {
            closeSmallFilterDrawer();
        }
    }, [isScreenMd]);
    useScrollLock(smallFilterDrawerOpen);

    const resetFilters = () => {
        dispatch({
            type: "reset",
        });
    };

    const [filterDefinitionsOpen, setFilterDefinitionsOpen] = useState({
        genres: false,
        contentTypes: false,
        popularity: false,
        releaseYear: false,
        runtime: false,
    });

    const closeSmallFilterDrawer = () => {
        setFilterDefinitionsOpen({
            genres: false,
            contentTypes: false,
            popularity: false,
            releaseYear: false,
            runtime: false,
        });
        setSmallFilterDrawerOpen(false);
    };
    return (
        <div className="w-fit mx-auto mt-8 flex flex-col">
            <div className="w-64 sm:w-96 md:w-128 mx-auto md:flex md:flex-col space-y-4">
                {/* Filter Preset */}
                <div className="w-48 mx-auto">
                    <div className="flex justify-center">
                        <h6 className="w-fit my-auto text-lg sm:text-xl">
                            Filter Preset
                        </h6>
                        <DefinitionModal
                            title={"Filter Preset"}
                            definition={filterDefinitions["Filter Preset"]}
                        />
                    </div>
                    <SelectDropdown
                        options={filterPresetOptions}
                        value={state.filterPreset}
                        setValue={(selectedOption) => {
                            if (!selectedOption) {
                                return;
                            }
                            dispatch({
                                type: "setFilterPreset",
                                payload: {
                                    filterPreset: selectedOption,
                                },
                            });
                            presetHandler(selectedOption.value);
                        }}
                        isSearchable={false}
                    />
                </div>

                {/* Filter Tags */}
                <div className="w-fit lg:max-w-[500px] mx-auto flex flex-col md:flex-row flex-wrap items-center gap-2">
                    <FilterToggleButton
                        text="Highly Rated"
                        isActive={state.highlyRated}
                        onClick={() =>
                            dispatch({
                                type: "setHighlyRated",
                                payload: {
                                    highlyRated: !state.highlyRated,
                                },
                            })
                        }
                    />
                    <FilterToggleButton
                        text="Include Watchlist"
                        isActive={state.includeWatchlist}
                        onClick={() =>
                            dispatch({
                                type: "setIncludeWatchlist",
                                payload: {
                                    includeWatchlist: !state.includeWatchlist,
                                },
                            })
                        }
                    />
                    {allowRewatches && (
                        <FilterToggleButton
                            text="Allow Rewatches"
                            isActive={state.allowRewatches}
                            onClick={() =>
                                dispatch({
                                    type: "setAllowRewatches",
                                    payload: {
                                        allowRewatches: !state.allowRewatches,
                                    },
                                })
                            }
                        />
                    )}
                </div>

                <HorizontalDivider color="darkbrown" />

                {/* Filters - Medium+ Screen */}
                <button
                    className="hidden md:block mx-auto p-2 text-lg sm:text-xl rounded-md hover:shadow-md bg-gray-200 hover:bg-palette-lightbrown"
                    type="button"
                    onClick={() =>
                        setMediumFilterDrawerOpen(!mediumFilterDrawerOpen)
                    }
                >
                    Advanced Filters{" "}
                    {mediumFilterDrawerOpen ? (
                        <ArrowDropUpIcon />
                    ) : (
                        <ArrowDropDownIcon />
                    )}
                </button>
                <AnimatePresence>
                    {mediumFilterDrawerOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                            }}
                            className="hidden md:flex md:flex-col space-y-4"
                        >
                            <div className="flex flex-row flex-wrap gap-2 justify-around">
                                <div className="w-48">
                                    <div className="flex justify-center">
                                        <h6 className="w-fit my-auto text-lg sm:text-xl">
                                            Genres
                                        </h6>
                                        <DefinitionModal
                                            title={"Genres"}
                                            definition={
                                                filterDefinitions["Genres"]
                                            }
                                        />
                                    </div>
                                    <MultiSelectDropdown
                                        options={genreOptions}
                                        label="Select.."
                                        values={state.genres}
                                        setValues={(selectedOptions) =>
                                            selectedOptions &&
                                            dispatch({
                                                type: "setGenres",
                                                payload: {
                                                    genres: selectedOptions,
                                                },
                                            })
                                        }
                                        disableSearch={true}
                                    />
                                </div>
                                <div className="w-48">
                                    <div className="flex justify-center">
                                        <h6 className="w-fit my-auto text-lg sm:text-xl">
                                            Content Types
                                        </h6>
                                        <DefinitionModal
                                            title={"Content Types"}
                                            definition={
                                                filterDefinitions[
                                                    "Content Types"
                                                ]
                                            }
                                        />
                                    </div>
                                    <MultiSelectDropdown
                                        options={contentTypeOptions}
                                        label="Select.."
                                        values={state.contentTypes}
                                        setValues={(selectedOptions) =>
                                            selectedOptions &&
                                            dispatch({
                                                type: "setContentTypes",
                                                payload: {
                                                    contentTypes:
                                                        selectedOptions,
                                                },
                                            })
                                        }
                                        disableSearch={true}
                                    />
                                </div>
                                <div className="w-48">
                                    <div className="flex justify-center">
                                        <h6 className="w-fit my-auto text-lg sm:text-xl">
                                            Release Year
                                        </h6>
                                        <DefinitionModal
                                            title={"Release Year"}
                                            definition={
                                                filterDefinitions[
                                                    "Release Year"
                                                ]
                                            }
                                        />
                                    </div>
                                    <div className="mt-2 flex justify-around">
                                        <input
                                            className="w-20 text-center border-2 border-gray-300 rounded-md"
                                            type="text"
                                            value={state.minReleaseYear}
                                            onChange={(event) =>
                                                dispatch({
                                                    type: "setMinReleaseYear",
                                                    payload: {
                                                        minReleaseYear:
                                                            event.target.value,
                                                    },
                                                })
                                            }
                                        />
                                        <p>to</p>
                                        <input
                                            className="w-20 text-center border-2 border-gray-300 rounded-md"
                                            type="text"
                                            value={state.maxReleaseYear}
                                            onChange={(event) =>
                                                dispatch({
                                                    type: "setMaxReleaseYear",
                                                    payload: {
                                                        maxReleaseYear:
                                                            event.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="w-48">
                                    <div className="flex justify-center">
                                        <h6 className="w-fit my-auto text-lg sm:text-xl">
                                            Runtime
                                        </h6>
                                        <DefinitionModal
                                            title={"Runtime"}
                                            definition={
                                                filterDefinitions["Runtime"]
                                            }
                                        />
                                    </div>
                                    <div className="mt-2 flex justify-around">
                                        <input
                                            className="w-20 text-center border-2 border-gray-300 rounded-md"
                                            type="text"
                                            value={state.minRuntime}
                                            onChange={(event) =>
                                                dispatch({
                                                    type: "setMinRuntime",
                                                    payload: {
                                                        minRuntime:
                                                            event.target.value,
                                                    },
                                                })
                                            }
                                        />
                                        <p>to</p>
                                        <input
                                            className="w-20 text-center border-2 border-gray-300 rounded-md"
                                            type="text"
                                            value={state.maxRuntime}
                                            onChange={(event) =>
                                                dispatch({
                                                    type: "setMaxRuntime",
                                                    payload: {
                                                        maxRuntime:
                                                            event.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="w-48">
                                    <div className="flex justify-center">
                                        <h6 className="w-fit my-auto text-lg sm:text-xl">
                                            Popularity
                                        </h6>
                                        <DefinitionModal
                                            title={"Popularity"}
                                            definition={
                                                filterDefinitions["Popularity"]
                                            }
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <MultiSelectDropdown
                                            options={popularityOptions}
                                            label="Select.."
                                            values={state.popularity}
                                            setValues={(selectedOptions) =>
                                                selectedOptions &&
                                                dispatch({
                                                    type: "setPopularity",
                                                    payload: {
                                                        popularity:
                                                            selectedOptions,
                                                    },
                                                })
                                            }
                                            disableSearch={true}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                className="block mx-auto p-2 rounded-md hover:shadow-md bg-gray-200 hover:bg-palette-lightbrown"
                                type="reset"
                                onClick={resetFilters}
                            >
                                Reset Filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filters - Small- Screen */}
                <button
                    className="block md:hidden mx-auto p-2 text-lg sm:text-xl rounded-md hover:shadow-md bg-gray-200 hover:bg-palette-lightbrown"
                    type="button"
                    onClick={() =>
                        setSmallFilterDrawerOpen(!smallFilterDrawerOpen)
                    }
                >
                    Advanced Filters <TuneIcon />
                </button>
                <AnimatePresence>
                    {smallFilterDrawerOpen && (
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="md:hidden fixed inset-0 z-[2000] overflow-y-auto overscroll-contain pb-8 flex flex-col space-y-4 shadow-md bg-white"
                        >
                            <div className="sticky top-0 flex justify-end">
                                <AiOutlineClose
                                    className="mr-4 hover:cursor-pointer hover:text-palette-darkbrown"
                                    size={32}
                                    onClick={() => closeSmallFilterDrawer()}
                                />
                            </div>
                            <button
                                className="block mx-auto p-2 rounded-md hover:shadow-md bg-gray-200 hover:bg-palette-lightbrown"
                                type="reset"
                                onClick={resetFilters}
                            >
                                Reset Filters
                            </button>
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-48">
                                    <div className="flex justify-center">
                                        <h6 className="w-fit my-auto text-lg sm:text-xl">
                                            Genres
                                        </h6>
                                        <IconButton
                                            onClick={() =>
                                                setFilterDefinitionsOpen(
                                                    (prev) => ({
                                                        ...prev,
                                                        genres: !prev.genres,
                                                    })
                                                )
                                            }
                                        >
                                            <InfoOutlinedIcon
                                                color={
                                                    filterDefinitionsOpen.genres
                                                        ? "action"
                                                        : "primary"
                                                }
                                                fontSize="small"
                                            />
                                        </IconButton>
                                    </div>
                                    {filterDefinitionsOpen.genres && (
                                        <DefinitionText
                                            text={filterDefinitions["Genres"]}
                                        />
                                    )}
                                    <MultiSelectDropdown
                                        options={genreOptions}
                                        label="Select.."
                                        values={state.genres}
                                        setValues={(selectedOptions) =>
                                            selectedOptions &&
                                            dispatch({
                                                type: "setGenres",
                                                payload: {
                                                    genres: selectedOptions,
                                                },
                                            })
                                        }
                                        disableSearch={true}
                                    />
                                </div>
                                <div className="w-48">
                                    <div className="flex justify-center">
                                        <h6 className="w-fit my-auto text-lg sm:text-xl">
                                            Content Types
                                        </h6>
                                        <IconButton
                                            onClick={() =>
                                                setFilterDefinitionsOpen(
                                                    (prev) => ({
                                                        ...prev,
                                                        contentTypes:
                                                            !prev.contentTypes,
                                                    })
                                                )
                                            }
                                        >
                                            <InfoOutlinedIcon
                                                color={
                                                    filterDefinitionsOpen.contentTypes
                                                        ? "action"
                                                        : "primary"
                                                }
                                                fontSize="small"
                                            />
                                        </IconButton>
                                    </div>
                                    {filterDefinitionsOpen.contentTypes && (
                                        <DefinitionText
                                            text={
                                                filterDefinitions[
                                                    "Content Types"
                                                ]
                                            }
                                        />
                                    )}
                                    <MultiSelectDropdown
                                        options={contentTypeOptions}
                                        label="Select.."
                                        values={state.contentTypes}
                                        setValues={(selectedOptions) =>
                                            selectedOptions &&
                                            dispatch({
                                                type: "setContentTypes",
                                                payload: {
                                                    contentTypes:
                                                        selectedOptions,
                                                },
                                            })
                                        }
                                        disableSearch={true}
                                    />
                                </div>
                                <div className="w-48">
                                    <div className="flex justify-center">
                                        <h6 className="w-fit my-auto text-lg sm:text-xl">
                                            Popularity
                                        </h6>
                                        <IconButton
                                            onClick={() =>
                                                setFilterDefinitionsOpen(
                                                    (prev) => ({
                                                        ...prev,
                                                        popularity:
                                                            !prev.popularity,
                                                    })
                                                )
                                            }
                                        >
                                            <InfoOutlinedIcon
                                                color={
                                                    filterDefinitionsOpen.popularity
                                                        ? "action"
                                                        : "primary"
                                                }
                                                fontSize="small"
                                            />
                                        </IconButton>
                                    </div>
                                    {filterDefinitionsOpen.popularity && (
                                        <DefinitionText
                                            text={
                                                filterDefinitions["Popularity"]
                                            }
                                        />
                                    )}
                                    <div className="mt-2">
                                        <MultiSelectDropdown
                                            options={popularityOptions}
                                            label="Select.."
                                            values={state.popularity}
                                            setValues={(selectedOptions) =>
                                                selectedOptions &&
                                                dispatch({
                                                    type: "setPopularity",
                                                    payload: {
                                                        popularity:
                                                            selectedOptions,
                                                    },
                                                })
                                            }
                                            disableSearch={true}
                                        />
                                    </div>
                                </div>
                                <div className="w-48">
                                    <div className="flex justify-center">
                                        <h6 className="w-fit my-auto text-lg sm:text-xl">
                                            Release Year
                                        </h6>
                                        <IconButton
                                            onClick={() =>
                                                setFilterDefinitionsOpen(
                                                    (prev) => ({
                                                        ...prev,
                                                        releaseYear:
                                                            !prev.releaseYear,
                                                    })
                                                )
                                            }
                                        >
                                            <InfoOutlinedIcon
                                                color={
                                                    filterDefinitionsOpen.releaseYear
                                                        ? "action"
                                                        : "primary"
                                                }
                                                fontSize="small"
                                            />
                                        </IconButton>
                                    </div>
                                    {filterDefinitionsOpen.releaseYear && (
                                        <DefinitionText
                                            text={
                                                filterDefinitions[
                                                    "Release Year"
                                                ]
                                            }
                                        />
                                    )}
                                    <div className="mt-2 flex justify-around">
                                        <input
                                            className="w-20 text-center border-2 border-gray-300 rounded-md"
                                            type="text"
                                            value={state.minReleaseYear}
                                            onChange={(event) =>
                                                dispatch({
                                                    type: "setMinReleaseYear",
                                                    payload: {
                                                        minReleaseYear:
                                                            event.target.value,
                                                    },
                                                })
                                            }
                                        />
                                        <p>to</p>
                                        <input
                                            className="w-20 text-center border-2 border-gray-300 rounded-md"
                                            type="text"
                                            value={state.maxReleaseYear}
                                            onChange={(event) =>
                                                dispatch({
                                                    type: "setMaxReleaseYear",
                                                    payload: {
                                                        maxReleaseYear:
                                                            event.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="w-48">
                                    <div className="flex justify-center">
                                        <h6 className="w-fit my-auto text-lg sm:text-xl">
                                            Runtime
                                        </h6>
                                        <IconButton
                                            onClick={() =>
                                                setFilterDefinitionsOpen(
                                                    (prev) => ({
                                                        ...prev,
                                                        runtime: !prev.runtime,
                                                    })
                                                )
                                            }
                                        >
                                            <InfoOutlinedIcon
                                                color={
                                                    filterDefinitionsOpen.runtime
                                                        ? "action"
                                                        : "primary"
                                                }
                                                fontSize="small"
                                            />
                                        </IconButton>
                                    </div>
                                    {filterDefinitionsOpen.runtime && (
                                        <DefinitionText
                                            text={filterDefinitions["Runtime"]}
                                        />
                                    )}
                                    <div className="mt-2 flex justify-around">
                                        <input
                                            className="w-20 text-center border-2 border-gray-300 rounded-md"
                                            type="text"
                                            value={state.minRuntime}
                                            onChange={(event) =>
                                                dispatch({
                                                    type: "setMinRuntime",
                                                    payload: {
                                                        minRuntime:
                                                            event.target.value,
                                                    },
                                                })
                                            }
                                        />
                                        <p>to</p>
                                        <input
                                            className="w-20 text-center border-2 border-gray-300 rounded-md"
                                            type="text"
                                            value={state.maxRuntime}
                                            onChange={(event) =>
                                                dispatch({
                                                    type: "setMaxRuntime",
                                                    payload: {
                                                        maxRuntime:
                                                            event.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Filters;
