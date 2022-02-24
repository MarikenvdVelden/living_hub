export const createSession = (session) => {
  return {
    type: "CREATE_SESSION",
    payload: session,
  };
};

export const deleteSession = () => {
  return {
    type: "DELETE_SESSION",
  };
};

export const selectIndex = (index) => {
  return {
    type: "SELECT_INDEX",
    payload: index,
  };
};

export const setIndices = (indices) => {
  return {
    type: "SET_AMCAT_INDICES",
    payload: indices,
  };
};

export const selectDocument = (document) => {
  return {
    type: "SELECT_ROW",
    payload: document,
  };
};

export const setDocuments = (documents) => {
  return {
    type: "SET_DOCUMENTS",
    payload: documents,
  };
};

export const updateDocument = (document) => {
  return {
    type: "UPDATE_DOCUMENT",
    payload: document,
  };
};

export const uploadDocuments = (documents) => {
  return {
    type: "UPLOAD_DOCUMENTS",
    payload: documents,
  };
};

export const setTokenIndices = (tokenIndices) => {
  return {
    type: "SET_TOKEN_INDICES",
    payload: tokenIndices,
  };
};

export const setIndexFields = (fields) => {
  return {
    type: "SET_INDEX_FIELDS",
    payload: fields,
  };
};

export const setFieldValues = (fieldValues) => {
  return {
    type: "SET_FIELD_VALUES",
    payload: fieldValues,
  };
};

export const setQueryString = (query) => {
  return {
    type: "SET_QUERY_STRING",
    payload: query,
  };
};
