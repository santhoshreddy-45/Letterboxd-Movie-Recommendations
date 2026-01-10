import {
    MultiUsernameValidation,
    SingleUsernameValidation,
} from "./types/UtilityTypes";

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function validateMultipleUsernames(
    userInput: string
): MultiUsernameValidation {
    // Parses raw usernames
    const rawUsers = userInput
        .split(",")
        .map((user) =>
            user.replace("https://letterboxd.com/", "").replace("/", "")
        );

    // Validates each username
    const usernames = [];
    for (const rawUser of rawUsers) {
        const result = validateSingleUsername(rawUser);

        if (result.status === "error") {
            return result;
        }

        usernames.push(result.username);
    }

    // At least 1 valid username required
    if (usernames.length === 0) {
        return {
            status: "error",
            message: "Must include at least one valid username",
        };
    }

    return {
        status: "success",
        usernames: usernames.sort(),
    };
}

export function validateSingleUsername(
    userInput: string
): SingleUsernameValidation {
    const username = userInput.trim().toLowerCase();

    // Validates non-empty input
    if (username === "") {
        return {
            status: "error",
            message: "Username cannot be empty",
        };
    }

    // Validates only one username is input
    if (username.includes(",")) {
        return {
            status: "error",
            message: "Only one username is allowed",
        };
    }

    // Validates against Letterboxd regex (https://api-docs.letterboxd.com/#operation-GET-auth_username-check)
    const USERNAME_REGEX = /^[a-z0-9_]{2,15}$/;
    if (!USERNAME_REGEX.test(username)) {
        if (username.length < 2 || username.length > 15) {
            return {
                status: "error",
                message: "Username must be between 2 and 15 characters long",
            };
        }

        return {
            status: "error",
            message:
                "Username may only contain letters, numbers, or underscores",
        };
    }

    return {
        status: "success",
        username: username,
    };
}
