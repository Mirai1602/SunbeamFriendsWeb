import { db } from './firebase-config.js';
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Collection reference
const postsCollection = collection(db, 'posts');

/**
 * Add a new post
 * @param {string} authorId 
 * @param {string} authorUsername 
 * @param {string} content 

 * @returns {Promise<string>} The new post's document ID
 */
export const addPost = async (authorId, authorUsername, content = "") => {
    try {
        const docRef = await addDoc(postsCollection, {
            authorId,
            authorUsername,
            content,
            likeCount: 0,
            createdAt: serverTimestamp()
        });
        console.log("Post added with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding post: ", error);
        throw error;
    }
};

/**
 * Get all posts, ordered by newest first
 * @returns {Promise<Array>} Array of post objects
 */
export const getPosts = async () => {
    try {
        const q = query(postsCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const posts = [];
        querySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
        });
        return posts;
    } catch (error) {
        console.error("Error getting posts: ", error);
        throw error;
    }
};

//  * @param {string} postId 
//  * @param {Object} updatedData  
//  */
// export const updatePost = async (postId, updatedData) => {
//     try {
//         const postRef = doc(db, 'posts', postId);
//         await updateDoc(postRef, updatedData);
//         console.log("Post updated successfully!");
//     } catch (error) {
//         console.error("Error updating post: ", error);
//         throw error;
//     }
// };

/**
 * Delete a post
 * @param {string} postId
 */
// export const deletePost = async (postId) => {
//     try {
//         const postRef = doc(db, 'posts', postId);
//         await deleteDoc(postRef);
//         console.log("Post deleted successfully!");
//     } catch (error) {
//         console.error("Error deleting post: ", error);
//         throw error;
//     }
// };
