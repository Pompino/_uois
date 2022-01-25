/**
 * Soubor obsahující komponenty Osoba - učitel
 * Obsahuje Small, Medium a Large komponenty 
 * Včetně pomocných komponent pro TeacherPage
 */

import { Link, useParams } from "react-router-dom";

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from "react-bootstrap/Row";
import { useEffect, useState } from "react";

import image from '../rozvrhSnimek.png'
import { DepartmentSmall } from "../group/department";


import { root } from '../index';
import { useQueryGQL, Loading, LoadingError } from "../index";
import { FacultySmall } from "../group/faculty";
import { GroupSmall } from "../group/group";
import { SubjectSmall } from "../studyprogram/subject";
import { TimeTableMedium } from '../timetable/timetable';
import { ArealSmall } from "../areal/areal";
import { BuildingSmall } from "../areal/building";
import { RoomSmall } from "../areal/room";
import { ProgramSmall } from "../studyprogram/studyprogram";

/**
 * Small komponenta obsahující odkaz na konkrétního učitele
 */

export function TeacherSmall(props) {
    return (
        <Link to={root + "/users/teacher/" + (props.id)}>{props.name} {props.surname}</Link>
    )
}

/**
 * Medium komponenta s podrobnějšími informacemi 
 * Obsahuje Small komponenty (odkazy)
 */

