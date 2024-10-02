import { useNavigate } from "react-router-dom";


function Home (){
    const navigate = useNavigate()

    const donations = () => {
        navigate('/readDonation')
    }

    const bloodTypes = () => {
        navigate('/readBloodType')
    }

    const cities = () => {
        navigate('/readCity')
    }

    const collectionLocations = () => {
        navigate('/readCollectionLocation')
    }
    
    const users = () => {
        navigate('/readUser')
    }

    return(
        <div>
            <h1>Welcome</h1>
            <button className="button-basic" onClick={donations}>Donations</button>
            <button className="button-basic" onClick={bloodTypes}>Blood types</button>
            <button className="button-basic" onClick={cities}>Cities</button>
            <button className="button-basic" onClick={collectionLocations}>Collection locations</button>
            <button className="button-basic" onClick={users}>Users</button>
        </div>

    )
}

export default Home