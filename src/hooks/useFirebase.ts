import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

export function useFirebase(collectionName: string) {
  const fetchAll = async () => {
    const q = query(
      collection(db, collectionName),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const add = async (data: any) => {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
    });
    return docRef.id;
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, collectionName, id));
  };

  const update = async (id: string, data: any) => {
    await updateDoc(doc(db, collectionName, id), data);
  };

  return { fetchAll, add, remove, update };
}
