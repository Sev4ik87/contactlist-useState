import React, { useState, useEffect, useCallback } from 'react';
import ContactList from './components/ContactList/ContactList';
import ContactForm from './components/ContactForm/ContactForm';
import './App.css';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [contactForEdit, setContactForEdit] = useState(createEmptyContact());

  function createEmptyContact() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    };
  }

  const saveState = useCallback((contacts) => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, []);

  const restoreState = useCallback(() => {
    const data = localStorage.getItem('contacts');
    return data ? JSON.parse(data) : [];
  }, []);

  useEffect(() => {
    setContacts(restoreState());
  }, [restoreState]);

  const deleteContact = useCallback((id) => {
    setContacts((prevContacts) => {
      const updatedContacts = prevContacts.filter((contact) => contact.id !== id);
      saveState(updatedContacts);
      return updatedContacts;
    });
    setContactForEdit([]);
  }, [saveState]);

  

  const addNewContact = useCallback(() => {
    setContactForEdit(createEmptyContact());
  }, []);

  const selectContact = useCallback((contact) => {
    setContactForEdit(contact);
  }, []);

  const createContact = useCallback(
    (contact) => {
      contact.id = Date.now();
      setContacts((prevContacts) => {
        const updatedContacts = [...prevContacts, contact];
        saveState(updatedContacts);
        return updatedContacts;
      });
      setContactForEdit(createEmptyContact());
    },
    [saveState]
  );

  const updateContact = useCallback(
    (contact) => {
      setContacts((prevContacts) => {
        const updatedContacts = prevContacts.map((item) => (item.id === contact.id ? contact : item));
        saveState(updatedContacts);
        return updatedContacts;
      });
      setContactForEdit(contact);
    },
    [saveState]
  );

  const saveContact = useCallback(
    (contact) => {
      if (!contact.id) {
        createContact(contact);
      } else {
        updateContact(contact);
      }
    },
    [createContact, updateContact]
  );
  return (
    <div className='container'>
      <h1 className='header'>Contact List</h1>
      <div className='main'>
        <ContactList
          contacts={contacts}
          onDelete={deleteContact}
          onAddContact={addNewContact}
          onEditContact={selectContact}
        />
        <ContactForm
          key={contactForEdit.id}
          contactForEdit={contactForEdit}
          onSubmit={saveContact}
          onDelete={deleteContact}
        />
      </div>
    </div>
  );
};

export default App;
