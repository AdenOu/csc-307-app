// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";



function MyApp() {
    
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
    });
  }, []);

  function removeOneCharacter(id) {
    deleteUser(id)
      .then((response) => {
        if (response.status === 204) {
          const updated = characters.filter((character) => {
            return character._id !== id;
          });
          setCharacters(updated);
        } else if (response.status === 404) {
          console.log("Resource not found.");
        } else {
          console.log("Delete failed.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function postUser(person) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function deleteUser(id) {
  return fetch(`http://localhost:8000/users/${id}`, {
    method: "DELETE",
  });
  }

 function updateList(person) {
  postUser(person)
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else {
        throw new Error("User was not created.");
      }
    })
    .then((newUser) => {
      setCharacters([...characters, newUser]);
    })
    .catch((error) => {
      console.log(error);
    });
}

  return (
  <div className="container">
    <Table characterData={characters} removeCharacter={removeOneCharacter} />
    <Form handleSubmit={updateList} />
  </div>
    );
}



export default MyApp;
