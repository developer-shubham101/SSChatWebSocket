import React, { useState, useEffect } from 'react';
import { FlatList, View, TouchableOpacity, Text } from 'react-native';
import { orderBy } from 'lodash';

import { Platform } from 'react-native';
import { useContacts } from '../hooks/useContacts';
import { Contact } from 'react-native-contacts';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore

export const convertNumber = (number?: string) => {
  return number;
  /* 
    if (!number) {
        return;
    }

    let phoneNumber = number.replace(/[\-,\(,\),\s]/g, '');
    if (phoneNumber[0] === '0') {
        phoneNumber = phoneNumber.substr(1);
    }
    const userLocaleCountryCode = RNLocalize.getCountry();
    const { callingCode } = getAllCountries()
        .filter((country: any) => country.cca2 === userLocaleCountryCode)
        .pop();

    return phoneNumber.startsWith('+')
        ? phoneNumber
        : `+${callingCode}${phoneNumber}`; */
};

export const ContactsScreen = ({ navigation }) => {
  const [searchTerm, setTerm] = useState<string>('');

  const { contacts } = useContacts();
  console.log('Shubham ContactsScreen', contacts);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text
          style={{ color: 'black', fontWeight: 'bold', marginVertical: 10 }}
        >
          BACK
        </Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1 }}
          data={contacts}
          extraData={contacts}
          keyExtractor={(_, index: number) => `${index}`}
          ItemSeparatorComponent={() => <View />}
          ListEmptyComponent={() => (
            <View>
              <Text>No contacts found</Text>
            </View>
          )}
          renderItem={({ item: contact }: { item: Contact }) => (
            <TouchableOpacity style={{ padding: 10 }} onPress={() => {}}>
              <Text style={{ backgroundColor: '#0f0' }} numberOfLines={1}>
                {contact.givenName}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};
