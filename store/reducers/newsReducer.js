import { constants } from './actions';
const initialState = {
  news:{
    count : 0,
    list :[]
  } 
}

function newsReducer(state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_NEWS:
      const newsToAdd = action.news.filter(e=> !state.news.list.some(n=>n.id==e.id));
      return {
        ...state,
        news: {
          count: state.news.count + newsToAdd.length,
          list: [...newsToAdd, ...state.news.list]
        }
      }
    case constants.ADD_TO_NEWS:
      return {
        ...state,
        news: {
          count: state.news.count+1,
          list:[action.news, ...state.news.list]
        }
      }
    case constants.RESET_NEWS_COUNT:
      return {
        ...state,
        news: {
          ...state.news,
          count: 0,
        }
      }
    case constants.SIGNED_OUT:
      return initialState;
    default:
      return state
  }
}

//news
export const getNews = state => state.news

export default newsReducer