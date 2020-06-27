import { LOAD_ACCAUNTS_API, ADD_ACCAUNT_API, GET_ACCAUNT_API, CLEAR_ACCAUNT, SET_FOLLOWERS_GOAL_API, DELETE_ACCAUNT_API } from "../types"

export const loadAccaunts = (token) => ({
    type: LOAD_ACCAUNTS_API,
    payload: token,
})

export const addAccaunt = (accaunt, token) => ({
    type: ADD_ACCAUNT_API,
    accaunt,
    token,
})

export const getAccaunt = (id, token) => ({
    type: GET_ACCAUNT_API,
    id,
    token,
})

export const clearAccaunt = () => ({
    type: CLEAR_ACCAUNT,
})

export const setFollowersGoal = (goal, id, token) => ({
    type: SET_FOLLOWERS_GOAL_API,
    goal,
    id,
    token,
})

export const deleteAccaunt = (id, token) => ({
    type: DELETE_ACCAUNT_API,
    id,
    token,
})