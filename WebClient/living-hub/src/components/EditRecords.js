import React from "react";
import { useDispatch, useSelector } from "react-redux";
import history from "../history";
import { selectDocument } from "../actions";
import { Button, Form, Container, Segment } from "semantic-ui-react";

const EditRecords = () => {
  const session = useSelector((state) => state.session);
  const index = useSelector((state) => state.index);
  const document = useSelector((state) => state.document);
  const dispatch = useDispatch();

  const renderDocumentFields = () => {
    return Object.entries(document).map((keyVal) => {
      return (
        <Form.Field>
          <label>{keyVal[0]}</label>
          <input
            placeholder={keyVal[1]}
            onChange={(val) => {
              document[keyVal[0]] = val.target.value;
              dispatch(selectDocument(document));
            }}
          />
        </Form.Field>
      );
    });
  };

  const renderDocument = () => {
    return (
      <Segment size="small">
        <Form>
          {renderDocumentFields()}
          <Button
            color="blue"
            fluid
            size="large"
            type="submit"
            onClick={() => {
              session
                .updateDocument(index, document._id, { ...document })
                .then((res) => {
                  dispatch(selectDocument(document));
                  // dispatch(updateDocument(document));
                  history.push("/home");
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
          >
            Edit Record!
          </Button>
          <Button
            color="red"
            fluid
            size="large"
            type="submit"
            onClick={() => {
              session
                .deleteDocument(index, document._id)
                .then((res) => {
                  dispatch(selectDocument(null));
                  // dispatch(updateDocument(document));
                  history.push("/home");
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
          >
            Delete Record!
          </Button>
        </Form>
      </Segment>
    );
  };

  if (!document.doi) {
    alert("Select a document First");
  }
  return <Container>{renderDocument()}</Container>;
};

export default EditRecords;
