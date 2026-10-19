import { Link } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
      <Typography variant="h1" component="h1" gutterBottom color="error">
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Page not found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to="/"
        startIcon={<HomeIcon />}
        size="large"
      >
        Back home
      </Button>
    </Container>
  );
}

export default NotFoundPage;
