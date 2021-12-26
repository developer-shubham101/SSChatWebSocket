import { useEffect, useState } from "react";
import Contacts, { Contact } from 'react-native-contacts';
import { requestReadContactsPermission } from "../utils/permissions";

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getContacts = async () => {
    try {
      const contacts = await Contacts.getAll();
      setContacts(contacts);
      setLoading(false);
    } catch (e) {
      setError(error);
      setLoading(false);
      return;
    }
  };

  const requestContactsPermission = async (): Promise<boolean> => {
    try {
      return requestReadContactsPermission();
    } catch (e) {
      return false;
    }
  };

  const load = async () => {
    const granted = await requestContactsPermission();
    if (granted) {
      getContacts();
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { contacts, loading, error };
};