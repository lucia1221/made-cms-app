export interface Range {
    from: number;
    to: number;
}

export function getRange(page: number, itemsPerPage: number): Range {
    return {
        from: (page - 1) * itemsPerPage,
        to: page * itemsPerPage - 1,
    };
}
