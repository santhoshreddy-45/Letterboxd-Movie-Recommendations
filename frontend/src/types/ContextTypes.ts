/* Movie Filter Context */
export type ContentType = {
    label: string;
    value: string;
    disabled?: boolean;
};

export type FilterPresetType = {
    label: string;
    value: string;
    disabled?: boolean;
};

export type FilterState = {
    genres: GenreType[];
    contentTypes: ContentType[];
    minReleaseYear: string;
    maxReleaseYear: string;
    minRuntime: string;
    maxRuntime: string;
    popularity: PopularityType[];
    highlyRated: boolean;
    includeWatchlist: boolean;
    allowRewatches: boolean;
    modelType: ModelType;
    filterPreset: FilterPresetType;
    description: string;
    predictionList: string[];
};

export type GenreType = {
    label: string;
    value: string;
    disabled?: boolean;
};

export type ModelType = {
    label: string;
    value: string;
    disabled?: boolean;
};

export type PopularityType = {
    label: string;
    value: string;
    disabled?: boolean;
};

/* Card View Context */
export type ViewState = {
    view: ViewType;
};

export type ViewType = "grid" | "carousel";
