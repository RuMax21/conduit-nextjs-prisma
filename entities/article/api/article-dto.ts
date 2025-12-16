export interface CreateArticleDto {
  title: string,
  content: string,
  coverImage?: string,
  authorId: string,
  tagIds?: string[]
}

export interface UpdateArticleDto {
  title?: string,
  content?: string,
  coverImage?: string
}