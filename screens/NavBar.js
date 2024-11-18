import React from 'react'; 
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const NavBar = ({ value, setValue, navigation }) => {
    const handleNavigation = (newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            navigation.navigate('IotScreen'); 
        } else if (newValue === 1) {
            navigation.navigate('GraphScreen'); 
        }
    };

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => handleNavigation(newValue)}
            >
                <BottomNavigationAction label="Ambientação" icon={<HomeIcon />} />
                <BottomNavigationAction label="Gastos" icon={<AttachMoneyIcon />} />
            </BottomNavigation>
        </Paper>
    );
};

export default NavBar;
