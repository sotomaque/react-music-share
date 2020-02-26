import { createMuiTheme } from '@material-ui/core/styles';
import { blue, pink } from '@material-ui/core/colors';


const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: blue,
        secondary: pink
    }
});

export default theme;