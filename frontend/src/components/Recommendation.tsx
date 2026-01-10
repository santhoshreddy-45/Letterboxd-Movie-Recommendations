import { useContext, useState } from "react";
import axios from "axios";
import { FieldErrors, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { Tooltip } from "@mui/material";

import CarouselRecDisplay from "./Displays/CarouselRecDisplay";
import ExportLetterboxdCSV from "./Exports/ExportLetterboxdCSV";
import ExportRecs from "./Exports/ExportRecs";
import FilterDescription from "./FilterDescription";
import Filters from "./Filters";
import LinearIndeterminate from "./LinearIndeterminate";
import MoviePredict from "./MoviePredict";
import PredictDisplay from "./Displays/PredictDisplay";
import RecDisplay from "./Displays/RecDisplay";

import useIsScreenXl from "../hooks/useIsScreenXl";

import { validateMultipleUsernames, validateSingleUsername } from "../Utils";

import {
    FilterType,
    RecommendationFormValues,
    RecommendationResponse,
    RecommendationFilterQuery,
    RecommendationPredictionQuery,
    RecommendationQuery,
} from "../types/RecommendationsTypes";

import { CardViewContext } from "../contexts/CardViewContext";
import { MovieFilterContext } from "../contexts/MovieFilterContext";

const backend = import.meta.env.VITE_BACKEND_URL;

const isQueryEqual = (
    previousQuery: RecommendationQuery,
    currentQuery: RecommendationQuery
): boolean => {
    if (previousQuery.usernames.length !== currentQuery.usernames.length) {
        return false;
    }
    for (let i = 0; i < previousQuery.usernames.length; i++) {
        if (previousQuery.usernames[i] !== currentQuery.usernames[i]) {
            return false;
        }
    }
    if (previousQuery.genres.length !== currentQuery.genres.length) {
        return false;
    }
    for (let i = 0; i < previousQuery.genres.length; i++) {
        if (previousQuery.genres[i] !== currentQuery.genres[i]) {
            return false;
        }
    }
    if (
        previousQuery.content_types.length !== currentQuery.content_types.length
    ) {
        return false;
    }
    for (let i = 0; i < previousQuery.content_types.length; i++) {
        if (previousQuery.content_types[i] !== currentQuery.content_types[i]) {
            return false;
        }
    }
    if (previousQuery.min_release_year !== currentQuery.min_release_year) {
        return false;
    }
    if (previousQuery.max_release_year !== currentQuery.max_release_year) {
        return false;
    }
    if (previousQuery.min_runtime !== currentQuery.min_runtime) {
        return false;
    }
    if (previousQuery.max_runtime !== currentQuery.max_runtime) {
        return false;
    }
    if (previousQuery.popularity.length !== currentQuery.popularity.length) {
        return false;
    }
    for (let i = 0; i < previousQuery.popularity.length; i++) {
        if (previousQuery.popularity[i] !== currentQuery.popularity[i]) {
            return false;
        }
    }
    if (previousQuery.highly_rated !== currentQuery.highly_rated) {
        return false;
    }
    if (previousQuery.include_watchlist !== currentQuery.include_watchlist) {
        return false;
    }
    if (previousQuery.allow_rewatches !== currentQuery.allow_rewatches) {
        return false;
    }
    if (previousQuery.model_type !== currentQuery.model_type) {
        return false;
    }

    return true;
};

const isFilterQueryEqual = (
    previousFilterQuery: RecommendationFilterQuery,
    currentFilterQuery: RecommendationFilterQuery
): boolean => {
    if (previousFilterQuery.username !== currentFilterQuery.username) {
        return false;
    }
    if (previousFilterQuery.description !== currentFilterQuery.description) {
        return false;
    }

    return true;
};

const isPredictionQueryEqual = (
    previousPredictionQuery: RecommendationPredictionQuery,
    currentPredictionQuery: RecommendationPredictionQuery
): boolean => {
    if (previousPredictionQuery.username !== currentPredictionQuery.username) {
        return false;
    }
    if (
        previousPredictionQuery.prediction_list.length !==
        currentPredictionQuery.prediction_list.length
    ) {
        return false;
    }
    for (let i = 0; i < previousPredictionQuery.prediction_list.length; i++) {
        if (
            previousPredictionQuery.prediction_list[i] !==
            currentPredictionQuery.prediction_list[i]
        ) {
            return false;
        }
    }
    return true;
};

const Recommendation = () => {
    const isScreenXl = useIsScreenXl();

    const movieFilterContext = useContext(MovieFilterContext);
    if (!movieFilterContext) {
        throw new Error(
            "Movie filters must be used within a MovieFilterProvider"
        );
    }
    const [movieFilterState] = movieFilterContext;

    const cardViewContext = useContext(CardViewContext);
    if (!cardViewContext) {
        throw new Error(
            "Recommendations must be used within a CardViewProvider"
        );
    }
    const [cardViewState, cardViewDispatch] = cardViewContext;

    const [generatedDatetime, setGeneratedDatetime] = useState<string>("");

    const [filterType, setFilterType] = useState<FilterType>("manual");
    const [previousQuery, setPreviousQuery] = useState<RecommendationQuery>({
        usernames: [],
        genres: [],
        content_types: [],
        min_release_year: -1,
        max_release_year: -1,
        min_runtime: -1,
        max_runtime: -1,
        popularity: [],
        highly_rated: false,
        include_watchlist: true,
        allow_rewatches: false,
        model_type: "",
    });
    const [previousFilterQuery, setPreviousFilterQuery] =
        useState<RecommendationFilterQuery>({
            username: "",
            description: "",
        });
    const [previousPredictionQuery, setPreviousPredictionQuery] =
        useState<RecommendationPredictionQuery>({
            username: "",
            prediction_list: [""],
        });

    const [recommendations, setRecommendations] = useState<
        null | RecommendationResponse[]
    >(null);
    const [filterRecommendations, setFilterRecommendations] = useState<
        null | RecommendationResponse[]
    >(null);
    const [predictionRecommendations, setPredictionRecommendations] = useState<
        null | RecommendationResponse[]
    >(null);
    const [gettingRecs, setGettingRecs] = useState(false);

    const getRecommendations = async (usernames: string[]) => {
        // validates genres filter
        if (movieFilterState.genres.length === 0) {
            enqueueSnackbar("Genre must be selected", { variant: "error" });
            return;
        }

        // validates content types filter
        if (movieFilterState.contentTypes.length === 0) {
            enqueueSnackbar("Content type must be selected", {
                variant: "error",
            });
            return;
        }

        // validates release year filter
        if (
            isNaN(Number(movieFilterState.minReleaseYear)) ||
            movieFilterState.minReleaseYear.trim() === "" ||
            isNaN(Number(movieFilterState.maxReleaseYear)) ||
            movieFilterState.maxReleaseYear.trim() === ""
        ) {
            // console.log("Min and max release year must be numbers");
            enqueueSnackbar("Min and max release year must be numbers", {
                variant: "error",
            });
            return;
        } else if (
            Number(movieFilterState.minReleaseYear) >
                new Date().getFullYear() ||
            Number(movieFilterState.maxReleaseYear) >
                new Date().getFullYear() ||
            Number(movieFilterState.minReleaseYear) < 1880 ||
            Number(movieFilterState.maxReleaseYear) < 1880
        ) {
            enqueueSnackbar(
                `Min and max release year must be between 1880 and ${new Date().getFullYear()} (inclusive)`,
                { variant: "error" }
            );
            return;
        } else if (
            movieFilterState.minReleaseYear > movieFilterState.maxReleaseYear
        ) {
            enqueueSnackbar(
                "Min release year cannot be after the max release year",
                { variant: "error" }
            );
            return;
        }

        // validates runtime filter
        if (
            isNaN(Number(movieFilterState.minRuntime)) ||
            movieFilterState.minRuntime.trim() === "" ||
            isNaN(Number(movieFilterState.maxRuntime)) ||
            movieFilterState.maxRuntime.trim() === ""
        ) {
            enqueueSnackbar("Min and max runtime must be numbers", {
                variant: "error",
            });
            return;
        } else if (
            Number(movieFilterState.minRuntime) > 2000 ||
            Number(movieFilterState.minRuntime) < 0
        ) {
            enqueueSnackbar(
                `Min runtime must be between 0 and 2000 (inclusive)`,
                { variant: "error" }
            );
            return;
        } else if (
            Number(movieFilterState.maxRuntime) > 2000 ||
            Number(movieFilterState.maxRuntime) < 5
        ) {
            enqueueSnackbar(
                `Max runtime must be between 5 and 2000 (inclusive)`,
                { variant: "error" }
            );
            return;
        } else if (
            Number(movieFilterState.minRuntime) >
            Number(movieFilterState.maxRuntime)
        ) {
            enqueueSnackbar(
                "Min runtime cannot be greater than the max runtime",
                {
                    variant: "error",
                }
            );
            return;
        }

        // validates popularity filter
        if (movieFilterState.popularity.length === 0) {
            enqueueSnackbar("Popularity must be selected", {
                variant: "error",
            });
            return;
        }

        const currentQuery = {
            usernames: usernames,
            genres: movieFilterState.genres.map((genre) => genre.value).sort(),
            content_types: movieFilterState.contentTypes
                .map((contentType) => contentType.value)
                .sort(),
            min_release_year: Number(movieFilterState.minReleaseYear),
            max_release_year: Number(movieFilterState.maxReleaseYear),
            min_runtime: Number(movieFilterState.minRuntime),
            max_runtime: Number(movieFilterState.maxRuntime),
            popularity: movieFilterState.popularity
                .map((popularity) => popularity.value)
                .sort(),
            highly_rated: movieFilterState.highlyRated,
            include_watchlist: movieFilterState.includeWatchlist,
            allow_rewatches: movieFilterState.allowRewatches,
            model_type: movieFilterState.modelType.value,
        };
        if (isQueryEqual(previousQuery, currentQuery)) {
            enqueueSnackbar("Identical user query", {
                variant: "info",
            });
            return;
        }

        setGettingRecs(true);
        setRecommendations(null);
        try {
            // console.log(currentQuery);
            const response = await axios.post(
                `${backend}/api/get-recommendations`,
                { currentQuery }
            );
            // console.log(response.data.data);
            setRecommendations(response.data.data);
            setPreviousQuery(currentQuery);
            setGeneratedDatetime(new Date().toLocaleString());
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                console.error(error.response.data.message);
                enqueueSnackbar(error.response.data.message, {
                    variant: "error",
                });
            } else {
                console.error(error);
                enqueueSnackbar("Internal server error", {
                    variant: "error",
                });
            }
        }
        setGettingRecs(false);
    };

    const getFilterRecommendations = async (username: string) => {
        // validates description
        if (movieFilterState.description.trim() === "") {
            enqueueSnackbar("Description cannot be empty", {
                variant: "error",
            });
            return;
        }

        const currentFilterQuery = {
            username: username,
            description: movieFilterState.description.trim(),
        };
        if (isFilterQueryEqual(previousFilterQuery, currentFilterQuery)) {
            enqueueSnackbar("Identical user query", {
                variant: "info",
            });
            return;
        }

        setGettingRecs(true);
        setFilterRecommendations(null);
        try {
            // console.log(currentFilterQuery);
            const response = await axios.post(
                `${backend}/api/get-natural-language-recommendations`,
                { currentFilterQuery }
            );
            // console.log(response.data.data);
            setFilterRecommendations(response.data.data);
            setPreviousFilterQuery(currentFilterQuery);
            setGeneratedDatetime(new Date().toLocaleString());
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                console.error(error.response.data.message);
                enqueueSnackbar(error.response.data.message, {
                    variant: "error",
                });
            } else {
                console.error(error);
                enqueueSnackbar("Internal server error", {
                    variant: "error",
                });
            }
        }
        setGettingRecs(false);
    };

    const getPredictionRecommendations = async (username: string) => {
        // validates prediction list
        if (
            movieFilterState.predictionList.length === 0 ||
            movieFilterState.predictionList.filter((item) => item.trim() !== "")
                .length === 0
        ) {
            enqueueSnackbar("At least one prediction URL is required", {
                variant: "error",
            });
            return;
        }

        const currentPredictionQuery = {
            username: username
                .replace("https://letterboxd.com/", "")
                .replace("/", ""),
            prediction_list: movieFilterState.predictionList
                .filter((item) => item.trim() !== "")
                .sort(),
        };
        if (
            isPredictionQueryEqual(
                previousPredictionQuery,
                currentPredictionQuery
            )
        ) {
            enqueueSnackbar("Identical user query", {
                variant: "info",
            });
            return;
        }

        setGettingRecs(true);
        setPredictionRecommendations(null);
        try {
            // console.log(currentPredictionQuery);
            const response = await axios.post(
                `${backend}/api/get-prediction-recommendations`,
                { currentPredictionQuery }
            );
            // console.log(response.data.data);
            setPredictionRecommendations(response.data.data);
            setPreviousPredictionQuery(currentPredictionQuery);
            setGeneratedDatetime(new Date().toLocaleString());
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                console.error(error.response.data.message);
                enqueueSnackbar(error.response.data.message, {
                    variant: "error",
                });
            } else {
                console.error(error);
                enqueueSnackbar("Internal server error", {
                    variant: "error",
                });
            }
        }
        setGettingRecs(false);
    };

    const form = useForm<RecommendationFormValues>({
        defaultValues: {
            userList: "",
        },
    });
    const { register, handleSubmit, watch } = form;
    const watchUserList = watch("userList");

    const onSubmit = (formData: RecommendationFormValues) => {
        if (filterType === "manual") {
            const usernameValidation = validateMultipleUsernames(
                formData.userList
            );
            if (usernameValidation.status === "error") {
                enqueueSnackbar(usernameValidation.message, {
                    variant: "error",
                });
                return;
            }

            getRecommendations(usernameValidation.usernames);
        } else if (filterType === "description") {
            const usernameValidation = validateSingleUsername(
                formData.userList
            );
            if (usernameValidation.status === "error") {
                enqueueSnackbar(usernameValidation.message, {
                    variant: "error",
                });
                return;
            }

            getFilterRecommendations(usernameValidation.username);
        } else if (filterType === "prediction") {
            const usernameValidation = validateSingleUsername(
                formData.userList
            );
            if (usernameValidation.status === "error") {
                enqueueSnackbar(usernameValidation.message, {
                    variant: "error",
                });
                return;
            }

            getPredictionRecommendations(usernameValidation.username);
        }
    };

    const onError = (errors: FieldErrors<RecommendationFormValues>) => {
        console.log("Form errors", errors);
    };

    return (
        <div className="lg:w-[700px] mx-auto">
            <div className="w-fit mx-auto mt-8 flex flex-wrap justify-center gap-4">
                {(["manual", "description", "prediction"] as const).map(
                    (item) => (
                        <button
                            key={item}
                            className={`w-24 sm:w-32 mx-auto p-2 rounded-md text-sm sm:text-lg hover:shadow-md ${
                                filterType === item
                                    ? "shadow-md bg-palette-lightbrown"
                                    : "bg-gray-200"
                            }`}
                            onClick={() => setFilterType(item)}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </button>
                    )
                )}
            </div>

            {filterType === "manual" && (
                <Filters
                    allowRewatches={watchUserList.includes(",") ? true : false}
                />
            )}
            {filterType === "description" && <FilterDescription />}
            {filterType === "prediction" && <MoviePredict />}

            {!gettingRecs && (
                <form
                    className="w-fit mx-auto mt-8 flex flex-col space-y-4"
                    onSubmit={handleSubmit(onSubmit, onError)}
                    noValidate
                >
                    <label
                        className="text-center text-xl text-palette-darkbrown"
                        htmlFor="username"
                    >
                        {filterType === "manual"
                            ? "Enter Letterboxd Username(s)"
                            : "Enter Letterboxd Username"}
                    </label>
                    <div className="form-control flex flex-col align-center">
                        <input
                            className="w-64 sm:w-96 mx-auto p-1 text-center rounded-md bg-gray-200"
                            type="text"
                            placeholder={
                                filterType === "manual"
                                    ? "Separate by comma"
                                    : "One username only"
                            }
                            {...register("userList")}
                        />
                    </div>

                    {watchUserList.trim() !== "" && (
                        <button className="block mx-auto p-2 rounded-md hover:shadow-md bg-gray-200 hover:bg-palette-lightbrown">
                            {filterType === "prediction"
                                ? "Get Predictions"
                                : "Get Recommendations"}
                        </button>
                    )}
                </form>
            )}

            {gettingRecs && (
                <div className="w-fit mx-auto">
                    <p className="mx-auto my-8 sm:text-xl text-palette-darkbrown">
                        {filterType === "prediction"
                            ? "Generating predictions..."
                            : "Generating recommendations..."}
                    </p>
                    <LinearIndeterminate />
                </div>
            )}

            {!gettingRecs &&
                ((filterType === "manual" && recommendations?.length) ||
                    (filterType === "description" &&
                        filterRecommendations?.length)) && (
                    <>
                        {isScreenXl ? (
                            <div
                                className={`mt-4 rounded-lg ${
                                    cardViewState.view === "carousel" &&
                                    "shadow shadow-palette-darkbrown"
                                }`}
                            >
                                <div
                                    className={`p-1 flex justify-between ${
                                        cardViewState.view === "grid" &&
                                        "border-t-2 border-x-2 border-gray-200"
                                    } rounded-t-lg bg-palette-lightbrown`}
                                >
                                    <div className="flex gap-0.5">
                                        <ExportLetterboxdCSV
                                            data={
                                                filterType === "manual"
                                                    ? recommendations!
                                                    : filterRecommendations!
                                            }
                                            filename="letterboxd_recommendations.csv"
                                        />
                                        <ExportRecs
                                            recommendations={
                                                filterType === "manual"
                                                    ? recommendations!
                                                    : filterRecommendations!
                                            }
                                            userList={watchUserList}
                                            generatedDatetime={
                                                generatedDatetime
                                            }
                                            filename="letterboxd_recommendations.png"
                                            title="Letterboxd Movie Recommendations"
                                        />
                                    </div>
                                    <div className="flex gap-0.5">
                                        <Tooltip title="Grid">
                                            <ViewModuleIcon
                                                className={`${
                                                    cardViewState.view ===
                                                    "grid"
                                                        ? "text-palette-darkbrown"
                                                        : "text-gray-200"
                                                } hover:cursor-pointer`}
                                                onClick={() =>
                                                    cardViewDispatch({
                                                        type: "setView",
                                                        payload: {
                                                            view: "grid",
                                                        },
                                                    })
                                                }
                                            />
                                        </Tooltip>
                                        <Tooltip title="Carousel">
                                            <ViewColumnIcon
                                                className={`${
                                                    cardViewState.view ===
                                                    "carousel"
                                                        ? "text-palette-darkbrown"
                                                        : "text-gray-200"
                                                } hover:cursor-pointer`}
                                                onClick={() =>
                                                    cardViewDispatch({
                                                        type: "setView",
                                                        payload: {
                                                            view: "carousel",
                                                        },
                                                    })
                                                }
                                            />
                                        </Tooltip>
                                    </div>
                                </div>
                                {cardViewState.view === "carousel" ? (
                                    <CarouselRecDisplay
                                        recommendations={
                                            filterType === "manual"
                                                ? recommendations!
                                                : filterRecommendations!
                                        }
                                    />
                                ) : (
                                    <RecDisplay
                                        recommendations={
                                            filterType === "manual"
                                                ? recommendations!
                                                : filterRecommendations!
                                        }
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="mt-4 rounded-lg">
                                <div className="max-w-4/5 md:max-w-[700px] sm:w-full mx-auto p-1 flex justify-start gap-0.5 border-t-2 border-x-2 border-gray-200 rounded-t-lg bg-palette-lightbrown">
                                    <ExportLetterboxdCSV
                                        data={
                                            filterType === "manual"
                                                ? recommendations!
                                                : filterRecommendations!
                                        }
                                        filename="letterboxd_recommendations.csv"
                                    />
                                    <ExportRecs
                                        recommendations={
                                            filterType === "manual"
                                                ? recommendations!
                                                : filterRecommendations!
                                        }
                                        userList={watchUserList}
                                        generatedDatetime={generatedDatetime}
                                        filename="letterboxd_recommendations.png"
                                        title="Letterboxd Movie Recommendations"
                                    />
                                </div>
                                <RecDisplay
                                    recommendations={
                                        filterType === "manual"
                                            ? recommendations!
                                            : filterRecommendations!
                                    }
                                />
                            </div>
                        )}
                    </>
                )}

            {!gettingRecs &&
                filterType === "prediction" &&
                predictionRecommendations?.length && (
                    <PredictDisplay predictions={predictionRecommendations} />
                )}
        </div>
    );
};

export default Recommendation;
