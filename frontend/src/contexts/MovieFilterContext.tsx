import { createContext, Dispatch, useReducer } from "react";

import {
    ContentType,
    FilterPresetType,
    FilterState,
    GenreType,
    ModelType,
    PopularityType,
} from "../types/ContextTypes";

type MovieFilterContext = [FilterState, Dispatch<Action>];

export const MovieFilterContext = createContext<MovieFilterContext | undefined>(
    undefined
);

const initialState: FilterState = {
    genres: [
        { label: "Action", value: "action" },
        { label: "Adventure", value: "adventure" },
        { label: "Animation", value: "animation" },
        { label: "Comedy", value: "comedy" },
        { label: "Crime", value: "crime" },
        { label: "Drama", value: "drama" },
        { label: "Family", value: "family" },
        { label: "Fantasy", value: "fantasy" },
        { label: "History", value: "history" },
        { label: "Horror", value: "horror" },
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
    ],
    contentTypes: [{ label: "Movie", value: "movie" }],
    minReleaseYear: "1920",
    maxReleaseYear: new Date().getFullYear().toString(),
    minRuntime: "0",
    maxRuntime: "1200",
    popularity: [
        { label: "High", value: "high" },
        { label: "Medium", value: "medium" },
    ],
    highlyRated: false,
    includeWatchlist: true,
    allowRewatches: false,
    modelType: { label: "Personalized", value: "personalized" },
    filterPreset: { label: "None", value: "none" },
    description: "",
    predictionList: [""],
};

type Action =
    | { type: "setGenres"; payload: { genres: GenreType[] } }
    | { type: "setContentTypes"; payload: { contentTypes: ContentType[] } }
    | { type: "setMinReleaseYear"; payload: { minReleaseYear: string } }
    | { type: "setMaxReleaseYear"; payload: { maxReleaseYear: string } }
    | { type: "setMinRuntime"; payload: { minRuntime: string } }
    | { type: "setMaxRuntime"; payload: { maxRuntime: string } }
    | { type: "setPopularity"; payload: { popularity: PopularityType[] } }
    | { type: "setHighlyRated"; payload: { highlyRated: boolean } }
    | { type: "setIncludeWatchlist"; payload: { includeWatchlist: boolean } }
    | { type: "setAllowRewatches"; payload: { allowRewatches: boolean } }
    | { type: "setModelType"; payload: { modelType: ModelType } }
    | { type: "setFilterPreset"; payload: { filterPreset: FilterPresetType } }
    | { type: "setAnimaniaPreset" }
    | { type: "setClassicCinemaPreset" }
    | { type: "setDateNightPreset" }
    | { type: "setEducationalPreset" }
    | { type: "setEpicFilmsPreset" }
    | { type: "setFamilyNightPreset" }
    | { type: "setHiddenGemsPreset" }
    | { type: "setHorrorNightPreset" }
    | { type: "setDescription"; payload: { description: string } }
    | { type: "setPredictionList"; payload: { predictionList: string[] } }
    | {
          type: "reset";
      };

