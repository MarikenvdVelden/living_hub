import React from "react";

import _ from "lodash";
import TextareaAutosize from "react-textarea-autosize";
import { connect } from "react-redux";
import { setDocuments, setQueryString } from "../actions";
import FilterForms from "./FilterForms";

import {
  Grid,
  Input,
  Container,
  Divider,
  Segment,
  Button,
  Form,
  Icon,
} from "semantic-ui-react";
import Records from "./Records";

class QueryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryMethod: "POST",
      accordionActive: false,
    };
    this.fields = Object.keys(this.props.fields);
  }

  prepareFilters() {
    this.setState({
      queryMethod: "POST",
    });
    const obj = {};
    const dateFilter = {
      range: {},
    };
    Object.entries(this.props.filters).map((filter) => {
      if (filter[0] === "date") {
        for (const [rangeIndicator, value] of Object.entries(filter[1])) {
          if (value === null || value === "") {
            console.log("here");
            dateFilter.range = _.omit(dateFilter.range, rangeIndicator);
          } else dateFilter.range[rangeIndicator] = value;
        }
        obj["date"] = dateFilter;
      } else {
        obj[filter[0]] = { value: filter[1] };
      }
      return obj;
    });
    return obj;
  }

  runQuery = () => {
    this.props.session
      .postQuery(
        this.props.index,
        this.props.queryString,
        // this.fields,
        "",
        "2m",
        50,
        {},
        { ...this.prepareFilters() }
      )
      .then((res) => {
        this.props.setDocuments(res.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
    return null;
  };

  renderQueryWindow() {
    return (
      <Segment style={{ border: "0" }}>
        <Form style={{ marginBottom: "2em" }}>
          <TextareaAutosize
            width={16}
            value={this.props.queryString ? this.props.queryString : ""}
            style={{ height: 20 }}
            placeholder="Query..."
            onChange={(e) => this.props.setQueryString(e.target.value)}
          />
        </Form>
        <Form style={{ marginBottom: "2em" }}>{this.renderFilters()}</Form>
        <Form>
          <Button.Group widths="2">
            <Button
              primary
              type="submit"
              onClick={() => this.runQuery(this.state.queryMethod)}
            >
              <Icon name="search" />
              Execute Query
            </Button>
          </Button.Group>
        </Form>

        <br />
      </Segment>
    );
  }

  renderFilters() {
    const active = this.state.accordionActive ? "active" : "";

    return (
      <div className="ui styled fluid accordion">
        <div
          className={`title ${active}`}
          onClick={(e) => {
            e.stopPropagation();
            this.setState({
              accordionActive: !this.state.accordionActive,
            });
          }}
        >
          <i className=" dropdown icon"></i>
          Show All Filters
        </div>
        <div className={`content ${active}`}>
          <FilterForms />
        </div>
      </div>
    );
  }

  render() {
    return (
      <Container>
        <Grid>
          <Grid.Column width={16}>
            <Grid.Row>{this.renderQueryWindow()}</Grid.Row>
            <br />
            <Grid.Row>
              <Records runQuery={this.runQuery} />
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    session: state.session,
    index: state.index,
    fields: state.indexFields,
    filters: state.fieldValues,
    queryString: state.queryString,
    documents: state.documents,
  };
};

export default connect(mapStateToProps, { setDocuments, setQueryString })(
  QueryPage
);
