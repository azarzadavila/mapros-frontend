import React from "react";
import { MenuBanner } from "./LinkBanner";
import MainViewParent from "./MainViewParent";

function MainView() {
  return (
    <MenuBanner>
      <MainViewParent />
    </MenuBanner>
  );
}

export default MainView;
