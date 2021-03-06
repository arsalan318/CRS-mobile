import { Fetch_General_Data_Success, Fetch_General_Data_Failed, Toggle_Utils_Loading } from '../actions/actionTypes'


const initialState = {
    countries: [],
    cities: [],
    states: [],
    utilsLoaded: false
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case Fetch_General_Data_Failed:
            return {
                ...state,
                utilsLoaded: true
            }
        case Fetch_General_Data_Success:
            return {
                ...state,
                countries: payload.countries,
                cities: payload.cities,
                states: payload.states,
                utilsLoaded: true
            }
        case Toggle_Utils_Loading:
            return {
                ...state,
                utilsLoaded: !state.utilsLoaded
            }
        default:
            return state;
    }
}