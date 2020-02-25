import { createMuiTheme } from '@material-ui/core/styles';
import { blue, blueGrey } from '@material-ui/core/colors';


const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: blue,
        secondary: blueGrey
    }
});

export default theme;