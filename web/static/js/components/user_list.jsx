import React from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import PropTypes from "prop-types"
import findIndex from "lodash/findIndex"

import UserListItem from "./user_list_item"

import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/user_list.css"
import { selectors } from "../redux/users_by_id"

export const UserList = ({ presences, wrap }) => {
  if (presences.length === 0) { return null }

  const sortedByArrival = presences.sort((a, b) => a.online_at - b.online_at)
  const indexOfFacilitator = findIndex(sortedByArrival, presence => presence.is_facilitator)

  const nonFacilitators = [
    ...sortedByArrival.slice(0, indexOfFacilitator),
    ...sortedByArrival.slice(indexOfFacilitator + 1),
  ]

  // account for cases where the facilitator isn't present
  // (comp falls asleep, browser refresh, et cetera)
  const presencesToRender = indexOfFacilitator === -1
    ? sortedByArrival
    : [presences[indexOfFacilitator], ...nonFacilitators]

  const listItems = presencesToRender.map(presence => {
    return <UserListItem key={presence.token} user={presence} />
  })

  const userListClasses = classNames("ui tiny horizontal list", { wrap })

  return (
    <section className={`${styles.index} ui center aligned basic segment`}>
      <ul id="user-list" className={userListClasses}>
        {listItems}
      </ul>
    </section>
  )
}

UserList.propTypes = {
  presences: AppPropTypes.presences.isRequired,
  wrap: PropTypes.bool.isRequired,
}

const mapStateToProps = state => {
  return {
    presences: selectors.getUserPresences(state),
  }
}

export default connect(mapStateToProps)(UserList)
