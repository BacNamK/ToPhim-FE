import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";

import BgGlobal from "./global/background";
import ItemOutlet from "./global/itemoutlet";

import Home from "./page/home";
import RegisterLogin from "./page/register&login";
import Manage from "./page/manage";
import TypeMovies from "./page/typeMovies";
import GenresMovies from "./page/genresMovies";
import CountryMovies from "./page/countryMovies";
import PlayMovies from "./page/playMovies";

createRoot(document.getElementById("root")!).render(
  <BgGlobal>
    <BrowserRouter>
      <Routes>
        <Route element={<ItemOutlet />}>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:string" element={<PlayMovies />} />
          <Route path="/type/:type" element={<TypeMovies />} />
          <Route path="/genres/:genreId" element={<GenresMovies />} />
          <Route path="/country/:country" element={<CountryMovies />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/register_login" element={<RegisterLogin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </BgGlobal>,
);
