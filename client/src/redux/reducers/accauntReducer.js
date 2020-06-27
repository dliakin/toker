import { LOAD_ACCAUNTS, ADD_ACCAUNT, GET_ACCAUNT, CLEAR_ACCAUNT, SET_FOLLOWERS_GOAL, DELETE_ACCAUNT } from '../types'

const initialState = {
    accaunts: [],
    accaunt: null
}

export const accauntReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ACCAUNTS:
            return { ...state, accaunts: action.payload }
        case ADD_ACCAUNT:
            return { ...state, accaunts: [...state.accaunts, action.payload.accaunt] }
        case DELETE_ACCAUNT:
            return { ...state, accaunts: state.accaunts.filter(item => item.id !== action.id) }
        case GET_ACCAUNT:
            return { ...state, accaunt: action.payload }
        case CLEAR_ACCAUNT:
            return { ...state, accaunt: null }
        case SET_FOLLOWERS_GOAL:
            return { ...state, accaunt: { ...state.accaunt, 'accauntExtra.goal_start_fans': action.payload.goal_start_fans, 'accauntExtra.goal': action.payload.goal } }
        default: return state
    }
}