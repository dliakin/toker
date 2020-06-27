import { LOAD_NEWS_API } from "../types"

export const loadNews = (token) => ({
    type: LOAD_NEWS_API,
    payload: token,
})