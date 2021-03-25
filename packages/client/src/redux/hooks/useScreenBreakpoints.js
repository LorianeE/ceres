import { useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

const useScreenBreakpoints = () => {
  const theme = useTheme();

  const isSmOrLower = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });

  return {
    isSmOrLower,
  };
};

export default useScreenBreakpoints;
