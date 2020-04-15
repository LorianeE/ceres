import React from "react";
import {useMediaQuery} from "@material-ui/core";

export function useIsOpen () {
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const toggle = () => {
    if (isMobile || open) {
      setOpen(!open)
    }
  };
  return [isMobile ? open : false, toggle]
}
