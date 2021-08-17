import Axios from "axios";
import _ from "lodash";

export default async function newElasticConnection(host, email, password) {
  const response = await Axios.get(`${host}/auth/token/`, {
    auth: { username: email, password: password },
  });
  return new Elastic(host, email, response.data.token);
}

class Elastic {
  constructor(host, email, token) {
    this.host = host;
    this.email = email;
    this.api = Axios.create({
      baseURL: host,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // GET
  getIndices() {
    return this.api.get(`/index/`);
  }
  getIndex(index) {
    return this.api.get(`/index/${index}`);
  }
  getFields(index) {
    return this.api.get(`/index/${index}/fields`);
  }
  getFieldValues(index, field) {
    return this.api.get(`/index/${index}/fields/${field}/values`);
  }
  getDocument(index, doc_id) {
    return this.api.get(`/index/${index}/documents/${doc_id}`);
  }
  updateDocument(index, doc_id, fields) {
    const newFields = _.omit(fields, "_id");
    return this.api.put(`/index/${index}/documents/${doc_id}`, {
      ...newFields,
    });
  }
  deleteDocument(index, doc_id) {
    return this.api.post(`/index/${index}/documents/delete/${doc_id}`);
  }
  getQuery(
    index,
    q,
    fields,
    scroll = "2m",
    per_page = 100,
    params = {},
    filters = {}
  ) {
    params["scroll"] = scroll; // for scrolling, update with id obtained from results.meta.scroll_id
    params["per_page"] = per_page;
    if (fields) params["fields"] = fields.join(",");
    if (q) params["q"] = q;
    if (filters) params = { ...params, ...filters };

    return this.api.get(`/index/${index}/query`, { params });
  }

  postQuery(
    index,
    q,
    fields,
    scroll = "2m",
    per_page = 100,
    params = {},
    filters = {}
  ) {
    params["scroll"] = scroll;
    params["per_page"] = per_page;
    if (fields) params["fields"] = fields.join(",");
    if (q) params["q"] = q;
    if (filters) params["filters"] = { ...filters };

    return this.api.post(`/index/${index}/query`, { ...params });
  }

  // POST
  createIndex(name, guestRole = "NONE") {
    const body = { name: name };
    if (guestRole !== "NONE") body.guest_role = guestRole;
    return this.api.post(`/index/`, body);
  }
  createDocuments(name, documentList) {
    // documentList should be an array of objects with at least the fields title, date and text
    return this.api.post(`/index/${name}/documents`, documentList);
  }

  // DELETE
  deleteIndex(index) {
    return this.api.delete(`/index/${index}`);
  }
}
