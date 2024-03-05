import React, { useEffect, useState } from "react";
import HomeSection from "./HomeSection";
import { useAuth } from "../../context/AuthContext";

import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const HomeContainer = () => {
  const { currentUser } = useAuth();
  const [username, setUsername] = useState();

  useEffect(() => {
    const getUsername = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          setUsername(userDoc.data().username);
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      }
    };
    getUsername();
  }, [currentUser]);

  return (
    <div className="py-10 px-8 sm:px-26 md:px-32 lg:px-48">
      {currentUser && (
        <div className="mb-10 text-xl sm:text-2xl md:text-3xl font-medium text-gray-200 uppercase">
          Welcome {username}!
        </div>
      )}
      <div className="text-xl tracking-widest uppercase font-medium text-gray-400 border-blue-600 border-l-4 mb-6 px-2">
        Movies
      </div>
      <HomeSection />
    </div>
  );
};

export default HomeContainer;
