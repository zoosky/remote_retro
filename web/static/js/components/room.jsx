import React from "react"
import PropTypes from "prop-types"
import PrimeDirectiveStage from "./prime_directive_stage"
import LobbyStage from "./lobby_stage"
import IdeaGenerationStage from "./idea_generation_stage"
import GroupingStage from "./grouping_stage"
import stageConfigs from "../configs/stage_configs"
import STAGES from "../configs/stages"

import * as AppPropTypes from "../prop_types"

const { LOBBY, PRIME_DIRECTIVE, GROUPING } = STAGES

const Room = props => {
  let roomContents
  const { stage, currentUser: { is_facilitator: isFacilitator } } = props
  const stageConfig = stageConfigs[stage]

  if (stage === LOBBY) {
    roomContents = (
      <LobbyStage
        {...props}
        progressionConfig={stageConfig}
        isFacilitator={isFacilitator}
      />
    )
  } else if (stage === PRIME_DIRECTIVE) {
    roomContents = (
      <PrimeDirectiveStage
        {...props}
        progressionConfig={stageConfig}
        isFacilitator={isFacilitator}
      />
    )
  } else if (stage === GROUPING) {
    roomContents = (
      <GroupingStage
        {...props}
        progressionConfig={stageConfig}
        isFacilitator={isFacilitator}
      />
    )
  } else {
    roomContents = <IdeaGenerationStage {...props} />
  }

  return roomContents
}

Room.propTypes = {
  stage: AppPropTypes.stage.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  actions: PropTypes.object.isRequired,
}

export default Room
