import {getFromStorage} from "../utils/storage";

const {name: userName} = getFromStorage('userKey')
const API_BASE_URL = 'https://nf-api.onrender.com/api/v1/auction'
const GET_LISTINGS = '/listings?_seller=true&_bids=true&sort=created&sortOrder=desc'
const GET_LISTING_DETAILS = '/listings/'
const SIGN_UP = '/auth/register'
const SIGN_IN = '/auth/login'
const AVATAR_UPDATE = `/profiles/${userName}/media`

export {API_BASE_URL, GET_LISTINGS, GET_LISTING_DETAILS, SIGN_UP, SIGN_IN, AVATAR_UPDATE}
