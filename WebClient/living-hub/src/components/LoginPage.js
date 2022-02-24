import React from "react";
import { connect } from "react-redux";
import history from "../history";

import {
  createSession,
  deleteSession,
  selectIndex,
  setIndices,
} from "../actions";
import newElasticSession from "../apis/Elastic";

import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";

const loginColor = "blue";
const logoutColor = "red";
const idleColor = "grey";

// just delete this if you dont want default users
const defaultLoginCredentials = {
  host: "http://127.0.0.1:5001",
  email: "admin",
  password: "admin",
};

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      host: defaultLoginCredentials.host ? defaultLoginCredentials.host : null,
      email: defaultLoginCredentials.email
        ? defaultLoginCredentials.email
        : null,
      password: defaultLoginCredentials.password
        ? defaultLoginCredentials.password
        : null,
      loginStatus: "idle",
    };
  }

  submitForm = async () => {
    this.setState({
      loginStatus: "waiting",
    });

    newElasticSession(this.state.host, this.state.email, this.state.password)
      .then((ElasticSession) => {
        this.props.createSession(ElasticSession);
        this.setState({
          loginStatus: "success",
        });
        this.props.session.getIndices().then((res) => {
          this.props.selectIndex(res.data[0].name);
        });
        history.push(this.props.items[0].path);
      })
      .catch((e) => {
        this.setState({
          loginStatus: "error",
        });
      });
  };

  renderLoginForm() {
    return (
      <Form size="large">
        <Segment stacked>
          <Form.Input
            fluid
            error={this.state.status === "error"}
            value={this.state.host}
            onChange={(e, { value }) => {
              this.setState({
                loginStatus: "idle",
                host: value,
              });
            }}
            icon="home"
            iconPosition="left"
            placeholder="Host"
          />

          <Form.Input
            fluid
            error={this.state.status === "error"}
            value={this.state.email}
            onChange={(e, { value }) => {
              this.setState({
                loginStatus: "idle",
                email: value,
              });
            }}
            icon="user"
            iconPosition="left"
            placeholder="Email adress"
          />

          <Form.Input
            fluid
            error={this.state.status === "error"}
            value={this.state.password}
            onChange={(e, { value }) => {
              this.setState({
                loginStatus: "idle",
                password: value,
              });
            }}
            icon="lock"
            iconPosition="left"
            placeholder="Password"
            type="password"
          />

          <Button
            onClick={this.submitForm}
            color={this.props.session === null ? loginColor : idleColor}
            fluid
            size="large"
          >
            Login!
          </Button>

          <Button
            onClick={() => {
              this.props.deleteSession();
            }}
            color={this.props.session !== null ? logoutColor : idleColor}
            fluid
            size="large"
          >
            Logout!
          </Button>
        </Segment>
      </Form>
    );
  }

  render() {
    return (
      <Grid
        inverted
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color={loginColor} textAlign="center">
            {/* <Image src="/amcat-logo.svg" /> Connect to Server */}
          </Header>
          {this.renderLoginForm()}
          <Message>Don't have an account? So Sad!</Message>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    session: state.session,
    items: ownProps.items,
  };
};

export default connect(mapStateToProps, {
  createSession,
  deleteSession,
  selectIndex,
  setIndices,
})(LoginPage);
