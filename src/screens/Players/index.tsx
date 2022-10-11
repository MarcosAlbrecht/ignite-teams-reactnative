import { useState, useEffect, useRef } from "react";
import { useRoute, useNavigation } from '@react-navigation/native';
import { FlatList, Alert, TextInput } from "react-native";

import { Button } from "@components/Button";
import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/HighLight";
import { Input } from "@components/Input";
import { ListEmpty } from "@components/ListEmpty";
import { PlayerCard } from "@components/PlayerCard";
import { isLoading, Loading } from "@components/Loading";


import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";


type RouteParams = {
    group: string;
}

export function Players(){
    const [newPlayerName, setNewPlayerName] = useState('');
    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

    const navigation = useNavigation();
    const route = useRoute();
    const { group } = route.params as RouteParams;

    const newPlayerNameInputRef = useRef<TextInput>(null);

    const [isLoading, setIsloading] = useState(true);

    async function handleAddPlayer(){
        if (newPlayerName.trim().length === 0) {
            return Alert.alert('Nova pessoa','Informe o nome da pessoa para adicionar');   
        }

        const newPlayer = {
            name: newPlayerName,
            team,
        }

        try {

            await playerAddByGroup(newPlayer, group); 
            
            newPlayerNameInputRef.current?.blur();

            fetchPlayersByTeam();
            setNewPlayerName('');
            
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova pessoa', error.message);
            }else{
                console.log(error);
                Alert.alert('Nova pessoa', 'Não foi possível adicionar');
            }
        }
    }

    async function fetchPlayersByTeam(){
        try {

            const playersByTeam = await playersGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
            setIsloading(false);
        } catch (error) {
            console.log(error);
            Alert.alert('Pessoas','Não foi possível carregar as pessaos filtradas do time selecionado');   
        }finally{
            setIsloading(false);
        }
    }

    async function handlePlayerRemove(playerName: string){
        try {
            await playerRemoveByGroup(playerName, group);
            fetchPlayersByTeam();    
        } catch (error) {
            console.log(error)
            Alert.alert('Remover pessoa','Não foi possível remover essa pessoa.');
        }
    }

    async function groupRomove(){
        try {
            await groupRemoveByName(group);
            navigation.navigate('groups');       
        } catch (error) {
            console.log(error)
            Alert.alert('Remover grupo','Não foi possível remover esse grupo.');    
        }
    }

    async function handleGroupRemove(){
        Alert.alert(
            'Remover', 
            'Deseja remover o grupo',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: () => groupRomove() }
            ]
        )
    }

    useEffect(() => {
        fetchPlayersByTeam();   
    },[team] )

    return(
        <Container>
            <Header showBackButton />

            <Highlight 
                title={group} 
                subtitle="adicione a galera e separa os times"
            />

            <Form>
                <Input 
                    inputRef={newPlayerNameInputRef}
                    placeholder="Nome da pessoa"
                    autoCorrect={false}
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />
                <ButtonIcon 
                    icon="add" 
                    onPress={handleAddPlayer} 
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

            { isLoading ? <Loading/> :  

            <FlatList
                data={players}
                keyExtractor={item => item.name}
                renderItem={({ item }) => (
                    <PlayerCard 
                    name={item.name}
                    onRemove={() => handlePlayerRemove(item.name) }
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
             }   
            <Button title="Remover Turma" type='SECONDARY' onPress={handleGroupRemove} />
           
        </Container>
    )
}