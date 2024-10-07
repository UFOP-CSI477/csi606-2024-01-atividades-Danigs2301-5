import { useNavigate } from 'react-router-dom';

function HomePage(){
    const navigate = useNavigate();

    const login_user_navigate = () => {
        navigate('/login_user');
    };
    const login_restaurant_navigate = () => {
        navigate('/login_restaurant');
    };
    return(
        <>
        <div>
            <button className='button-basic' onClick={login_user_navigate}>Login User</button>
        </div>
        <div>
            <button className='button-basic' onClick={login_restaurant_navigate}>Login Restaurant</button>
        </div>
        <div>
            <p><a href="/create_user">Create user</a></p>
        </div>
        <div>
            <p><a href="/create_restaurant">Create restaurant</a></p>
        </div>
        </>        
    )
}

export default HomePage;