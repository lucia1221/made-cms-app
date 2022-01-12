export interface Article extends ArticleDraft {
  id: number | string;
}

export interface ArticleDraft {
  title: string;
  content: string;
}
