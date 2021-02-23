export interface ICatFactDto {
    _id: string;
    __v: number;
    status: {
        verified: boolean;
        sentCount: number;
    };
    deleted: boolean;
    type: string;

    user: string;
    text: string;
    source: string;
    updatedAt: string;
    createdAt: string;
    used: boolean;
}
