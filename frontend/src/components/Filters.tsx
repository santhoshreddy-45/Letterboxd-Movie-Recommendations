import { useContext, useState } from "react";
import TuneIcon from "@mui/icons-material/Tune";
import { AiOutlineClose } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import Stack from "@mui/material/Stack";

import AdvancedFilterHeaderText from "./Text/AdvancedFilterHeaderText";
import DefinitionModal from "./Modals/DefinitionModal";
import FilterToggleButton from "./Buttons/FilterToggleButton";
import HorizontalDivider from "./Layout/HorizontalDivider";
import MultiSelectDropdown from "./Selection/MultiSelectDropdown";
import SelectDropdown from "./Selection/SelectDropdown";

import { MovieFilterContext } from "../contexts/MovieFilterContext";

import useIsScreenSm from "../hooks/useIsScreenSm";
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

    const isScreenSm = useIsScreenSm();

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

    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    useScrollLock(filterDrawerOpen);

    const resetFilters = () => {
        dispatch({
            type: "reset",
        });
    };

    const closeFilterDrawer = () => {
        setFilterDrawerOpen(false);
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

                {/* Advanced Filters */}
                <button
                    className="block mx-auto p-2 text-lg sm:text-xl rounded-md hover:shadow-md bg-gray-200 hover:bg-palette-lightbrown"
                    type="button"
                    onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                >
                    Advanced Filters <TuneIcon />
                </button>
                <AnimatePresence>
                    {filterDrawerOpen && (
                        <motion.div
                            initial={
                                isScreenSm ? { x: "-100%" } : { y: "100%" }
                            }
                            animate={isScreenSm ? { x: 0 } : { y: 0 }}
                            exit={isScreenSm ? { x: "-100%" } : { y: "100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className={`fixed ${
                                isScreenSm ? "top-0 left-0 bottom-0" : "inset-0"
                            } z-[2000] overflow-y-auto overscroll-contain pb-8 flex flex-col space-y-4 shadow-md bg-white`}
                        >
                            <div className="sticky top-0 flex justify-end">
                                <AiOutlineClose
                                    className="mr-4 sm:mr-2 hover:cursor-pointer hover:text-palette-darkbrown"
                                    size={32}
                                    onClick={() => closeFilterDrawer()}
                                />
                            </div>
                            <button
                                className="block mx-auto p-2 rounded-md hover:shadow-md bg-gray-200 hover:bg-palette-lightbrown"
                                type="reset"
                                onClick={resetFilters}
                            >
                                Reset Filters
                            </button>
                            <div className="px-12 flex flex-col items-center space-y-4">
                                {/* Genres Filter */}
                                <div className="w-48">
                                    <AdvancedFilterHeaderText
                                        title="Genres"
                                        definition={filterDefinitions["Genres"]}
                                    />
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

                                {/* Content Types Filter */}
                                <div className="w-48">
                                    <AdvancedFilterHeaderText
                                        title="Content Types"
                                        definition={
                                            filterDefinitions["Content Types"]
                                        }
                                    />
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

                                {/* Popularity Filter */}
                                <div className="w-48">
                                    <AdvancedFilterHeaderText
                                        title="Popularity"
                                        definition={
                                            filterDefinitions["Popularity"]
                                        }
                                    />
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

                                {/* Release Year Filter */}
                                <div className="w-48">
                                    <AdvancedFilterHeaderText
                                        title="Release Year"
                                        definition={
                                            filterDefinitions["Release Year"]
                                        }
                                    />
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

                                {/* Runtime Filter */}
                                <div className="w-48">
                                    <AdvancedFilterHeaderText
                                        title="Runtime"
                                        definition={
                                            filterDefinitions["Runtime"]
                                        }
                                    />
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

                <HorizontalDivider color="darkbrown" />

                {/* Filter Tags */}
                <div className="w-fit lg:max-w-[500px] mx-auto">
                    <Stack
                        spacing={{ xs: 1, sm: 2 }}
                        direction="row"
                        useFlexGap
                        sx={{ flexWrap: "wrap" }}
                    >
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
                                        includeWatchlist:
                                            !state.includeWatchlist,
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
                                            allowRewatches:
                                                !state.allowRewatches,
                                        },
                                    })
                                }
                            />
                        )}
                    </Stack>
                </div>
            </div>
        </div>
    );
};

export default Filters;