export function TeacherMedium(props) {
    return (
        <Card>
            <Card.Header>
                <Card.Title>{props.label} - <TeacherSmall {...props} /></Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    <b>Jméno příjmení:</b> {props.name} {props.surname}<br />
                    <b>Email:</b> {props.email}<br />
                    { props.degreeRank ? (<><b>Titul:</b> { props.degreeRank }<br /></>) : ('')}
                    { props.departments ? (
                        <>
                            <b>Katedra:</b> {
                                props.departments.map((department, index) => {
                                    let element = <DepartmentSmall key={index} {...department} />
                                    if (index > 0) {
                                        return (<>, {element}</>)
                                    } else {
                                        return (element)
                                    }
                            })}<br />
                        </>

                    ) : ('')}
                    {/*<b>Fakulta:</b> {props.faculty}*/}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}


/**
 * Pomocná komponenta (karta) s kontaktními informacemi
 */

function ContactInfo(props) {
    //data=props.datas;
    return (
        <div className="card mb-3">
            <Card.Header>
                <Card.Title>Kontaktní údaje</Card.Title>
            </Card.Header>
            <Card.Body>
                <b>E-mail:</b> {props.email}<br />
                <b>Telefon:</b> {props.phone ? props.phone : 'Neuvedeno'}<br />
                <b>Areál: </b> <ArealSmall {...props.areal} /><br />
                <b>Budova: </b> <BuildingSmall {...props.building} /> <b>Místnost:</b> <RoomSmall {...props.room} /><br />
            </Card.Body>
        </div>
    )
}

const groupTypeComponent = {
    'fakulta': FacultySmall,
    'katedra': DepartmentSmall
}
export const GroupInfo = (props) => {
    const GroupLink = groupTypeComponent[props.grouptype.name] || GroupSmall
    return (
        <>
        <b>{props.grouptype.name}: </b>
        <GroupLink {...props} />
        <br />
        </>
    )
}

export const Membership = (props) => {
    return (
        <div className="card mb-3">
            <Card.Header>
                <Card.Title>Členství</Card.Title>
            </Card.Header>
            <Card.Body>
                {props.groups.map((group, index) => (
                    <GroupInfo key={index} {...group} />
                ))}
            </Card.Body>
        </div>
    )
}

/**
 * Pomocná komponenta seznam skupin
 */

export const TeacherSeznamSkupin = (props) => {
    return (
        <Card>
            <Card.Header>
                <Card.Title>Seznam vyučovaných skupin</Card.Title>
            </Card.Header>
            <Card.Body>
                <GroupSmall name={'23-5KB'} id={1} />
            </Card.Body>
        </Card>
    )
}


/**
 * Pomocná komponenta seznam garancí
 */

export const TeacherGrants = (props) => {
    return (
        <Card>
            <Card.Header>
                <Card.Title>Seznam garancí</Card.Title>
            </Card.Header>
            <Card.Body>
                <ProgramSmall name={'Kybernetická bezpečnost'} id={1} />
            </Card.Body>
        </Card>
    )
}


/**
 * Large komponenta obsahující všechny pomocné komponenty
 */

export function TeacherLarge(props) {
    return (
        <Card>
            <Card.Header>
                <Card.Title>
                    Karta učitele
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={3}>
                        <TeacherMedium label={'Učitel'} {...props}  />
                        <ContactInfo {...props} />
                        <Membership {...props} />
                    </Col>
                    <Col md={6}>
                        <RozvrhMedium {...props}/>
                    </Col>
                    <Col md={3}>
                        <TeacherGrants {...props} />
                        <SeznamPredmetu {...props} />
                        <TeacherSeznamSkupin {...props} />
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

/*
export function TeacherPage(props) {
    const [state, setState] = useState(
        {
            'id': props.id,
            'name': props.name,
            'lastname': props.lastname,
            'degreeRank': 'ing. plk.',
            "email": props.name.toLowerCase() + '.' + props.lastname.toLowerCase() + '1@unob.cz',
            'phone': '973 274 160',
            'areal': 'Kasárny Šumavská',
            'building': '5',
            'room': '104',
            'faculty': [
                { 'id': 23, 'name': 'FVT' }
            ],
            'departments': [
                { 'id': 1, 'name': 'K-209' },
                { 'id': 2, 'name': 'K-207' }
            ],
            'subjects': [
                { 'id': 25, 'name': 'Informatika' },
                { 'id': 1, 'name': 'Analýza informačních zdrojů' },
                { 'id': 4, 'name': 'Kybernetická bezpečnost' },
                { 'id': 5, 'name': 'Počítačové sítě a jejich bezpečnost' }
            ]
        }
    )

    console.log(state)

    useEffect(() => {
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
                    user(id: ${props.id}) {
                        id
                        name
                        lastname
                        degreeRank
                        email
                        phone
                        areal
                        building
                        room
                        faculty: groupsByType(type: 0) {
                            id
                            name
                        }
                        departments: groupsByType(type: 1) {
                            id
                            name
                        }
                        subjects: groupsByType(type: 2) {
                            id
                            name
                        }
                    }
                }
                `
            }),
        })
            .then(response => response.json())
            .then(data => setState(data.data))
            .then(() => console.log('data logged'))
            .catch(error => console.log('error nacteni'))
    }, [props.id])


    return (
        <TeacherLarge {...props} {...state} />
    )
}
*/



// function RozvrhMedium() {
//     return (
//         <Card>
//             <Card.Header>
//                 <Card.Title>Rozvrh tento týden</Card.Title>
//             </Card.Header>
//             <Card.Body>
//                 <img src={image} alt="Rozvrh" width={'100%'} />
//             </Card.Body>
//         </Card>
//     )
// }


/**
 * Pomocná komponenta s rozvrhem
 */

function RozvrhMedium(props) {
    return (
        <TimeTableMedium type={'teacher'} id={props.id} />
    )
}


/**
 * Pomocná komponenta se seznamem předmětů
 */

function SeznamPredmetu(props) {
    let subjects = props.subjects.map((subject, index) => (<li key={index}><SubjectSmall {...subject} /></li>))
    return (
        <div className="card mb-3">
            <Card.Header>
                <Card.Title>Předměty</Card.Title>
            </Card.Header>
            <Card.Body>
                <ul>
                    {subjects}
                </ul>
            </Card.Body>
        </div>
    )
}


export const TeacherLargeQuery = (id) => 
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
                user: person(id: ${id}) {
                    id
                    name
                    surname
                    email
                    groups {
                      id
                      name
                      grouptype {
                        id
                        name
                      }
                    }
                    students {
                      person {
                        id
                        name
                        surname
                        email
                      }
                    }
                  }
            }
            `
        }),
    })

export const TeacherLargeStoryBook = (props) => {
    const extendedProps = {
        'id': props.id || 1,
        'name': 'Alena Josef',
        'surname': 'Krejčí',
        'degreeRank': 'ing. plk.',
        "email": 'alena.josef.krejci@university.world',
        'phone': '973 274 160',
        'areal': {'name': 'Kasárna Šumavská', 'id': 1},
        'building': {'name': '5', 'id': 1},
        'room': {'name': '104', 'id': 1},
        'faculty': [
            { 'id': 23, 'name': 'FVT' }
        ],
        'departments': [
            { 'id': 5, 'name': 'K-209', 'grouptype': { 'name': 'katedra' } },
            { 'id': 6, 'name': 'K-207', 'grouptype': { 'name': 'katedra' } }
        ],
        'groups': [],
        'subjects': [
            { 'id': 25, 'name': 'Informatika' },
            { 'id': 1, 'name': 'Analýza informačních zdrojů' },
            { 'id': 4, 'name': 'Kybernetická bezpečnost' },
            { 'id': 5, 'name': 'Počítačové sítě a jejich bezpečnost' }
        ]
    }
    return <TeacherLarge {...extendedProps} {...props} />;
}

export const TeacherLargeFetching = (props) => {
    const [state, error] = useQueryGQL(props.id, TeacherLargeQuery, (response) => response.data.user, [props.id])
    
    if (error != null) {
        return <LoadingError error={error} />
    } else if (state != null) {
        return <TeacherLargeStoryBook {...state} />
    } else {
        return <Loading>Uživatel {props.id}</Loading>
    }
}

export const TeacherPage = (props) => {
    const { id } = useParams();

    return (
        <TeacherLargeFetching {...props} id={id} />
    )    
}
