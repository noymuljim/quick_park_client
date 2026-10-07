import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { AuthContext } from "../AuthContext/AuthContext";
import { auth } from "../../firebase/firebase.init";
import { useEffect, useState } from "react";
const provider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const registerUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const GoogleLogin = () => {
        setLoading(true)
        return signInWithPopup(auth, provider)
    }
    const LogOut = () => {
        setLoading(true)
        return signOut(auth);
    }

    const updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile)
    }

    const signInUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }
    useEffect(() => {
        const unSuscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            setLoading(false);
        })
        return () => {
            unSuscribe();
        }
    }, [])
    const authInfo = {
        registerUser, GoogleLogin, LogOut, user, loading, updateUserProfile,signInUser
    }

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;