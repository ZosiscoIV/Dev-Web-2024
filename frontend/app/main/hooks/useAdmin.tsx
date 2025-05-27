import { useState, useEffect } from "react";

interface User {
    id:number;
    nom: string;
    prenom:string;
    email: string;
    is_admin: number; 
}

export const useAdmin = () : User | null => {
    const [user, setUser] = useState<User|null>(null);
    
    useEffect(() => {
        const saved = localStorage.getItem('user');
        if (saved) {
            try {
            setUser(JSON.parse(saved));
            } 
            catch {
            setUser(null);        
            }
        }
    }, []);
    return user ;
}
    