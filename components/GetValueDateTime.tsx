import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { globalStyles } from '../shared/globalStyles';
import { RawVariableType } from '../shared/types/SessionType';
import {format} from 'date-fns';
import {fr} from 'date-fns/locale';

type ResponseDateTimeType = {
  onDateTimeChange: (dateTime: Date) => void;
  onRawVariablesChange: (rawVariables: RawVariableType) => void; // Fonction de rappel pour passer les rawVariables au composant parent
  varDateTime: RawVariableType; 
}

const GetValueDateTime: React.FC<ResponseDateTimeType> = ({varDateTime, onRawVariablesChange, onDateTimeChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState<boolean>(false);

const [response, setResponse] = useState({
    _id: varDateTime._id,
    label: varDateTime.label,
    value: '',
    type: varDateTime.type,
    });

useEffect(() => {
    onRawVariablesChange(response);
    }, [response]);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    hideDatePicker();

    if (date !== undefined) {
      setSelectedDate(date);
      showTimePicker();
      console.log(selectedDate, 'selectedDate')
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, time?: Date) => {
    hideTimePicker();

    if (time !== undefined) {
      setSelectedTime(time);
      const dateTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), time.getHours(), time.getMinutes());
      onDateTimeChange(dateTime);
      console.log(dateTime, 'dateTime')
    }
  };
 
  return (
    <View>

      <View style={globalStyles.input}>
        <TouchableOpacity onPress={showDatePicker}>
          <Text style={globalStyles.textLight}>
                Sélectionnez une date et une heure :
          </Text>
            {/* <Text style={globalStyles.textLight}>
                {selectedDate.toLocaleDateString('fr-FR') +
                ' ' +
                selectedTime.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </Text> */}
            <Text style={globalStyles.textLight}>
                {format(selectedDate, 'PP', {locale: fr})+ ' ' + format(selectedTime, 'p', {locale: fr})}
            </Text>

        </TouchableOpacity>

        {isDatePickerVisible && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
          />
        )}

        {isTimePickerVisible && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="spinner"
            onChange={handleTimeChange}
          />
        )}
      </View>
     
    </View>
  );
};

export default GetValueDateTime;
