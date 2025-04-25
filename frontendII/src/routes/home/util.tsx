import React, { Dispatch, FC, SetStateAction } from "react";
import { buttonProps } from "../../components/button";
import { floatingDivStack } from "../floatingDivStack";
import FloatingDiv from "../../hoc/floatingDiv/page";
import Profile from "../../hoc/profile/page";
import config from '../../tailwindconfig'
import { getPosition } from "../../utils";

export const handleCloseClick = (e: MouseEvent, setStack: Dispatch<SetStateAction<floatingDivStack>>) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.floating-div') && !target.closest('.floating-div-button')) {
    setStack({});
  }
}

export const handleCloseEsc = (e: KeyboardEvent, setStack: Dispatch<SetStateAction<floatingDivStack>>) => {
  if (e.key == 'Escape') {
    setStack({});
  }
}

export const buttons = (stack: floatingDivStack, setStack: Dispatch<SetStateAction<floatingDivStack>>): Array<buttonProps> => {
  return [
    {
      style: "icon",
      onClick: (e: React.MouseEvent<HTMLElement>) => {
      },

      icon: "fa-search",
      className: "floating-div-button mr-3"
    },
    {
      style: "icon",
      onClick: () => { },
      icon: "fa-sort",
      className: "floating-div-button mr-3"
    },
    {
      style: "icon",
      onClick: () => { },
      icon: "fa-filter",
      className: "floating-div-button mr-3"
    },
    {
      style: "icon",
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        const { clientX, clientY } = e;
        setStack(prevStack => ({
          ...prevStack,
          'header': (
            <FloatingDiv pos={{ x: clientX - 128, y: clientY + 15 }} padding="1" >
              <Profile />
            </FloatingDiv>
          )
        }))

      },
      icon: "fa-user",
      className: "floating-div-button"
    },
  ]
}