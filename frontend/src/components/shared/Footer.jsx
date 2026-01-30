import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constant';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-white border-t border-gray-200 mt-8">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-sm text-gray-600">
                        &copy; {currentYear} NutriWise. All rights reserved.
                    </div>
                    <div className="mt-2 md:mt-0">
                        <div className="flex space-x-6">
                            <Link to="/" className="text-gray-500 hover:text-green-600 text-sm">
                                Home
                            </Link>
                            <Link to={ROUTES.ANALYSIS} className="text-gray-500 hover:text-green-600 text-sm">
                                Analysis
                            </Link>
                            <a href="#" className="text-gray-500 hover:text-green-600 text-sm">
                                Privacy
                            </a>
                            <a href="#" className="text-gray-500 hover:text-green-600 text-sm">
                                Terms
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
