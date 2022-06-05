import React from 'react'
import { useSearchParams, useLocation } from 'react-router-dom';
// import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

const Query = (props) => {
    // const [searchParams, setSearchParams] = useSearchParams()
    // const query = searchParams.get("query")

    // const fetchData = () => {
    //     // fetch(this.props.location)
    //     console.log(useLocation())
    // }
    
    // fetchData();
    // console.log(useLocation().pathname);
    // console.log(useLocation().search);

    fetch(useLocation().pathname+useLocation().search)
    .then(
        res => console.log(res)
        // res.json()
    ).then(
        data => {
            console.log(data)
            // TODO: something with the data
        }
    ).catch(
        // Error Handling
        // Do something
        console.log("error")
    )



  return (
    <div>Query</div>
  )
}

export default Query