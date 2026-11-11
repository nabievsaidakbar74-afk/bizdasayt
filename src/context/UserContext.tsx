"use client"
import { createContext, ReactNode, useState, useContext } from "react";
import { User } from "../types";

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void
}


const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)

    


    return <UserContext.Provider value={{ user, setUser }}>
        {children}
    </UserContext.Provider>
}


export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }

    return context;
}





















// "use client";

// import {
//   createContext,
//   useContext,
//   useState,
//   type ReactNode,
//   type Dispatch,
//   type SetStateAction,
// } from "react";

// import type { User } from "../types";

// interface UserContextType {
//   user: User | null;
//   setUser: Dispatch<SetStateAction<User | null>>;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// interface UserProviderProps {
//   children: ReactNode;
// }

// export function UserProvider({ children }: UserProviderProps) {
//   const [user, setUser] = useState<User | null>(null);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUser() {
//   const context = useContext(UserContext);

//   if (!context) {
//     throw new Error("useUser must be used within UserProvider");
//   }

//   return context;
// }