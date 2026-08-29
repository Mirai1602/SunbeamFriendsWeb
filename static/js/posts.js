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
    serverTimestamp,
    arrayUnion,
    arrayRemove,
    increment
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
            likedBy: [],
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

/**
 * Update a post
 * @param {string} postId 
 * @param {Object} updatedData  
 */
export const updatePost = async (postId, updatedData) => {
    try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, updatedData);
        console.log("Post updated successfully!");
    } catch (error) {
        console.error("Error updating post: ", error);
        throw error;
    }
};

/**
 * Toggle like for a post
 * @param {string} postId
 * @param {string} userId
 * @param {boolean} isLiking
 */
export const toggleLike = async (postId, userId, isLiking) => {
    try {
        const postRef = doc(db, 'posts', postId);
        if (isLiking) {
            await updateDoc(postRef, {
                likedBy: arrayUnion(userId),
                likeCount: increment(1)
            });
        } else {
            await updateDoc(postRef, {
                likedBy: arrayRemove(userId),
                likeCount: increment(-1)
            });
        }
    } catch (error) {
        console.error("Error toggling like: ", error);
        throw error;
    }
};
