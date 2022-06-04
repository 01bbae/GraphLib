import React from 'react'

const Search = () => {
  return (
    <div className="flex flex-col p-50 bg-purple-500 h-screen">
      <div className="flex items-center justify-center font-bold text-3xl mt-5 bg-green-50 p-11">
        Papers Visualizer
      </div>
      <form
        action="/query"
        id="search"
        method="GET"
        autoComplete="off"
        className="flex justify-center items-center bg-red-50 p-[5rem]"
      >
        <input
          name="query"
          type="search"
          placeholder="Search a Topic"
          id="searchbar"
          className="border"
        ></input>
        <input
          type="submit"
          value="Search"
          id="searchbutton"
          className="border-2 border-blue50"
        ></input>
      </form>
    </div>
  )
}

export default Search