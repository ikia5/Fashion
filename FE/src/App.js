import './App.css';
import Navi from './Components/Navi/Navi';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Menu from './Pages/Menu';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import Orders from './Pages/Orders';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kids_banner from './Components/Assets/banner_kids.png';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navi/>
      <Routes>
        <Route path='/' element={<Menu/>}></Route>
        <Route path='/men' element={<ShopCategory banner={men_banner} category="men"/>}></Route>
        <Route path='/women' element={<ShopCategory banner={women_banner} category="women"/>}></Route>
        <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kids"/>}></Route>
        <Route path='/product' element={<Product/>}>
          <Route path=':productId' element={<Product/>}></Route>
        </Route>
        <Route path='/cart' element={<Cart/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/myorders' element={<Orders/>}></Route>
      </Routes>
      <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
