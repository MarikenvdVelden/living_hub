import hashlib
import json
import logging
from typing import Mapping, List

from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

es = Elasticsearch()

SYS_INDEX = "living_hub_system"
SYS_MAPPING = "sys"
# REQUIRED_FIELDS = ["title", "date", "text"]
REQUIRED_FIELDS = []
# HASH_FIELDS = REQUIRED_FIELDS + ["url"]
HASH_FIELDS = ["id","doi","language","method","method2","measurement","validation"]
DEFAULT_QUERY_FIELDS = HASH_FIELDS

ES_MAPPINGS = {
   'int': {"type": "long"},
   'date': {"type": "date", "format": "strict_date_optional_time"},
   'num': {"type": "double"},
   'keyword': {"type": "keyword"},
   'text': {"type": "text"},
   'object': {"type": "object"},
   }


def setup_elastic(*hosts):
    """
    Check whether we can connect with elastic
    """
    global es
    logging.debug("Connecting with elasticsearch at {}".format(hosts or "(default: localhost:9200)"))
    es = Elasticsearch(hosts or None)
    if not es.ping():
        raise Exception("Cannot connect to elasticsearch server [{}]".format(hosts))
    if not es.indices.exists(SYS_INDEX):
        logging.info("Creating livingHub system index: {}".format(SYS_INDEX))
        es.indices.create(SYS_INDEX)


def _list_indices(exclude_system_index=True) -> [str]:
    """
    List all indices on the connected elastic cluster.
    You should probably use the methods in amcat4.index rather than this.
    """
    result = es.indices.get("*")
    return [x for x in result.keys() if not (exclude_system_index and x == SYS_INDEX)]


def _create_index(name: str) -> None:
    """
    Create a new index
    You should probably use the methods in amcat4.index rather than this.
    """
    fields = {'text': ES_MAPPINGS['text'],
              'title': ES_MAPPINGS['text'],
              'date': ES_MAPPINGS['date'],
              'url': ES_MAPPINGS['keyword']}
    body = {'mappings':
                     {'properties': fields}}
    es.indices.create(index=name, body=body)
    # es.indices.create(index=name)


def _delete_index(name: str, ignore_missing=False) -> None:
    """
    Delete an index
    You should probably use the methods in amcat4.index rather than this.
    :param name: The name of the new index (without prefix)
    :param ignore_missing: If True, do not throw exception if index does not exist
    """
    es.indices.delete(index=name, ignore=([404] if ignore_missing else []))


def _get_hash(document):
    """
    Get the hash for a document
    """
    hash_dict = {key: document.get(key) for key in HASH_FIELDS}
    hash_str = json.dumps(hash_dict, sort_keys=True, ensure_ascii=True).encode('ascii')
    m = hashlib.sha224()
    m.update(hash_str)
    return m.hexdigest()


def _get_es_actions(index, documents):
    """
    Create the Elasticsearch bulk actions from article dicts.
    If you provide a list to ID_SEQ_LIST, the hashes are copied there
    """
    for document in documents:
        for f in REQUIRED_FIELDS:
            if f not in document:
                raise ValueError("Field {f!r} not present in document {document}".format(**locals()))
        if '_id' not in document:
            document['_id'] = _get_hash(document)
        yield {
            "_index": index,
            **document
        }


def upload_documents(index: str, documents, columns: Mapping[str, str] = None) -> List[str]:
    """
    Upload documents to this index

    :param index: The name of the index (without prefix)
    :param documents: A sequence of article dictionaries
    :param columns: A mapping of field:type for column types
    :return: the list of document ids
    """
    if columns:
        mapping = {field: ES_MAPPINGS[type_] for (field, type_) in columns.items()}
        body = {"properties": mapping}
        es.indices.put_mapping(index=index, body=body)

    actions = list(_get_es_actions(index, documents))
    bulk(es, actions)
    return [action['_id'] for action in actions]


def get_document(index: str, doc_id: str, **kargs) -> dict:
    """
    Get a single document from this index

    :param index: The name of the index
    :param doc_id: The document id (hash)
    :return: the source dict of the document
    """
    return es.get(index=index, id=doc_id, **kargs)['_source']


def update_document(index: str, doc_id: str, fields: dict):
    """
    Update a single document


    :param index: The name of the index
    :param doc_id: The document id (hash)
    :param fields: a {field: value} mapping of fields to update
    """
    body = {"doc": fields}
    es.update(index=index, id=doc_id, body=body)


def delete_document(index: str, doc_id: str):
    """
    delete a single document


    :param index: The name of the index
    :param doc_id: The document id (hash)
    """
    es.delete(index=index, id=doc_id)


def get_fields(index: str) -> Mapping[str, str]:
    """
    Get the field types in use in this index
    :param index:
    :return: a dictionary of field: type
    """
    r = es.indices.get_mapping(index=index)
    fields = r[index]['mappings']['properties']
    return {k:v['type'] for (k,v) in fields.items()}


def field_type(index: str, field_name: str) -> str:
    """
    Get the field type for the given field.
    :return: a type name ('text', 'date', ..)
    """
    # TODO: [WvA] cache this as it should be invariant
    return get_fields(index)[field_name]


def get_values(index: str, field: str) -> List[str]:
    """
    Get the values for a given field (e.g. to populate list of filter values on keyword field)
    :param index: The index
    :param field: The field name
    :return: A list of values
    """
    body = {"size": 0, "aggs": {"values": {"terms": {"field": field}}}}
    r = es.search(index=index, body=body)
    return [x["key"] for x in r["aggregations"]["values"]["buckets"]]


def refresh(index: str):
    es.indices.refresh(index=index)


def index_exists(name: str) -> bool:
    """
    Check if an index with this name exists
    """
    return es.indices.exists(index=name)
