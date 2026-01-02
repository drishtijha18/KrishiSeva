// Protected Route Component...ye mera backend ko frontend se connect kr reha hai 
//navigate krne k liye
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';



const DEMO_MODE = false;  //ye true krdo to bina login kiye dashboard dikhayega

const ProtectedRoute = ({ children }) => {
    // In demo mode, allow access without authentication
    if (DEMO_MODE) {
        console.log(' DEMO MODE: Showing dashboard without authentication');
        return children;
    }

    // Check if user has valid JWT token
    if (!isAuthenticated()) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    // Render the protected component if authenticated
    return children;
};

export default ProtectedRoute;
