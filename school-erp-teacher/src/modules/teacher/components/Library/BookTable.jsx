import { AuthContext } from "@/auth/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

const BookTable = ({refresh, setRefresh}) => {
  const [books, setBooks] = useState([]);
  const { data } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [searchData, setSearchData] = useState([])
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchBooks() {
      setError(false);
      try {
        const respose = await axios.get(
          `https://erp-system-backend.onrender.com/api/v1/library/fetch-books-byTeacher/${data.id}`
        );

        setBooks(respose.data.data);
        setSearchData(respose.data.data);
      } catch (error) {
        setError(true);
        console.error(error);
      }
    }
    fetchBooks();
    setRefresh(false)
  }, [refresh]);

  useEffect(()=>{
    setSearchData(()=>books.filter((book)=>book.name.includes(search) || book.subject.includes(search)))
  },[search])

  async function handleDelete(e){

    console.log(JSON.parse(e.target.attributes.data.value));

    const book = JSON.parse(e.target.attributes.data.value)

    try {
      const response = await axios.delete(`https://erp-system-backend.onrender.com/api/v1/library/delete-book/${data.id}/6`)

      console.log(response.data);

    } catch (error) {
      console.log(error);
  }
}

  return (
    <>
      <Input className="mb-4 bg-white w-72" placeholder="search" onChange={(e)=>setSearch(e.target.value)}/>
      <table className="w-full text-left bg-white rounded-xl shadow-lg">
        <tr className="text-lg font-medium text-gray-500 border-b-2">
          <td className="py-4 pl-6">Name</td>
          <td>Subject</td>
          <td>Action</td>
        </tr>
        {books ? (
          searchData.map((book) => (
            <tr
              key={book.name}
              className="text-xl font-medium border-b-2 hover:bg-slate-100"
            >
              <td className="py-6 pl-6"><a href={book.file}>{book.name}</a></td>
              <td>{book.subject}</td>
              <td>
                <Button onClick={handleDelete} data={JSON.stringify(book)}>Delete</Button>
              </td>
            </tr>
          ))
        ) : (
          <div className="text-center py-4 text-xl font-medium">No books</div>
        )}
      </table>
      {error && <div>error fetching books</div>}
    </>
  );
};

export default BookTable;
