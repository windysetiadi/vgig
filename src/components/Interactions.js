import React, { useContext, useEffect, useState } from 'react'
import styled from "styled-components"
import Button from '@material-ui/core/Button';
import {Sampler} from "tone"

import Context from "../Context"
import ClappingSample from "../assets/clapping.mp3"
import TalkC2Sample from "../assets/talk_C2.mp3"
import TalkC3Sample from "../assets/talk_C3.mp3"
import TalkC4Sample from "../assets/talk_C4.mp3"
import EnterSample from "../assets/enter.mp3"
import SneezeSample from "../assets/sneeze.mp3"
import PhotographSample from "../assets/photograph.mp3"
import WalkSample from "../assets/walk.mp3"
import {NAME} from  "../constants"
import { useClient } from "../mqttConnection"


const clappingSamples = {
    C3: ClappingSample
}
const enterSamples = {
    C3: EnterSample
}

const Container = styled.div`
position: absolute;
top: 0;
right: 0;
width: 33.33vw;
height: 100vh;
background-color: rgba(144,238,144,0.7);
`

export default () => {
    const [context] = useContext(Context)
    const { subscribe, publish, getClient } = useClient()
    const [enter, setEnter] = useState(null)
    const [clapping, setClapping] = useState(null)
    const [talking, setTalking] = useState(null)
    const [photograph, setPhotograph] = useState(null)
    const [sneeze, setSneeze] = useState(null)
    const [walk, setWalk] = useState(null)

    useEffect(()=>{
        const clapping = new Sampler(clappingSamples);
        clapping.toDestination()
        clapping.volume.value = .2
        setClapping(clapping)

        const talking = new Sampler({
            C2: TalkC2Sample,
            C3: TalkC3Sample,
            C4: TalkC4Sample,
        });

        talking.toDestination()
        talking.volume.value = .2
        setTalking(talking)

        const enter = new Sampler(enterSamples);
        enter.toDestination()
        enter.volume.value = .2
        setEnter(enter)

        const photograph = new Sampler({C3: PhotographSample});
        photograph.toDestination()
        photograph.volume.value = .2
        setPhotograph(photograph)

        const walk = new Sampler({C3: WalkSample});
        walk.toDestination()
        walk.volume.value = .2
        setWalk(walk)

        const sneeze = new Sampler({C3: SneezeSample});
        sneeze.toDestination()
        sneeze.volume.value = .2
        setSneeze(sneeze)

        const client = getClient();
        client.on("connect", () => {
            console.log("client connected")
        })
    }, [])
    useEffect(() => {
        subscribe(`${NAME}/${context.hallId}/clapping`, (topic, message) => {
            clapping.triggerAttackRelease(40 + Math.round(Math.random()*60), 20)
        })
        subscribe(`${NAME}/${context.hallId}/talking`, (topic, message) => {
            talking.triggerAttackRelease(40 + Math.round(Math.random()*60), 20)
        })
        subscribe(`${NAME}/${context.hallId}/enter`, (topic, message) => {
            enter.triggerAttackRelease(72, 20)
            console.log("user entered", message)
        })
        subscribe(`${NAME}/${context.hallId}/leave`, (topic, message) => {
            console.log("user left", message)
        })
        subscribe(`${NAME}/${context.hallId}/photograph`, (topic, message) => {
            photograph.triggerAttackRelease(40 + Math.round(Math.random()*60), 20)
        })
        subscribe(`${NAME}/${context.hallId}/walk`, (topic, message) => {
            walk.triggerAttackRelease(40 + Math.round(Math.random()*60), 20)
        })
        subscribe(`${NAME}/${context.hallId}/sneeze`, (topic, message) => {
            sneeze.triggerAttackRelease(40 + Math.round(Math.random()*60), 20)
        })
    }, [context.hallId])
    
    return (
        <Container>
            <Button variant="contained" color="primary" onClick={() => {
                publish(`${NAME}/${context.hallId}/clapping`, {userId: context.userId})
            }}>
                clapping
            </Button>
            <Button variant="contained" color="primary" onClick={() => {
                publish(`${NAME}/${context.hallId}/talking`, {userId: context.userId})
            }}>
                talking
            </Button>
            <Button variant="contained" color="primary" onClick={() => {
                publish(`${NAME}/${context.hallId}/photograph`, {userId: context.userId})
            }}>
                take photo
            </Button>
            <Button variant="contained" color="primary" onClick={() => {
                publish(`${NAME}/${context.hallId}/walk`, {userId: context.userId})
            }}>
                walk
            </Button>
            <Button variant="contained" color="primary" onClick={() => {
                publish(`${NAME}/${context.hallId}/sneeze`, {userId: context.userId})
            }}>
                sneeze
            </Button>
        </Container>
    )
}