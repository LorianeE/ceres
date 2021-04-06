import { useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

const useScreenBreakpoints = () => {
  const theme = useTheme();

  const isSmOrLower = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
  const isXs = useMediaQuery(theme.breakpoints.only('xs'), { noSsr: true });
  const isSmallerThan780px = useMediaQuery('(max-width:779px)', { noSsr: true });

  return {
    isSmOrLower,
    isXs,
    isSmallerThan780px,
  };
};

export default useScreenBreakpoints;
