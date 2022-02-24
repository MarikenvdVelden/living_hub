import { combineReducers } from "redux";

const session = (state = null, action) => {
  switch (action.type) {
    case "CREATE_SESSION":
      return action.payload;
    case "DELETE_SESSION":
      return null;
    default:
      return state;
  }
};

const index = (state = null, action) => {
  switch (action.type) {
    case "SELECT_INDEX":
      return action.payload;
    default:
      return state;
  }
};

const indices = (state = null, action) => {
  switch (action.type) {
    case "SET_INDICES":
      return action.payload;
    default:
      return state;
  }
};

const documents = (state = [], action) => {
  switch (action.type) {
    case "SET_DOCUMENTS":
      return action.payload;
    default:
      return state;
  }
};

const updateDocument = (state = [], action) => {
  switch (action.type) {
    case "UPDATE_DOCUMENT":
      return { ...action.payload };
    default:
      return state;
  }
};

const document = (state = {}, action) => {
  switch (action.type) {
    case "SELECT_ROW":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const uploadDocuments = (state = [], action) => {
  switch (action.type) {
    case "UPLOAD_DOCUMENTS":
      return [...action.payload];
    default:
      return state;
  }
};

const indexFields = (state = {}, action) => {
  switch (action.type) {
    case "SET_INDEX_FIELDS":
      return action.payload;
    default:
      return state;
  }
};

const fieldValues = (state = {}, action) => {
  switch (action.type) {
    case "SET_FIELD_VALUES":
      return { ...action.payload };
    default:
      return state;
  }
};

const queryString = (state = "", action) => {
  switch (action.type) {
    case "SET_QUERY_STRING":
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  session,
  index,
  indices,
  document,
  documents,
  uploadDocuments,
  updateDocument,
  indexFields,
  fieldValues,
  queryString,
});

export default rootReducer;
