export enum CONDITION_TYPE {
    ID_LIST = 'ID_LIST',
    TAG_EQUALS = "TAG_EQUALS",
    MEETS_ALL = 'MEETS_ALL',
    MEETS_ANY = 'MEETS_ANY'
}
export type VoterFilter = VoterFilter_Tag | VoterFilter_Many | VoterFilter_List;
export interface VoterFilter_Tag {
    type: CONDITION_TYPE.TAG_EQUALS;
    key: string;
    value: string;
    split_lines: boolean;
}
export interface VoterFilter_Many {
    type: CONDITION_TYPE.MEETS_ALL | CONDITION_TYPE.MEETS_ANY;
    conditions: Array<VoterFilter>
}
export interface VoterFilter_List {
    type: CONDITION_TYPE.ID_LIST;
    values: Array<string>
}