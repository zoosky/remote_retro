import React, { Component } from "react"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/user_list_item.css"

class UserListItem extends Component {
  componentDidUpdate(){
    if (this.props.user.video) {
      this.videoContainer.appendChild(this.props.user.video)
    }
  }

  render() {
    const { user } = this.props
    let userName = user.given_name
    if (user.is_facilitator) userName += " (Facilitator)"

    return (
      <li className={`item ${styles.wrapper}`}>
        <div className="ui center aligned grid">
          { (user.video || user.token === window.userToken) ?
              <div id={`${user.token}-video-container`} ref={videoContainer => this.videoContainer = videoContainer} className={styles.video} />
              : <img className={styles.picture} src={user.picture.replace("sz=50", "sz=200")} alt={user.given_name} />
          }
          <div className="ui row">
            <p className={styles.name}>{ userName }</p>
            <p className={`${styles.ellipsisAnim} ui row`}>
              { user.is_typing &&
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

UserListItem.propTypes = {
  user: AppPropTypes.user.isRequired,
}

export default UserListItem
