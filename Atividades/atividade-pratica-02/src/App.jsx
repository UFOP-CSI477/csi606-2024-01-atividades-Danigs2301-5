import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReadBloodType from './BloodType/viewReadBloodType';
import CreateBloodType from './BloodType/viewCreateBloodType';
import CreateCity from './Cities/viewCreateCity';
import ReadCity from './Cities/viewReadCity';
import CreateCollectionLocation from './CollectionLocations/viewCreateCollectionLocation';
import ReadCollectionLocation from './CollectionLocations/viewReadCollectionLocation';
import CreateUser from './Users/viewCreateUser';
import ReadUser from './Users/viewReadUser';
import CreateDonation from './Donations/viewCreateDonations';
import Home from './home';
import ReadDonation from './Donations/viewReadDonations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/readBloodType" element={<ReadBloodType/>} />
        <Route path="/createBloodType" element={<CreateBloodType/>} />
        <Route path="/createCity" element={<CreateCity/>} />
        <Route path="/readCity" element={<ReadCity/>} />
        <Route path="/createCollectionLocation" element={<CreateCollectionLocation/>} />
        <Route path="/readCollectionLocation" element={<ReadCollectionLocation/>} />
        <Route path="/createUser" element={<CreateUser/>} />
        <Route path="/readUser" element={<ReadUser/>} />
        <Route path="/createDonation" element={<CreateDonation/>} />
        <Route path="/readDonation" element={<ReadDonation/>} />
      </Routes>
    </Router>
  );
}

export default App;
