import {globalStyles, variables} from "../../shared/globalStyles";
import {getRGBGradientColors} from "../../shared/libs/color";
import {ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {ActivityType} from "../../shared/types/ActivityType";
import {router} from "expo-router";
import {Href} from "expo-router/build/link/href";
import Button from "../Button";
import { Activity } from "../../shared/classes/Activity";
import ActivityGradient from "./ActivityGradient";
import {SessionType} from "../../shared/types/SessionType";
import {SessionCard} from "../Session/SessionCard";
import { useState } from "react";
import TextLoader from "../TextLoader";
import { User } from "firebase/auth";


type ActivityOverviewType = {
    activity: ActivityType,
    onNewPress?: () => void,
    onManualPress?: () => void,
    buttonTitle?: string,
    sessions?: SessionType[],
    onSessionPress?: (session: SessionType) => void,
    sessionsLoading?: boolean,
    user?: User | null
}

export default function ActivityOverview({ activity, 
    onNewPress, 
    onManualPress, 
    onSessionPress,  
    buttonTitle, 
    sessions, 
    sessionsLoading 
}: ActivityOverviewType) {

    buttonTitle = buttonTitle || "Consulter"

    return (
        <ActivityGradient
            activity={activity}
            style={[globalStyles.body, globalStyles.card]}>
            <View style={[globalStyles.cardContent, styles.localCardContent]}>
                <Text style={[globalStyles.headTitle, globalStyles.textLight, globalStyles.textCenter]}>{activity.label}</Text>
                { activity.description && <Text style={globalStyles.textLight}>{activity.description}</Text>
                }

               <>
                    {sessions?.length ? (
                        <>
                            <View style={[globalStyles.mt3Container, {opacity: .5}]}>
                                <Text style={globalStyles.textLight}>{sessions.length} session{sessions.length > 1 && "s"} en cours</Text>
                            </View>
                            <FlatList
                                style={[globalStyles.mv2Container, globalStyles.body, {width: "100%"}]}
                                data={sessions}
                                renderItem={({item}) => <SessionCard
                                    session={item}
                                    key={item._id}
                                    onPress={() => {
                                        if (onSessionPress) onSessionPress(item)
                                    }}
                                />}
                            />
                        </>
                    ) : 
                    sessionsLoading ? <TextLoader label="Chargement des sessions..." /> : null}

                    {onNewPress || onManualPress ? <View style={[globalStyles.mv2Container, styles.buttonContainer]}>
                        {onNewPress && <Button
                            title={buttonTitle}
                            onPress={onNewPress}
                            style={[styles.buttonLight]}
                            variant="xl"
                            titleStyle={[{ color: activity.color }]} />}
                        {onManualPress && <Button
                            title="Saisie Manuelle"
                            onPress={onManualPress}
                            style={[globalStyles.msContainer, styles.buttonOutlined]}
                            variant="xl"
                            titleStyle={[{ color: "white" }]} />}
                    </View> : null}
                </>
            </View>
        </ActivityGradient>
    )
}

const styles = StyleSheet.create({
    localCardContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: variables.contentPadding[2]
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    buttonLight: {
        backgroundColor: "white",
    },

    buttonOutlined:{
        backgroundColor:"transparent",
        borderWidth: 1,
        borderColor: "white",
        
    }
})