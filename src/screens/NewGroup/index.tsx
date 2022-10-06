import { useState } from "react";
import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Highlight } from "@components/HighLight";
import { Input } from "@components/Input";
import { Container, Content, Icon } from "./styles";

import { useNavigation } from '@react-navigation/native';

export function NewGroup(){
    const [group, setGroup] = useState('');

    const navigation = useNavigation();

    function handleNew(){
        navigation.navigate('players', { group })
    }

    return(
        <Container>

            <Header showBackButton/>

            <Content>
                <Icon/>
                <Highlight
                    title="Nova turma"
                    subtitle="cria a turma para adicionar as pessoas"
                />
                <Input 
                    placeholder="Nome da turma"
                    onChangeText={setGroup}
                />
                <Button 
                    title="Criar"
                    style={{ marginTop: 20 }}
                    onPress={handleNew}
                />

            </Content>
        </Container>
    )
}