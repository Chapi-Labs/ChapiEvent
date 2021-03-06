import React from 'react';
import {
  Body,
  Button,
  Container,
  Content,
  Header,
  Icon,
  ListItem,
  Right,
  Segment,
  Text,
  Title,
  View,
} from 'native-base';

import { Actions } from 'react-native-router-flux';
import EventComponent from './Event';
import Loading from './Loading';
import EventContainer from '../../containers/Event';
import DefaultProps from '../constants/navigation';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first: true,
      second: false,
      third: false,
      active: 'first',
      events: [],
    };
  }

  async componentDidMount() {
    const { onEventsRetrieve } = this.props;
    const result = await onEventsRetrieve(this.state);
    this.setState(prevState => ({ ...prevState, events: result }));
  }

  changeDay(param) {
    const { onEventsRetrieve } = this.props;
    this.setState(
      {
        first: false,
        second: false,
        third: false,
        [param]: true,
        active: param,
      },
      async () => {
        const result = await onEventsRetrieve(this.state);
        this.setState(prevState => ({ ...prevState, events: result }));
      },
    );
  }

  render() {
    const { first, second, third, events } = this.state;
    const { loading } = this.props; 
    if (loading) return <Loading />;
    const searchResults = p => p.map(ev => (
      <ListItem
        key={ev._id}
        button
        itemDivider
        selected
        onPress={() => Actions.push('event', {
          back: false,
          component: EventContainer,
          Layout: EventComponent,
          event: ev,
          ...DefaultProps.navbarProps,
        })
        }
      >
        <Body>
          <Text>{ev.name}</Text>
          <Text note>{ev.description}</Text>
        </Body>
        <Right>
          {ev.qr === true ? (
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          ) : null}
        </Right>
      </ListItem>
    ));
    return (
      <Container>
        <Header hasSegment>
          <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Title>Días</Title>
          </Body>
        </Header>
        <Segment>
          <Button first active={first} onPress={() => this.changeDay('first')}>
            <Text>Día 1</Text>
          </Button>
          <Button active={second} onPress={() => this.changeDay('second')}>
            <Text>Día 2</Text>
          </Button>
          <Button last active={third} onPress={() => this.changeDay('third')}>
            <Text>Día 3</Text>
          </Button>
        </Segment>
        <Content padder>
          {events.map((event, index) => {
            const List = searchResults(event.events);
            return (
              <View key={index}>
                <ListItem>
                  <Text>
                    {event.hour}
                  </Text>
                </ListItem>
                {List}
              </View>
            );
          })}
        </Content>
      </Container>
    );
  }
}

export default Home;
