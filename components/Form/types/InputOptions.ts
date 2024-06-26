import {DateTimeInputType, NumberInputType} from "./InputType";
import {TextInputProps} from "react-native";

export type InputOptions = {
    onChange?: (newVal: any) => void,
    value?: any,
    placeholder?: string,
    options?: InputCustomOptions
}

type InputCustomOptions = TextInputProps

export type DateTimeInputOptions = Omit<InputOptions, 'value' | 'onChange'> & {
    value?: Date | null,
    onChange?: (newVal: Date | null) => void,
    type?: DateTimeInputType
}

export type NumberInputOptions = Omit<InputOptions, 'value' | 'onChange'> & {
    value?: number | 0,
    onChange?: (newVal: number | 0) => void,
    type?: NumberInputType
}

export type TextInputOptions = Omit<InputOptions, 'value'> & {
    value?: string,
    multiline?: boolean
}