import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useStore } from "./context/StoreContext";
import { Navbar, Footer } from "./components/layout";
import { ScrollToTop } from "./ScrollToTop";
import { StoreBlocked } from "./components/StoreBlocked";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { FloatingWhatsAppButton } from "./components/ui/FloatingWhatsAppButton";

export default function StorePages() {
  const { store, loading } = useStore();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    if (store?.business_name) {
      document.title = store.business_name;
    }
    const faviconUrl = store?.favicon_url || "/logotipo.png";
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [store?.business_name, store?.favicon_url]);

  if (loading) return null;

  const status = store?.store_status || "active";

  if (status !== "active") {
    return <StoreBlocked status={status} />;
  }

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar heroMode={location.pathname === "/"} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/producto/:slug" element={<ProductDetail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer waveFromColor={isHome ? "#CB6EE4" : "#ffffff"} />
        <FloatingWhatsAppButton />
      </div>
    </>
  );
}
