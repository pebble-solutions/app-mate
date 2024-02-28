import {RawVariableType, SessionType} from "../../shared/types/SessionType";
import {globalStyles, variables} from "../../shared/globalStyles";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import {format} from 'date-fns';
import {fr} from 'date-fns/locale';
import { Session } from "../../shared/classes/Session";
import { VariableType } from "../../shared/types/VariableType";

type SummaryCardOptions = {
    onPress?: () => void,
    session: SessionType,
}

export function SummaryCard({session, onPress}: SummaryCardOptions) {
    const renderItemValue = (item: RawVariableType) => {
        console.log(item, 'item')
        if (item.value instanceof Date) {
            console.log(item.value)
            return  <View>
                    <Text style={globalStyles.textLight}>{item.label}: </Text>
                    <Text>{item.value.toLocaleString()}</Text>;
                </View>
        }
        return <Text  style={globalStyles.textLight}>{item.label}: {item.value}</Text>
    }
    return (
        <View>

            <View style={[localStyle.cardContent]}>
                <View style={[ localStyle.container]}>
                    <AntDesign name="left" size={24} color={'white'} />
                        <Text style={[globalStyles.sessionSubTitle, globalStyles.textCenter, globalStyles.textLight]}>
                            {format(session.start, ' d MMM yyy', {locale: fr})}
                        </Text>
                        <Text style={[globalStyles.sessionSubTitle, globalStyles.textCenter, globalStyles.textLight]}>
                            {/* {format(session.end, 'HH:mm', {locale: fr})} */}
                        </Text>
                    <AntDesign name="right" size={24} color={'white'} />
                </View>
                <View style={[ localStyle.container]}>
                    {/* <Text style={[globalStyles.textLight]}>Timeline</Text> */}
                    {session.raw_datas && (
                        <Text style={[globalStyles.sessionSubTitle, globalStyles.textCenter, globalStyles.textLight]}>Metric Sequence</Text>
                        
                    )}
                </View>

            </View>
                <View style={[localStyle.cardContent]}>
                    <Text style={[globalStyles.sessionSubTitle, globalStyles.textCenter, globalStyles.textLight]}>Informations et variables</Text>
                {session.raw_variables.length > 0 && (
                    <View style={[ localStyle.content]}>
                        <Text style={[globalStyles.textLight]}>Nombre de variables brutes: {session.raw_variables.length}</Text>
                        {session.raw_variables.map((variable, index) => (
                            <>
                            {renderItemValue(variable as RawVariableType)}
                            {/* <Text key={index} style={[globalStyles.textLight]}>{variable.label} : {variable.value}</Text> */}
                            </>
                        ))}
                    </View>
                )}
                {session.raw_variables.length === 0 && (
                    <View style={[ localStyle.content]}>
                        <Text style={[globalStyles.textLight]}>Pas de variable</Text>
                    </View>
                )}

                </View>
        </View>

    )
}

const localStyle = StyleSheet.create({
    card: {
        width: "100%",
        backgroundColor: "transparent",
        
    },

    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        padding: variables.contentPadding[1],   
    },
    content: {
        borderRadius: variables.borderRadius[1],
        padding: variables.contentPadding[2],
        marginVertical: variables.contentMargin[1],
        justifyContent: 'center',
    },

    
    cardContent: {
        backgroundColor: '#00000050',
        borderRadius: variables.borderRadius[1],
        padding: variables.contentPadding[2],
        marginVertical: variables.contentMargin[2],
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: variables.fontSize[4],
        fontFamily: 'Inter_700Bold',
    },
    
    cardHeader: {
        maxWidth: '80%',
    },
    
    cardIconsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        right: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
})