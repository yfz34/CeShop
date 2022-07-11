import { Routes, Route } from "react-router-dom";

import RequireAuth from "./components/admin/RequireAuth";
import RersistLogin from "./components/admin/PersistLogin";

import AdminLayout from './layouts/AdminLayout';
import AdminHomePage from './pages/AdminHomePage';
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminUsersPage from "./pages/AdminUsersPage";

import ShopLayout from "./layouts/ShopLayout";
import ShopHomePage from './pages/ShopHomePage'
import ShopProductListPage from "./pages/ShopProductListPage";
import ShopThemeProvider from "./contexts/ShopThemeProvider";
import ShopProductDetailPage from "./pages/ShopProductDetailPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminProductTypePage from "./pages/AdminProductTypePage";
import AdminProductTypeCreatePage from "./pages/AdminProductTypeCreatePage";
import AdminProductPage from "./pages/AdminProductPage";
import AdminProductCreatePage from "./pages/AdminProductCreatePage";
import ShopMissPage from "./pages/ShopMissPage";
import ShopLoginPage from "./pages/ShopLoginPage";
import ShopRersistLogin from "./components/shop/ShopRersistLogin";
import ShopRegisterPage from "./pages/ShopRegisterPage";
import AuthStatusLayout from "./layouts/AuthStatusLayout";
import AuthStatusPage from "./pages/AuthStatusPage";
import ShopUserProfilePage from "./pages/ShopUserProfilePage";
import ShopCartPage from "./pages/ShopCartPage";
import ShopCheckOutPage from "./pages/ShopCheckOutPage";
import ShopUserOrderPage from "./pages/ShopUserOrderPage";
import ShopCategoryPage from "./pages/ShopCategoryPage";
import ShopKeywordPage from "./pages/ShopKeywordPage";
import AdminProductDetailPage from "./pages/AdminProductDetailPage";
import AdminProductTypeDetailPage from "./pages/AdminProductTypeDetailPage";
import AdminOrderPage from "./pages/AdminOrderPage";
import AdminOrderDetailPage from "./pages/AdminOrderDetailPage";

const Missing = () => {
  return(<div>Missing</div>);
}

function App() {
  return (
    <Routes>

      <Route path="/auth" element={<AuthStatusLayout />}>
        <Route path="/auth/:status" element={<AuthStatusPage />} />
      </Route>
      
      <Route path="/" element={<ShopLayout />}>

        <Route path="/account/login" element={<ShopLoginPage />} />
        <Route path="/account/register" element={<ShopRegisterPage />} />

        <Route element={<ShopRersistLogin />}>

          <Route index element={<ShopHomePage />} />

          <Route path="/products" element={<ShopProductListPage title={"全部商品"} showPage={true} />} />
          <Route path="/newproducts" element={<ShopProductListPage title={"最新商品"} showPage={true} />} />
          <Route path="/category/:category" element={<ShopCategoryPage />} />
          <Route path="/keyword/:name" element={<ShopKeywordPage />} />

          {/* <Route path="/clothes" element={<ShopProductListPage title={"衣服"} />} />
          <Route path="/pants" element={<ShopProductListPage title={"褲子"} />} />
          <Route path="/coats" element={<ShopProductListPage title={"外套"} />} />
          <Route path="/accessories" element={<ShopProductListPage title={"配件"} />} /> */}

          <Route path="/product/:itemId" element={<ShopProductDetailPage />} />

          <Route path="/user/profile" element={<ShopUserProfilePage />} />
          <Route path="/user/cart" element={<ShopCartPage />} />
          <Route path="/user/checkout" element={<ShopCheckOutPage />} />
          <Route path="/user/order" element={<ShopUserOrderPage />} />

          {/* catch all */}
          <Route path="*" element={<ShopMissPage />} />
        </Route>
      </Route>

      <Route path="/backstage/login" element={<AdminLoginPage />} />

      <Route path="/backstage" element={<AdminLayout />}>
        {/* public routes */}
        {/* <Route path="login" element={<AdminLoginPage />} /> */}

        {/* protect routes */}
        <Route element={<RersistLogin />}>
          <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
            <Route index element={<AdminHomePage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
            <Route path="user" element={<AdminUsersPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
            <Route path="category" element={<AdminCategoriesPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
            <Route path="producttype" element={<AdminProductTypePage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
            <Route path="producttype/:id" element={<AdminProductTypeDetailPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
            <Route path="producttype/create" element={<AdminProductTypeCreatePage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
            <Route path="product" element={<AdminProductPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
            <Route path="product/:id" element={<AdminProductDetailPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
            <Route path="product/create" element={<AdminProductCreatePage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
            <Route path="order" element={<AdminOrderPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
            <Route path="order/:id" element={<AdminOrderDetailPage />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
