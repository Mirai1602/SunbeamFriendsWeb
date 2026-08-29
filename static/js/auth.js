// public/js/auth.js
import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

export const signUp = async (email, password, username, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: name
        });

        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
            email: email,
            password: password, // Note: Storing passwords in plaintext is insecure.
            username: username,
            name: name,
            uid: user.uid,
            createdAt: serverTimestamp()
        });

        console.log("Account created successfully!");
        return user;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Logged in successfully!");
        return user;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};