function movieFilterReducer(state: FilterState, action: Action) {
    switch (action.type) {
        case "setGenres":
            return {
                ...state,
                genres: action.payload.genres,
            };
        case "setContentTypes":
            return {
                ...state,
                contentTypes: action.payload.contentTypes,
            };
        case "setMinReleaseYear":
            return {
                ...state,
                minReleaseYear: action.payload.minReleaseYear,
            };
        case "setMaxReleaseYear":
            return {
                ...state,
                maxReleaseYear: action.payload.maxReleaseYear,
            };
        case "setMinRuntime":
            return {
                ...state,
                minRuntime: action.payload.minRuntime,
            };
        case "setMaxRuntime":
            return {
                ...state,
                maxRuntime: action.payload.maxRuntime,
            };
        case "setPopularity":
            return {
                ...state,
                popularity: action.payload.popularity,
            };
        case "setHighlyRated":
            return {
                ...state,
                highlyRated: action.payload.highlyRated,
            };
        case "setIncludeWatchlist":
            return {
                ...state,
                includeWatchlist: action.payload.includeWatchlist,
            };
        case "setAllowRewatches":
            return {
                ...state,
                allowRewatches: action.payload.allowRewatches,
            };
        case "setModelType":
            return {
                ...state,
                modelType: action.payload.modelType,
            };
        case "setFilterPreset":
            return {
                ...state,
                filterPreset: action.payload.filterPreset,
            };
        case "setAnimaniaPreset":
            return {
                ...initialState,
                genres: [{ label: "Animation", value: "animation" }],
                contentTypes: [
                    { label: "Movie", value: "movie" },
                    { label: "TV", value: "tv" },
                ],
                highlyRated: true,
                filterPreset: { label: "Animania", value: "animania" },
            };
        case "setClassicCinemaPreset":
            return {
                ...initialState,
                genres: [
                    { label: "Crime", value: "crime" },
                    { label: "Drama", value: "drama" },
                    { label: "Romance", value: "romance" },
                    { label: "Western", value: "western" },
                ],
                maxReleaseYear: "1980",
                highlyRated: true,
                filterPreset: {
                    label: "Classic Cinema",
                    value: "classic_cinema",
                },
            };
        case "setDateNightPreset":
            return {
                ...initialState,
                genres: [
                    { label: "Comedy", value: "comedy" },
                    { label: "Romance", value: "romance" },
                ],
                minReleaseYear: "1990",
                filterPreset: { label: "Date Night", value: "date_night" },
            };
        case "setEducationalPreset":
            return {
                ...initialState,
                genres: [
                    { label: "Documentary", value: "documentary" },
                    { label: "History", value: "history" },
                ],
                contentTypes: [
                    { label: "Movie", value: "movie" },
                    { label: "TV", value: "tv" },
                ],
                minReleaseYear: "1960",
                highlyRated: true,
                filterPreset: { label: "Educational", value: "educational" },
            };
        case "setEpicFilmsPreset":
            return {
                ...initialState,
                genres: [
                    { label: "Adventure", value: "adventure" },
                    { label: "Drama", value: "drama" },
                    { label: "Fantasy", value: "fantasy" },
                    { label: "History", value: "history" },
                    { label: "Science Fiction", value: "science_fiction" },
                    { label: "War", value: "war" },
                ],
                minRuntime: "150",
                highlyRated: true,
                filterPreset: { label: "Epic Films", value: "epic_films" },
            };
        case "setFamilyNightPreset":
            return {
                ...initialState,
                genres: [{ label: "Family", value: "family" }],
                minReleaseYear: "1980",
                filterPreset: { label: "Family Night", value: "family_night" },
            };
        case "setHiddenGemsPreset":
            return {
                ...initialState,
                popularity: [
                    { label: "Medium", value: "medium" },
                    { label: "Low", value: "low" },
                ],
                highlyRated: true,
                filterPreset: { label: "Hidden Gems", value: "hidden_gems" },
            };
        case "setHorrorNightPreset":
            return {
                ...initialState,
                genres: [{ label: "Horror", value: "horror" }],
                minReleaseYear: "1980",
                filterPreset: { label: "Horror Night", value: "horror_night" },
            };
        case "setDescription":
            return {
                ...state,
                description: action.payload.description,
            };
        case "setPredictionList":
            return {
                ...state,
                predictionList: action.payload.predictionList,
            };
        case "reset":
            return initialState;
        default:
            return state;
    }
}

interface MovieFilterProviderProps {
    children: React.ReactNode;
}

const MovieFilterProvider = ({ children }: MovieFilterProviderProps) => {
    const [state, dispatch] = useReducer(movieFilterReducer, initialState);
    return (
        <MovieFilterContext.Provider value={[state, dispatch]}>
            {children}
        </MovieFilterContext.Provider>
    );
};

export default MovieFilterProvider;
