import { useState } from 'react';
import { useMediaQuery } from '@material-ui/core';

const useIsOpen = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const toggle = () => {
    if (isMobile || open) {
      setOpen(!open);
    }
  };
  return [isMobile ? open : false, toggle];
};

export default useIsOpen;
