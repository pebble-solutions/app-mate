import Timeline from "./Timeline";
import {Animated, FlatList, StyleSheet, useWindowDimensions, View, ViewToken, Text, Alert} from "react-native";
import ValidationButton from "./ValidationButton";
import {globalStyles, variables} from "../../shared/globalStyles";
import {ReactNode, useRef, useState} from "react";
import Button from "../Button";
import {Feather} from "@expo/vector-icons";
import FullscreenLoader from "../FullscreenLoader";

type OnboardingControllerOptions = {
    activeColor?: string,
    inactiveColor?: string,
    items: ReactNode[],
    validationColor?: string,
    validationIndex?: number
    validate: () => void,
    pending: boolean
}

export default function OnboardingController({activeColor, inactiveColor, items, validationColor, validationIndex, validate, pending}: OnboardingControllerOptions) {


    const [currentIndex, setCurrentIndex] = useState(0)
    const { width } = useWindowDimensions()

    const scrollX = useRef(new Animated.Value(0)).current
    const slidesRef = useRef<FlatList | null>(null)

    const viewableItemsChanged = useRef(({viewableItems}: {viewableItems: ViewToken[]}) => {
        setCurrentIndex(viewableItems[0].index || 0)
    }).current;

    const handleToValidate = () => {
        if (currentIndex === validationIndex) {
            validate()
        }
    }

    const goToIndex = (index: number) => {
        if (index >= 0 && index < items.length) {
            slidesRef.current?.scrollToIndex({index, animated: true})
            setCurrentIndex(index);
        }
        else if (index === items.length) {
            Alert.alert('Validation', 'Confirmez-vous la validation de cette session?', [
                {
                  text: 'Annuler',
                  onPress: () => {goToIndex(currentIndex)},
                  style: 'cancel',
                },
                {text: 'OK', onPress: () => {handleToValidate()}},
              ]);
        }
    }

    const nextStep = () => goToIndex(currentIndex + 1)

    const prevStep = () => goToIndex(currentIndex - 1)

    return (

        <View style={localStyle.container}>
            {pending ? 
                <FullscreenLoader
                    message='Validation en cours'
                    color = 'white' />
                : <View>
                    <FlatList
                        data={items}
                        renderItem={({item}) => <View key={currentIndex} style={[localStyle.itemContainer, {width}]}>{item}</View>}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        scrollEnabled={false}
                        bounces={false}
                        onScroll={Animated.event([{
                            nativeEvent: {
                                contentOffset: {
                                    x: scrollX
                                }
                            }
                        }], { useNativeDriver: false })}
                        onViewableItemsChanged={viewableItemsChanged}
                        scrollEventThrottle={32}
                        ref={slidesRef}
                    />
                    <Timeline
                        items={items.length}
                        currentIndex={currentIndex}
                        activeColor={activeColor}
                        inactiveColor={inactiveColor}
                        validationColor={validationColor}
                        validationIndex={validationIndex}
                    />
                    <View style={localStyle.actionsContainer}>
                        <View style={localStyle.buttonContainer}>
                            {currentIndex > 0 && <Button
                                title="Précédent"
                                onPress={prevStep}
                                options={{
                                    displayTitle: false
                                }}
                                style={[globalStyles.transparentBg]}
                                icon={<Feather name="arrow-left" size={24} color="white" />}
                            />}
                        </View>
                        
                        <View style={localStyle.buttonContainer}>
                            <ValidationButton
                                items={items.length}
                                currentIndex={currentIndex}
                                activeColor={activeColor}
                                inactiveColor={inactiveColor}
                                onPress={nextStep}
                                validationIndex={validationIndex}
                                validationColor={validationColor}
                            />
                        </View>

                        <View style={localStyle.buttonContainer}></View>
                    </View>
                </View>
            }
        </View>
    )
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },

    actionsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: variables.contentMargin[3],
    },

    buttonContainer: {
        flexDirection: "row",
        flex:1,
        alignItems: "center"
    },

    itemContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})