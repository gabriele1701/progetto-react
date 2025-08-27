import React from 'react';

const UserProfile = ({ avatar, name, bio }) => {
  return (
    <div className="">
      <img src={avatar} alt={`${name}'s avatar`} />
      <h2>{name}</h2>
      <p>{bio}</p>
    </div>
  );
};

export default User-Profile;


//Esempio di utilizzo in un altro file, come App.jsx

// import UserProfile from './components/UserProfile/UserProfile';

// function App() {
//   return (
//     <UserProfile 
//       avatar="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
//       name="John Doe"
//       bio="A passionate developer from the internet."
//     />
//   );
// }
