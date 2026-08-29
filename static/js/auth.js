// public/js/auth.js
import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

export const registerWithEmail = async (name, username, email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: name
        });

        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            name: name,
            username: username,
            email: email,
            profileImageUrl: "", // Can be updated later via Storage
            createdAt: serverTimestamp()
        });

        console.log("Account created successfully!");

        // Redirect to the main feed after successful registration
        window.location.href = "index.html";

    } catch (error) {
        // Firebase will automatically throw errors here if the email is taken or password is too short
        alert("Registration failed: " + error.message);
    }
};