import React from "react";
import { connect } from "react-redux";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import _ from "lodash";

class HeaderMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  renderMenuItems() {
    return this.props.items.map((item, index) => {
      return (
        <Menu.Item
          key={"item-" + index}
          index={index}
          position={item.position}
          as={Link}
          to={item.path}
          header={index === 0}
          disabled={!this.props.session}
          active={item.path === window.location.pathname}
        >
          {item.label}
        </Menu.Item>
      );
    });
  }

  // renderLogoutModal() {
  //   if (!this.props.amcat) return null;
  //   return (
  //     <Modal
  //       closeIcon
  //       open={this.state.open}
  //       trigger={<Menu.Item icon="power off" name="logout" />}
  //       onClose={() => this.setState({ open: false })}
  //       onOpen={() => this.setState({ open: true })}
  //     >
  //       <Header
  //         icon="power off"
  //         content={`Logout from ${this.props.amcat.host}`}
  //       />
  //       <Modal.Content>
  //         <p>Do you really want to logout?</p>
  //       </Modal.Content>
  //       <Modal.Actions>
  //         <Button
  //           color="red"
  //           onClick={() => {
  //             this.setState({ open: false });
  //           }}
  //         >
  //           <Icon name="remove" /> No
  //         </Button>
  //         <Button
  //           color="green"
  //           onClick={() => {
  //             this.props.deleteAmcatSession();
  //             this.setState({ open: false });
  //           }}
  //         >
  //           <Icon name="checkmark" /> Yes
  //         </Button>
  //       </Modal.Actions>
  //     </Modal>
  //   );
  // }

  render() {
    return (
      <Menu color="blue" fixed="top" inverted>
        <Menu.Menu position="left">
          {_.filter(
            this.renderMenuItems(),
            (v) => v.props.position !== "right"
          )}
        </Menu.Menu>
        <Menu.Menu position="right">
          {_.filter(
            this.renderMenuItems(),
            (v) => v.props.position === "right"
          )}
          {/* {this.renderLogoutModal()} */}
        </Menu.Menu>
      </Menu>
    );
  }
}

const MapStateToProps = (state) => {
  return {
    session: state.session,
  };
};

export default connect(MapStateToProps, {})(HeaderMenu);
