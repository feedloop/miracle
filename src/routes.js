import React from 'react';

const Home = React.lazy(() => import('./views/pages/home/Home'));
const ProductDetail = React.lazy(() => import('./views/pages/productDetail/ProductDetail'));
const Cart = React.lazy(() => import('./views/pages/cart/Cart'));
const Checkout = React.lazy(() => import('./views/pages/checkout/Checkout'));
const Purchased = React.lazy(() => import('./views/pages/home/EndScreen'));
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));


const routes = [
  { path: '/', exact: true, name: 'Home', component: Home },
  { path: '/product/:id', exact: true, name: 'ProductDetail', component: ProductDetail },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/checkout', name: 'Checkout', component: Checkout },
  { path: '/purchased', name: 'Purchased', component: Purchased },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
];

export default routes;
