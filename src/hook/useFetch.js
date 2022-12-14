import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function useFetch(page, url = '') {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [list, setList] = useState([]);
  const [formattedList, setFormattedList] = useState([]);

  const getPosts = useCallback(async () => {
    try {
      await setLoading(true);
      await setError(false);
      let res = []
      if(list && list.length === 0) {
      res = await axios.get(url);
      await setList(res.data)
      await setFormattedList([...res.data.slice(0, 5)])
     }
     else if (list.length > formattedList.length) {
        await setFormattedList([...formattedList, ...list.slice(formattedList.length, formattedList.length + 10)])
     }
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }, [page]);

  useEffect(() => {
    getPosts();
  }, [ getPosts, page]);

  return { loading, error, formattedList };
}
export default useFetch;