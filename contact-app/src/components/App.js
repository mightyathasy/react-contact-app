import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { v4 as uuid } from "uuid";
import api from "../api/contacts";
import './App.css';
import Header from "./Header";
import AddContact from "./AddContact";
import EditContact from "./EditContact";
import ContactList from "./ContactList";
import CoontactDetails from "./ContactDetails";

function App() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const retrieveContacts = async () => {
    const response = await api.get("/contacts");
    return response.data;
  };

  const addContactHandler = async (contact) => {
    const request = {
      id: uuid(),
      ...contact
    };

    const response = await api.post("/contacts", request);
    setContacts([...contacts, response.data]);
  };

  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`, contact);
    const { id } = response.data;
    setContacts(
      contacts.map((contact) => {
        return contact.id === id ? { ...response.data } : contact;
      })
    );
  };

  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`);
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });

    setContacts(newContactList);
  };

  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
    if(searchTerm !== "") {
      const newContactList = contacts.filter((contact) => {
        const contactClone = (({id, ...cont}) => cont)(contact);
        return Object.values(contactClone).join(" ").toLowerCase().includes(searchTerm.toLowerCase());
      });
      setSearchResults(newContactList);
    } else {
      setSearchResults(contacts);
    }
  };

  useEffect(() => {
    const getAllContacts = async () => {
      const allContacts = await retrieveContacts();
      if(allContacts) setContacts(allContacts);
    };

    getAllContacts();
  }, []);

  return (
    <div className="ui container">
      <Router>
        <Header />
        <Switch>
          <Route  path="/" exact 
                  render={(props) => (
                    <ContactList 
                      { ...props } 
                      contacts={ searchTerm.length < 1 ? contacts : searchResults } 
                      getContactId={ removeContactHandler }
                      term={ searchTerm }
                      searchKeyword={ searchHandler }
                    />
                  )}
          />
          <Route  path="/add" exact 
                  render={(props) => (
                    <AddContact 
                      { ...props }
                      addContactHandler={ addContactHandler }
                    />
                  )} 
          />
          <Route  path="/edit/:id" exact 
                  render={(props) => (
                    <EditContact 
                      { ...props }
                      updateContactHandler={ updateContactHandler }
                    />
                  )} 
          />
          <Route  path="/contact/:id" 
                  component={ CoontactDetails } 
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
