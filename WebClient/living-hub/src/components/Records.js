import React, { useEffect } from "react";
import history from "../history";
import { useDispatch, useSelector } from "react-redux";
import { setQueryString, selectDocument } from "../actions";
import { Button, Card, Label } from "semantic-ui-react";

const Records = ({ runQuery }) => {
  const session = useSelector((state) => state.session);
  const index = useSelector((state) => state.index);
  const documents = useSelector((state) => state.documents);
  const document = useSelector((state) => state.document);
  const queryString = useSelector((state) => state.queryString);
  const dispatch = useDispatch();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      runQuery();
    }, 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [queryString, runQuery]);

  useEffect(() => {
    runQuery();
  }, [document, runQuery]);

  const createCards = () => {
    return documents.map((document) => {
      return createACard(document);
    });
  };

  const createACard = (document) => {
    return (
      <Card>
        <Card.Content>
          <i classname="file alternate outline icon large right floated" />
          <Card.Header>{document.title}</Card.Header>
          <Card.Meta>Date: {document.date}</Card.Meta>
          <Card.Meta>DOI: {document.doi}</Card.Meta>
          <Card.Description>Note about the record: ...</Card.Description>
        </Card.Content>

        <Card.Content extra>
          {createLabels(document)}
          <br />
          <div className="ui two buttons">
            <Button
              basic
              color="blue"
              onClick={() => {
                dispatch(selectDocument(document));
                history.push("/edit");
              }}
            >
              Edit/Delete
            </Button>
          </div>
        </Card.Content>
      </Card>
    );
  };

  const createLabels = (document) => {
    return (
      <div>
        <Label
          as="a"
          color="blue"
          tag
          style={{ marginBottom: "0.5em" }}
          onClick={() => {
            dispatch(setQueryString(document.language));
          }}
        >
          Language: {document.language}
        </Label>
        <br />
        <Label
          as="a"
          color="red"
          tag
          style={{ marginBottom: "0.5em" }}
          onClick={() => {
            dispatch(setQueryString(document.measurement));
          }}
        >
          Measurement: {document.measurement}
        </Label>
        {/* <br />
        <Label
          as="a"
          color="blue"
          tag
          style={{ marginBottom: "0.5em" }}
          onClick={() => {
            dispatch(setQueryString(document.method));
          }}
        >
          Primary Method: {document.method}
        </Label>
        <br /> */}
        <Label
          as="a"
          color="orange"
          tag
          style={{ marginBottom: "0.5em" }}
          onClick={() => {
            dispatch(setQueryString(document.method2));
          }}
        >
          Secondary Method: {document.method2}
        </Label>
        {/* <br />
        <Label
          as="a"
          color="blue"
          tag
          style={{ marginBottom: "0.5em" }}
          onClick={() => {
            dispatch(setQueryString(document.validation));
          }}
        >
          Validation: {document.validation}
        </Label>
        <br /> */}
      </div>
    );
  };

  return (
    <Card.Group stackable itemsPerRow={3}>
      {createCards()}
    </Card.Group>
  );
};

export default Records;
