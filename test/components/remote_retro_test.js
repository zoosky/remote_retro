import React from "react"
import { spy } from "sinon"
import { shallow } from "enzyme"

import ViewportMetaTag from "../../web/static/js/components/viewport_meta_tag"
import { RemoteRetro } from "../../web/static/js/components/remote_retro"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, CLOSED, GROUPING } = STAGES

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
    browser: { orientation: "landscape" },
    ideas: [],
    stage: IDEA_GENERATION,
    facilitatorName: "Daniel Handpan",
    retro: { stage: IDEA_GENERATION },
    actions: {
      newFacilitator: () => {},
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
        newFacilitator: spy(),
      }
    })

    it("calls the new facilitator action", () => {
      const wrapper = shallow(<RemoteRetro {...defaultProps} actions={actions} />)
      wrapper.setProps({ currentUser: newFacilitator })
      expect(actions.newFacilitator).to.have.been.called
    })
  })

  describe("when component updates without changing the current user's facilitatorship ", () => {
    const actions = {
      newFacilitator: spy(),
    }

    it("does not call the new facilitator action", () => {
      const wrapper = shallow(<RemoteRetro {...defaultProps} actions={actions} />)
      wrapper.setProps({ stage: CLOSED, currentUser: stubUser })
      expect(actions.newFacilitator).not.to.have.been.called
    })
  })

  // we can't afford to have this integration break, as it could b0rk
  it("renders a ViewportMetaTag, passing stage, alert, and browser orientation", () => {
    const wrapper = shallow(
      <RemoteRetro
        {...defaultProps}
        alert={{ derp: "herp" }}
        browser={{ orientation: "portrait" }}
        stage="lobby"
      />
    )

    expect(wrapper.find(ViewportMetaTag).props()).to.eql({
      alert: { derp: "herp" },
      stage: "lobby",
      browserOrientation: "portrait",
    })
  })
})
