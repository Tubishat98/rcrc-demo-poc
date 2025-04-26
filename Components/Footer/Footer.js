function Footer() {
    return (
        <footer className="bg-gray-800">
            <div className="max-w-6xl m-auto text-gray-800 flex flex-wrap justify-left">
                <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                    <div className="text-xs uppercase text-gray-400 font-medium mb-6">
                        Public Investment Fund
                    </div>
                    <p className="text-gray-400">
                        Riyadh <br />
                        Saudi Arabia <br /><br />
                    </p>
                </div>
                <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                    <div className="text-xs uppercase text-gray-400 font-medium mb-6">
                        Quick Links
                    </div>
                    <ul className="list-unstyled">
                        <li>
                            <a href="#" className="text-gray-400 hover:text-gray-100 block py-2">About Us</a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-400 hover:text-gray-100 block py-2">Services</a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-400 hover:text-gray-100 block py-2">Blog</a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-400 hover:text-gray-100 block py-2">Contact</a>
                        </li>
                    </ul>
                </div>
                <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                    <div className="text-xs uppercase text-gray-400 font-medium mb-6">
                        Follow Us
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-gray-100">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-100">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-100">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-100">
                            <i className="fab fa-linkedin"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="pt-2">
                <div className="flex pb-5 px-3 m-auto pt-5 
                border-t border-gray-500 text-gray-400 text-sm 
                flex-col md:flex-row max-w-6xl">
                    <div className="mt-2">
                        Copyright © 2023 Public Investment Fund. All rights reserved.
                    </div>
                    <div className="md:flex-auto md:flex-row-reverse mt-2 flex-row flex">
                        <a href="#" className="w-6 mx-1">
                            <i className="text-gray-400 fab fa-creative-commons"></i>
                        </a>
                        <a href="#" className="w-6 mx-1">
                            <i className="text-gray-400 fab fa-creative-commons-by"></i>
                        </a>
                        <a href="#" className="w-6 mx-1">
                            <i className="text-gray-400 fab fa-creative-commons-nd"></i>
                        </a>
                        <a href="#" className="w-6 mx-1">
                            <i className="text-gray-400 fab fa-creative-commons-sa"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
