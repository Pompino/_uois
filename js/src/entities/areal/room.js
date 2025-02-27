import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";

import { root } from "../index";

import { useQueryGQL, Loading, LoadingError } from ".."
import { TeacherSmall } from "../person/teacher";
import { ArealSmall } from "./areal";
import { BuildingSmall } from "./building";
import { TimeTableMedium } from "../timetable/timetable";

const roomRoot = root + '/areals/room';
export const RoomSmall = (props) => {
    return (
        <Link to={`${roomRoot}/${props.id}`}>{props.name} {props.children} </Link>
    )
}

export const RoomMedium = (props) => {
    return (
        <Card>
            <Card.Header>{props.label || 'Místnost'}  <RoomSmall {...props} /></Card.Header>
            <Card.Body>
                <br/>
                {props.children}
            </Card.Body>
        </Card>
    )
}

export const RoomSpravce = (props) => {
    const spravce = props.spravce
    return (
        <Card>
            <Card.Header>
                <Card.Title>Správce <TeacherSmall {...props.spravce}/> </Card.Title>
            </Card.Header>
            <Card.Body>
                <b>E-mail:</b> {spravce.email}<br />
                <b>Telefon:</b> {spravce.phone ? props.phone : 'Neuvedeno'}<br />
            </Card.Body>
        </Card>
    )
}

export const RoomParameters = (props) => {
    return (
        <Card>
            <Card.Header>
                <Card.Title>Vybavení</Card.Title>
            </Card.Header>
            <Card.Body>
                {JSON.stringify(props)}
            </Card.Body>
            <Card.Body>
                <Button variant='outline-primary'>Nahlásit poškození</Button>
            </Card.Body>
        </Card>
    )
}

export const RoomLarge = (props) => {
    return (
        <Card>
            <Card.Header>
                <Card.Title>
                Místnost {props.name} ({props.id}) <BuildingSmall {...props.building}/>
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={3}>
                        <RoomSpravce {...props} />
                    </Col>
                    <Col md={6}>
                        <TimeTableMedium type={'student'} id={1} />
                    </Col>
                    <Col md={3}>
                        <RoomParameters {...props}/>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export const RoomLargeStoryBook = (props) => {
    const extraProps = {
        'id': 1,
        'name': '100',
        'building': {
            'id': 1,
            'name': 'K65',
            'areal': {
                'id': 1,
                'name': 'K65'
            }
        },
        'spravce': {
            'id': 1,
            'name': 'Josef Jiří',
            'surname': 'Novák',
            'email': 'josef.jiri.novak@university.world'
        },
        'kapacita': 10,
        'rozmery': {
            'delka': 5,
            'sirka': 10
        },
        'vybaveni': {
            'projektor': 1,
            'internet': 6,
            'telefon': '222222'
        }

        }
    return <RoomLarge {...extraProps} {...props} />
}

export const RoomLargeQuery = (id) =>
    fetch('/gql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        redirect: 'follow', // manual, *follow, error
        body: JSON.stringify({
            "query":
                `
                query {
                    room(id:${id}) {
                        id
                        name
                        building {
                            id 
                            name

                            areal {
                                id
                                name
                            }
                        }
                }
            `
        }),
    })

export const RoomFetching = (props) => {
    const [state, error] = useQueryGQL(props.id, RoomLargeQuery, (response) => response.data.room, [props.id])
    
    if (error != null) {
        return <LoadingError error={error} />
    } else if (state != null) {
        return <RoomLargeStoryBook {...state} />
    } else {
        return <Loading>Budova {props.id}</Loading>
    }
}

export const RoomPage = (props) => {
    const { id } = useParams();
    return (
        <RoomLargeStoryBook {...props} id={id}/>
    )
}