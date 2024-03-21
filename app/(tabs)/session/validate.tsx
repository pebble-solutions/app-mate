import {Alert, SafeAreaView, View, Text, StyleSheet, Platform, TouchableOpacity} from "react-native";
import getCurrentSession, {getCurrentActivity, navigate} from "../../../shared/libs/session";
import {useSessionStatusContext} from "../../../shared/contexts/SessionStatusContext";
import {useSessionContext} from "../../../shared/contexts/SessionContext";
import {router} from "expo-router";
import React, {ReactNode, useEffect, useState} from "react";
import {RawVariableType, SessionType} from "../../../shared/types/SessionType";
import { globalStyles } from "../../../shared/globalStyles";
import {ActivityType} from "../../../shared/types/ActivityType";
import OnboardingController from "../../../components/Onboarding/OnboardingController";
import FormInput from "../../../components/Form/FormInput";
import VariablesList from "../../../components/Session/VariablesList";
import { SequenceList } from "../../../components/Session/SequenceList";
import Title from "../../../components/Title";
import { StopWatch } from "../../../components/Session/StopWatch";
import { SessionHeader } from "../../../components/Session/SessionHeader";
import { dateToLiteral } from "../../../shared/libs/date";
import { Ionicons } from '@expo/vector-icons';
import SessionSummary from "../../../components/Session/SessionSummary";
import {VariableValueType} from "../../../shared/types/VariableType";
import {SequenceItemType} from "../../../shared/types/SequenceType";



export default function ValidateScreen() {
    const sessionContext = useSessionContext();
    const [rawVariables, setRawVariables] = React.useState<RawVariableType[]>([]);
    const { status, resetStatus, resetPayload, setStatus } = useSessionStatusContext()
    const [ exitStatus, setExitStatus ] = React.useState(false)

    useEffect(() => {
        navigate(status || null, router)
    }, [status])

    let session, activity;

    try {
        session = getCurrentSession()
        activity = getCurrentActivity()
    }
    catch (e) {
        if (!exitStatus) {
            const message = e instanceof Error ? e.message : "Erreur inconnue dans l'affichage de la vue pointage."
            Alert.alert(message)
        }
    }

    const [ currentSession ] = useState<SessionType | null>(session || null)
    const [ currentActivity ] = useState<ActivityType | null>(activity || null)

    // Exit or error status
    if (!currentActivity || !currentSession) {
        return null
    }

    const setResponse = (variableId: string, response: VariableValueType) => {
        setRawVariables((prev) => {
            const newVars: RawVariableType[] = []

            prev.forEach((variable) => {
                if (variable._id === variableId) variable.value = response
                newVars.push(variable)
            })

            currentSession.raw_variables = newVars

            return newVars
        })
    }

    const handleSequenceChange = (index: number, newVal: SequenceItemType) => {
        currentSession.raw_datas.updateOne(index, newVal)
    }

    const exit = () => {
        setExitStatus(true)
        resetPayload()
        resetStatus()
    }

    const variables = currentActivity.variables;

    if (rawVariables.length === 0) {
        const newRawVariables: RawVariableType[] = variables.map(variable => ({
            _id: variable._id,
            label: variable.question,
            type: variable.type,
            value: undefined
        }));
        setRawVariables(newRawVariables);
    }

    const postSession =  async (raw_variables: RawVariableType[]) => {
        sessionContext.updateSession(currentSession._id, {...currentSession, raw_variables: raw_variables});
        await sessionContext.postSession(currentSession._id, {...currentSession});
        exit()
    }

    let items: ReactNode[] = []

    rawVariables.forEach((variable) => {

        const value = variable.value
        const type = variable.type
        const label = variable.label
        const key = variable._id

        items.push((
            <View style={globalStyles.section}>
                <FormInput
                    type={type}
                    value={value}
                    onChange={(newVal) => setResponse(variable._id, newVal)}
                    label={label}
                    labelStyle={[globalStyles.textLight, globalStyles.textXl]}
                    key={key}
                />
            </View>
        ))
    })

    items.push((
        <SessionSummary
            session={currentSession}
            theme={"dark"}
            onVariableChange={setResponse}
            onSequenceChange={handleSequenceChange}
        />
    ))

    return (
        <SafeAreaView style={[globalStyles.mainContainer, globalStyles.darkBg]}>
            {Platform.OS === 'android' && 
                <TouchableOpacity onPress={() => {
                    router.back();
                }}>
                    <Ionicons name="close-outline" size={32} color="white" style={{ position: 'relative', right: 0, top: 18 }} />
                </TouchableOpacity>
            }
            <SessionHeader label={currentActivity.label} description={currentActivity.description} date={dateToLiteral(currentSession.start)} />    
            
            <OnboardingController
                activeColor={currentActivity.color}
                items={items}
                validationIndex={items.length - 1}
            />
        </SafeAreaView>
    )
}
