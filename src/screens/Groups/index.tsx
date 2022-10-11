import { useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Header } from '@components/Header';
import { Container } from './styles';
import { Highlight } from '@components/HighLight';
import { GroupCard } from '@components/GroupCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { groupsGetAll } from '@storage/group/groupsGetAll';
import { Loading } from '@components/Loading';


export function Groups() {
  const [groups, setGroups] = useState<string[]>([]);

  const [isLoading, setIsloading] = useState(true);

  const navigation = useNavigation();

  function handleNewGroup() {
    navigation.navigate('new');
  }

  async function fetchGroups() {
    try {
      setIsloading(false);

      const data = await groupsGetAll();

      setGroups(data);
      setIsloading(false);

    } catch (error) {
      console.log(error);
    }finally{
      setIsloading(false);
    }
  }

  function handleOpenGroup(group: string){
    navigation.navigate('players', { group })  
  }

  useFocusEffect(useCallback(() => {
    //execute
    console.log('EuseFocus executou')
    fetchGroups();

  },[]));

  return (
    <Container >
      <Header />
      <Highlight title="Turmas" subtitle="jogue com a sua turma" />

      { isLoading ? <Loading/> :
      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <GroupCard 
            title={item} 
            onPress={() => handleOpenGroup(item)}
          />
        )}
        contentContainerStyle={groups.length === 0 && { flex: 1 }}
        ListEmptyComponent={() => <ListEmpty message="Que tal cadastrar a primeira turma?" />}
      >
       </FlatList> 
      }
      <Button
        title='Criar nova turma'
        onPress={handleNewGroup}
      />

    </Container>
  );
}

