import { useEffect } from "react";
import { useState } from "react";
import { getTransactionCategories } from "../api/transaction.api";

const useCategories = () => {
  const [categories, setCategories] = useState();

  const fetchCategories = async () => {
    try {
      const data = await getTransactionCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  return categories;
};

export default useCategories;
