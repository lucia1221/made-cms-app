import { Tag } from "./tag";

export interface Article {
    id: number | string;
    title: string;
    content: string;
    tags: Tag[];
    created_at: string;
    authorId: number;
}
