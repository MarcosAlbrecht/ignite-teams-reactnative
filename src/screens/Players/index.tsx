import { Button } from "@components/Button";
import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/HighLight";
import { Input } from "@components/Input";
import { ListEmpty } from "@components/ListEmpty";
import { PlayerCard } from "@components/PlayerCard";

import { useState } from "react";
import { FlatList } from "react-native";
import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";

export function Players(){
    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState([]);

    return(
        <Container>
            <Header showBackButton />

            <Highlight title="Nome da turma" subtitle="adicione a galera e separa os times"/>

            <Form>
                <Input 
                    placeholder="Nome da pessoa"
                    autoCorrect={false}
                />
                <ButtonIcon 
                    icon="add"  
                />
            </Form>

            <HeaderList>
                <FlatList
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({item}) => (
                        <Filter 
                            title={item}
                            isActivity={item === team} 
                            onPress={() => setTeam(item) }
                        />
                    ) }
                    horizontal
                >

                </FlatList>
                <NumbersOfPlayers>{players.length}</NumbersOfPlayers>
                
            </HeaderList>

            <FlatList
                data={players}
                keyExtractor={item => item}
                renderItem={({item}) => (
                    <PlayerCard 
                    name={item}
                    onRemove={() => {} }
                    />
                ) }
                ListEmptyComponent={() => <ListEmpty message="Não há pessoas nesse time" />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    { paddingBottom: 100 },
                    players.length === 0 && {flex: 1}
                ]}
                
            >
            </FlatList>
            <Button title="Remover Turma" type='SECONDARY'/>
           
        </Container>
    )
}