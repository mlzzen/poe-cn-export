export interface StatMap {
    [id: string]: Array<Stat>
}

export interface Stat {
    id: string,
    zh: string,
    en: string,
}

export interface MappingEntry {
    before: string,
    after: string,
}