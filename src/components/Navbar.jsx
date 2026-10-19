import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { toggleTheme } from '../features/theme/themeSlice';
import { logout } from '../features/auth/authSlice';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { Link as RouterLink } from 'react-router-dom';


const collapsedWidth = 50;
const expandedWidth = 240;

function Navbar() {
    const dispatch = useDispatch();
    const mode = useSelector((state) => state.theme.mode);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const theme = useTheme();

    return (
        <Drawer
            variant="permanent"
            sx={{
                position: 'fixed',
                zIndex: 1200,
                width: collapsedWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: collapsedWidth,
                    boxSizing: 'border-box',
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    overflow: 'hidden',
                    borderRight: 1,
                    borderColor: 'divider',
                    transition: 'width 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                        width: expandedWidth,
                        boxShadow: (theme) => theme.shadows[8],
                    },
                    [theme.breakpoints.down('sm')]: {
                        width: '100%',
                    },
                },
            }}
        >
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: 0,
                }}
            >
<Typography
  variant="h5"
  component={RouterLink}
  to="/"
  color="primary.main"
  fontWeight="bold"
  noWrap
  sx={{
    fontFamily: 'inherit',
    fontSize: { xs: '1.6rem', md: '2rem' },
    letterSpacing: 0.5,
  }}
>
  Recipe Box
</Typography>
            </Box>
            <Divider />
            <List sx={{ pt: 2, flexGrow: 1 }}>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/">
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>

                 <ListItem disablePadding>
                    <ListItemButton component={Link} to="/homePage">
                        <ListItemIcon>
                            <RestaurantMenuIcon />
                        </ListItemIcon>
                        <ListItemText primary="Recipes" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/favorites">
                        <ListItemIcon>
                            <FavoriteIcon />
                        </ListItemIcon>
                        <ListItemText primary="Favorites" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List sx={{ pb: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => dispatch(toggleTheme())}>
                        <ListItemIcon>
                            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                        </ListItemIcon>
                        <ListItemText primary={mode === 'light' ? 'Dark Mode' : 'Light Mode'} />
                    </ListItemButton>
                </ListItem>
                {isAuthenticated && (
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => dispatch(logout())}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Drawer>
    );
}

export default Navbar;