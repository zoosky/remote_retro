import React from "react"
import { spy } from "sinon"
import { shallow } from "enzyme"


import { RemoteRetro } from "../../web/static/js/components/remote_retro"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, CLOSED } = STAGES

describe("RemoteRetro component", () => {
  const mockRetroChannel = {}
  const stubUser = {
    given_name: "Mugatu",
    is_facilitator: false,
  }
  const defaultProps = {
    currentUser: stubUser,
    retroChannel: mockRetroChannel,
    isTabletOrAbove: true,
    presences: [],
    ideas: [],
    stage: IDEA_GENERATION,
    facilitatorName: "Daniel Handpan",
    ideaGenerationCategories: ["happy", "sad", "confused"],
    stageConfig: {},
    retro: { stage: IDEA_GENERATION },
    actions: {
      currentUserHasBecomeFacilitator: () => {},
    },
  }

  context("when the component mounts", () => {
    it("triggers a hotjar event, passing the stage", () => {
      const hotjarSpy = spy(global, "hj")

      mountWithConnectedSubcomponents(
        <RemoteRetro {...defaultProps} stage={CLOSED} />
      )

      expect(hotjarSpy).calledWith("trigger", CLOSED)
    })
  })

  describe("when component updates with a new facilitator", () => {
    let newFacilitator
    let actions

    beforeEach(() => {
      newFacilitator = {
        ...stubUser,
        is_facilitator: true,
      }

      actions = {
        currentUserHasBecomeFacilitator: spy(),
      }
    })

    it("calls the new facilitator action", () => {
      const wrapper = shallow(<RemoteRetro {...defaultProps} actions={actions} />)
      wrapper.setProps({ currentUser: newFacilitator })
      expect(actions.currentUserHasBecomeFacilitator).to.have.been.called
    })
  })

  describe("when component updates without the current user's facilitatorship ", () => {
    const actions = {
      currentUserHasBecomeFacilitator: spy(),
    }

    it("does not call the new facilitator action", () => {
      const wrapper = shallow(<RemoteRetro {...defaultProps} actions={actions} />)
      wrapper.setProps({ stage: CLOSED, currentUser: stubUser })
      expect(actions.currentUserHasBecomeFacilitator).not.to.have.been.called
    })
  })
})
