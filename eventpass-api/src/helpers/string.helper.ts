export const normalizeString = (text: any): string => {
    if (!text || typeof text !== "string") return "";

    return text
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/gi, "")
        .toLowerCase();
};
