export const calculateStartDate = (period: "7d" | "30d" | "90d" | "180d" | "365d"): string => {
    let start: Date;

    switch (period) {
        case "7d":
            start = new Date(new Date().setDate(new Date().getDate() - 7));
            break;
        case "30d":
            start = new Date(new Date().setDate(new Date().getDate() - 30));
            break;
        case "90d":
            start = new Date(new Date().setMonth(new Date().getMonth() - 3));
            break;
        case "180d":
            start = new Date(new Date().setMonth(new Date().getMonth() - 6));
            break;
        case "365d":
            start = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
            break;
        default:
            start = new Date(new Date().setDate(new Date().getDate() - 7)); // Default to 7 days if unknown
    }

    return start.toISOString(); // Return ISO string for compatibility
};
