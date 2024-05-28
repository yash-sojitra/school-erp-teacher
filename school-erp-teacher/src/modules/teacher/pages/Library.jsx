import BookForm from "../components/Library/BookForm"
import BookTable from "../components/Library/BookTable"

const Library = () => {

  return (
    <div className="w-full mx-6 md:mr-0">
      <div className="w-full flex justify-between align-bottom my-4">
      <h1 className="text-3xl font-bold">Library</h1>
        <BookForm/>
      </div>
      <BookTable/>
    </div>
  )
}

export default Library
