import config, { countries } from '../configuration'
import {
  FETCH_ALL_PLACES_REQUESTED,
  FETCH_ALL_PLACES_SUCCESS,
  FETCH_ALL_PLACES_ERROR,
  FETCH_MY_ENTRIES_SUCCESS,
  FETCH_MY_ENTRIES_ERROR,
  SHOW_POSITION,
  SET_COUNTRY,
  SHOW_INFO,
  SHOW_MAP
} from './mapActions'
import { INIT_SHOW_PLACE_SUCCESS } from '../details/detailsActions'

const initialState = {
  places: [],
  data: undefined,
  myentries: { features: [] },
  isFetchingAll: false,
  position: {
    lat: 0,
    lon: 0
  },
  previousZoom: config.zoom.default,
  zoom: config.zoom.default,
  showInfo: false
}

const map = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_PLACES_REQUESTED:
      return {
        ...state,
        isFetchingAll: true
      }

    case FETCH_ALL_PLACES_SUCCESS:
      return {
        ...state,
        features: action.payload ? action.payload : state.places,
        data: action.payload ? action.payload : state.data,
        isFetchingAll: false
      }

    case FETCH_ALL_PLACES_ERROR:
      return initialState

    case FETCH_MY_ENTRIES_SUCCESS:
      return {
        ...state,
        myentries: action.payload ? action.payload : state.myentries
      }

    case FETCH_MY_ENTRIES_ERROR:
      return initialState

    case SHOW_POSITION:
      return {
        ...state,
        position: {
          lat: Number(action.payload.lat),
          lon: Number(action.payload.lon)
        },
        zoom: config.zoom.searchResult,
        previousZoom: state.zoom
      }

    case INIT_SHOW_PLACE_SUCCESS:
      return {
        ...state,
        position: {
          lat: Number(action.payload.geometry.coordinates[1]),
          lon: Number(action.payload.geometry.coordinates[0]) - 0.04
        },
        zoom: config.zoom.searchResult,
        previousZoom: state.zoom
      }

    case SET_COUNTRY:
      return {
        ...state,
        country: action.payload,
        position: countries[action.payload].center,
        zoom: countries[action.payload].zoom
      }

    case SHOW_INFO:
      return {
        ...state,
        showInfo: true
      }

    case SHOW_MAP:
      return {
        ...state,
        showInfo: false,
        zoom: state.previousZoom
      }

    default:
      return state
  }
}

export default map
