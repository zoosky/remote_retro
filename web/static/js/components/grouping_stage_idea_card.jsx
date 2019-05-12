import React, { Component } from "react"
import PropTypes from "prop-types"
import { DragSource } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"
import * as AppPropTypes from "../prop_types"

import { dragSourceSpec, collect } from "./draggable_idea_content"
import styles from "./css_modules/grouping_stage_idea_card.css"

// eslint-disable-next-line
export class GroupingStageIdeaCard extends Component {
  componentDidMount() {
    const { connectDragPreview } = this.props
    if (connectDragPreview) {
      // Use empty image as a drag preview so browsers don't draw it
      // and we can draw whatever we want on the custom drag layer instead.
      connectDragPreview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true,
      })
    }
  }

  render() {
    const {
      idea,
      touchEventDragPreviewStyles,
      connectDragSource,
    } = this.props

    let style
    if (idea.x) {
      style = {
        ...touchEventDragPreviewStyles,
        position: "fixed",
        top: 0,
        left: 0,
        transform: `translate(${idea.x}px,${idea.y}px)`,
      }
    } else {
      style = { ...touchEventDragPreviewStyles }
    }

    return connectDragSource(
      <div className={styles.wrapper} style={style}>
        <p>{idea.body}</p>
      </div>
    )
  }
}

GroupingStageIdeaCard.propTypes = {
  idea: AppPropTypes.idea.isRequired,
  touchEventDragPreviewStyles: PropTypes.object,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
}

GroupingStageIdeaCard.defaultProps = {
  touchEventDragPreviewStyles: {},
  connectDragSource: node => node,
  connectDragPreview: null,
}

export default DragSource(
  "GROUPING_STAGE_IDEA_CARD",
  dragSourceSpec,
  collect
)(GroupingStageIdeaCard)
