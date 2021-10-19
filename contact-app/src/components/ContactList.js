import React, {useRef} from "react";
import {Link} from "react-router-dom";
import ContactCard from "./ContactCard";

const ContactList = (props) => {
    const inputEl = useRef("");

    const deleteContactHandler = (id) => {
        props.getContactId(id);
    };

    const getSearchTerm = () => {
        props.searchKeyword(inputEl.current.value);
    };

    const renderContactList = props.contacts.map((contact) => {
        return (
            <ContactCard 
                contact={ contact } 
                clickHandler={deleteContactHandler} 
                key={contact.id}
            />
        );
    });
    return <div className="main">
        <h2 className="header">
            Contact List
            <Link to="/add">
                <button className="ui blue right floated button">Add Contact</button>
            </Link>
        </h2>
        <div className="ui search">
            <div className="ui icon input">
                <input  
                    ref={ inputEl }
                    type="text" 
                    placeholder="Search Contacts" 
                    className="prompt" 
                    value={ props.term } 
                    onChange={ getSearchTerm }
                />
                <i className="search icon"></i>
            </div>
        </div>
        <div className="ui celled list">{ renderContactList.length > 0 ? renderContactList : "No contact matches your search terms." }</div>
    </div>
}

export default ContactList;