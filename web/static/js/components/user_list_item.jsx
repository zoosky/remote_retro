import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/user_list_item.css"

class UserListItem extends Component {
  render() {
    let userName = this.props.user.given_name
    if (this.props.user.is_facilitator) userName += " (Facilitator)"

    return (
      <li className={`item ${styles.wrapper}`}>
        <div className="ui center aligned grid">
          <div id={`${this.props.user.token}-video-container`} className={styles.video}>
          </div>
          <div className="ui row">
            <p className={styles.name}>{ userName }</p>
            <p className={`${styles.ellipsisAnim} ui row`}>
              { this.props.user.is_typing &&
                <span>
                  <i className="circle icon" />
                  <i className="circle icon" />
                  <i className="circle icon" />
                </span>
              }
            </p>
          </div>
        </div>
      </li>
    )
  }
}

const IconTag = user => {
  let icon

  if (user.picture) {
    const src = user.picture.replace("sz=50", "sz=200")
    icon = <img className={styles.picture} src={src} alt={user.given_name} />
  } else {
    icon = <i className="huge user icon" />
  }

  return icon
}

UserListItem.propTypes = {
  user: AppPropTypes.user.isRequired,
}

export default UserListItem
