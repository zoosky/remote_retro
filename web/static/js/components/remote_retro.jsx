import React, { Component, PropTypes } from "react"
import { Presence } from "phoenix"
import SimpleWebRTC from "simplewebrtc"
import update from "immutability-helper"

import * as AppPropTypes from "../prop_types"
import Room from "./room"

const updateIdeas = (ideas, idOfIdeaToUpdate, newAttributes) => {
  const index = ideas.findIndex(idea => idOfIdeaToUpdate === idea.id)
  return update(ideas, {
    [index]: { $set: { ...ideas[index], ...newAttributes } },
  })
}

const updatePresences = (presences, userToken, newAttributes) => {
  const user = presences[userToken].user
  return update(presences, {
    [userToken]: {
      user: { $set: { ...user, ...newAttributes } }
    },
  })
}

class RemoteRetro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      presences: {},
      ideas: [],
      stage: "idea-generation",
    }
  }

  componentWillMount() {
    const { retroChannel } = this.props

    retroChannel.join()
      .receive("ok", () => console.log("joined"))
      .receive("error", error => console.error(error))

    retroChannel.on("presence_state", presences => this.setState({ presences }))

    retroChannel.on("retro_state", retroState => {
      this.setState(retroState)
    })

    retroChannel.on("new_idea_received", newIdea => {
      this.setState({ ideas: [...this.state.ideas, newIdea] })
    })

    retroChannel.on("proceed_to_next_stage", payload => {
      this.setState({ stage: payload.stage })
      if (payload.stage === "action-item-distribution") {
        alert(
          "The facilitator has distibuted this retro's action items. You will receive an email breakdown shortly."
        )
      }
    })

    retroChannel.on("user_typing_idea", payload => {
      let newPresences = updatePresences(this.state.presences, payload.userToken, { is_typing: true, last_typed: Date.now() })
      this.setState({ presences: newPresences })

      const interval = setInterval(() => {
        const presence = this.state.presences[payload.userToken]
        const noNewTypingEventsReceived = (Date.now() - presence.user.last_typed) > 650
        if (noNewTypingEventsReceived) {
          clearInterval(interval)
          newPresences = updatePresences(this.state.presences, payload.userToken, { is_typing: false })
          this.setState({ presences: newPresences })
        }
      }, 10)
    })

    retroChannel.on("enable_edit_state", nominatedIdea => {
      const newIdeas = updateIdeas(this.state.ideas, nominatedIdea.id, { editing: true })
      this.setState({ ideas: newIdeas })
    })

    retroChannel.on("disable_edit_state", disabledIdea => {
      const { ideas } = this.state
      const newIdeas = updateIdeas(ideas, disabledIdea.id, { editing: false, liveEditText: null })
      this.setState({ ideas: newIdeas })
    })

    retroChannel.on("idea_live_edit", editedIdea => {
      const newIdeas = updateIdeas(this.state.ideas, editedIdea.id, editedIdea)
      this.setState({ ideas: newIdeas })
    })

    retroChannel.on("idea_edited", editedIdea => {
      const updatedIdea = { ...editedIdea, editing: false, liveEditText: null }
      const newIdeas = updateIdeas(this.state.ideas, editedIdea.id, updatedIdea)
      this.setState({ ideas: newIdeas })
    })

    retroChannel.on("idea_deleted", deletedIdea => {
      const ideas = this.state.ideas.filter(idea => idea.id !== deletedIdea.id)
      this.setState({ ideas })
    })

    const timeout = setTimeout(() => {
      let peerConnectionConfig
      $.get("https://service.xirsys.com/ice", {
        ident: "vanderhoop",
        secret: "82b5a4fc-3a2b-11e7-85a3-64eeb285e4c6",
        domain: "www.remote-retro-stride.org",
        application: "default",
        room: "default",
        secure: 1,
      }, (data, status) => {
        peerConnectionConfig = data.d
        console.error("peerConnectionConfig", peerConnectionConfig)
        const webrtc = new SimpleWebRTC({
          localVideoEl: `${userToken}-video-container`,
          autoRequestMedia: true,
          nick: userToken,
          debug: true,
          peerConnectionConfig,
        })

        webrtc.on("readyToCall", () => {
          webrtc.joinRoom(window.retroUUID)
        })

        webrtc.on("videoAdded", (video, peer) => {
          peer.pc.on("iceConnectionStateChange", (event) => {
            if (peer.pc.iceConnectionState === "connected" || peer.pc.iceConnectionState === "completed") {
              let newPresences = updatePresences(this.state.presences, peer.nick, { video })
              this.setState({ presences: newPresences })
            }
          })
        })

        clearTimeout(timeout)
      })
    }, 500)
  }

  render() {
    const { userToken, retroChannel } = this.props
    const { presences, ideas, stage } = this.state

    const users = Presence.list(presences, (_username, presence) => (presence.user))
    const currentPresence = presences[userToken]

    return (
      <Room
        currentPresence={currentPresence}
        users={users}
        ideas={ideas}
        stage={stage}
        retroChannel={retroChannel}
      />
    )
  }
}

RemoteRetro.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  userToken: PropTypes.string.isRequired,
}

export default RemoteRetro
