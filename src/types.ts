export interface Application {
    id: string;
    side: string,
    from: string;
    to: string;
    what: string;
    seats: number;
    contact: string;
    // phone: string;
    // email: string;
    when: string;
    time: string;
    description: string;
}

export interface City {
    id: number;
    city: string;
    district: string;
    region: string;
}

export const ALL_WHAT_MAP = ["human", "animal", "food", "medicine", "clothes"] as const;
export type What = typeof ALL_WHAT_MAP[number];
export const mapWhatToLabel = (what: What): string => ({
    'human': 'Люди', 'animal': 'Тварини', "food": 'Продукти', "medicine": 'Ліки', 'clothes': 'Речі'
}[what]);

export const ALL_SIDES_MAP = ['request', 'proposal'] as const;
export type Side = typeof ALL_SIDES_MAP[number];
export const mapSideToLabel = (side: Side): string => ({
    'request': 'Потреба', 'proposal': 'Допомога'
}[side]);

export const id = <T,>(i: T) => i;