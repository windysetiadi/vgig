import React, {useEffect, useContext} from "react"
import { useParams } from "react-router-dom";
import styled from "styled-components"
import Audience from "./Audience"
import Orchestra from "./Orchestra"
import Interactions from "./Interactions"

import Context from "../Context"
import {NAME} from  "../constants"
import { useClient } from "../mqttConnection"

const Container = styled.div`
    .audience {
        width: 100%;
        height: 33%;
    }
    width: 100%;
    height: 100%;
`
export default () => {
    const { id } = useParams();
    const [context, setContext] = useContext(Context)
    const { publish } = useClient()

    useEffect(()=> {
        console.log("entering")
        setContext({...context, hallId: id})
        publish(`${NAME}/${id}/enter`, {userId: context.userId})
    },[id])


    return (
        <Container>
            <Orchestra className="orchestra" id={id}></Orchestra>
            <Audience className="audience" id={id}></Audience>
            <Interactions className="interactions" id={id}></Interactions>
        </Container>
    )
}