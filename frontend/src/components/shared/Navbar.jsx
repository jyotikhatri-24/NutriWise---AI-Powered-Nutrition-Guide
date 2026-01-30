import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constant';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

const Navbar = () => {
    const navigate = useNavigate();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate(ROUTES.LOGIN);
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <nav className="bg-white shadow-lg" role="navigation" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link 
                            to={ROUTES.HOME} 
                            className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors duration-200"
                            aria-label="NutriWise Home"
                        >
                            NutriWise
                        </Link>
                    </div>

                    <div className="flex items-center">
                        {user ? (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        className="relative h-8 w-8 rounded-full hover:bg-green-50 transition-all duration-200"
                                        aria-label="Open user menu"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} alt={`${user.fullname}'s profile picture`} />
                                            <AvatarFallback className="bg-green-100 text-green-600">
                                                {getInitials(user.fullname)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-56" align="end">
                                    <div className="grid gap-4">
                                        <div className="px-2 py-1.5">
                                            <span className="text-sm font-medium">
                                                {user.fullname || 'User'}
                                            </span>
                                            <span className="text-xs text-gray-500 block">
                                                {user.email}
                                            </span>
                                        </div>
                                        <div className="grid gap-2">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                                                onClick={() => navigate(ROUTES.PROFILE)}
                                                aria-label="View your profile"
                                            >
                                                View Profile
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                                                onClick={handleLogout}
                                                aria-label="Log out of your account"
                                            >
                                                Log Out
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <div className="flex gap-4" role="navigation" aria-label="Authentication">
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate(ROUTES.LOGIN)}
                                    className="hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                                    aria-label="Log in to your account"
                                >
                                    Log In
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={() => navigate(ROUTES.SIGNUP)}
                                    className="bg-green-600 hover:bg-green-700 transition-all duration-200"
                                    aria-label="Create a new account"
                                >
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;