import { useQueryGQL, Loading, LoadingError } from "../index";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link, useParams } from "react-router-dom";

import { root } from "../index";
import { ArealSmall } from "./areal";
import { TeacherMedium } from "../person/teacher";

const buildingRoot = root + '/areals/building';
export const BuildingSmall = (props) => {
    return <Link to={buildingRoot + `/${props.id}`}>{props.name}{props.children}</Link>
}

export const BuildingMedium = (props) => {
    return (
        <Card>
            <Card.Header>
                Budova
            </Card.Header>
            <Card.Body>
                {JSON.stringify(props)}
            </Card.Body>
        </Card>
    )
}


export const BuildingRoomList = (props) => {
    return (
        <Card>
        <Card.Header>
            Místnosti
        </Card.Header>
        <Card.Body>
            {JSON.stringify(props)}
        </Card.Body>
    </Card>
    )
}

export const BuildingSpravce = (props) => {
    const spravceProps = {
        'id': 1,
        'name': 'Petr Jana',
        'surname': 'Novak',
        'email': 'petr.jana.novak@uni.world'
    }
    return (
        <TeacherMedium label='Správce' {...spravceProps}/>
    )
}

export const BuildingLarge = (props) => {
    return (
        <Card>
            <Card.Header>
                {props.name} (<ArealSmall {...props.areal}/>)
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={3}>
                        <BuildingSpravce {...props}/>
                    </Col>
                    <Col>
                        <BuildingRoomList {...props}/>
                    </Col>
                </Row>
                
            </Card.Body>
        </Card>
    )
}

export const BuildingLargeStoryBook = (props) => {
    const extraProps = {
        'id' : 1,
        'name' : 'KŠ/9A',
        'rooms' : [
            {'id': 1, 'name': 'KŠ/9A/586'},
            {'id': 2, 'name': 'KŠ/9A/584'},
            {'id': 3, 'name': 'KŠ/9A/583'},
            {'id': 4, 'name': 'KŠ/9A/588'},
            {'id': 5, 'name': 'KŠ/9A/589'},
        ],
        'areal' : {'id' : 1, 'name': 'KŠ'},
        'user' : {'id' : 1, 'name': 'John', 'surname': 'Nowick'}
    }

   
    return <BuildingLarge {...extraProps} {...props} />
}

export const BuildingLargeQuery = (id) => 
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
                    building(id:${id}) {
                      id
                      name
                      
                      rooms {
                        id
                        name
                      }
                      
                      areal: area {
                        id
                        name
                      }
                    }
                  }
            `
        }),
    })

export const BuildingFetching = (props) => {
    const [state, error] = useQueryGQL(props.id, BuildingLargeQuery, (response) => response.data.building, [props.id])
    
    if (error != null) {
        return <LoadingError error={error} />
    } else if (state != null) {
        return <BuildingLargeStoryBook {...state} />
    } else {
        return <Loading>Budova {props.id}</Loading>
    }
}

export const BuildingPage = (props) => {
    const { id } = useParams();

    return <BuildingFetching {...props} id={id} />;

}

export const BuildingPage_ = (props) => {
    const { id } = useParams();

    return <BuildingLargeStoryBook {...props} id={id} />;

}