'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from "next/navigation";
import classNames from "classnames";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  FileText, 
  ClipboardCheck, 
  Calendar, 
  Mail, 
  FolderKanban,
  ChevronLeft,
  LogOut
} from 'lucide-react';

function SideNav() {
    const pathname = usePathname();
    const menuItems = [
        { id: 1, label: "Home", Icon: Home, link: "Home" },
        { id: 2, label: "Requests", Icon: FileText, link: "Request" },
        { id: 3, label: "Approvals", Icon: ClipboardCheck, link: "RequestStep" },
        { id: 4, label: "Calendar", Icon: Calendar, link: "calendar-view" },
        { id: 5, label: "Email", Icon: Mail, link: "email-management" },
        { id: 6, label: "Projects", Icon: FolderKanban, link: "projects" },
    ];

    const [toggleCollapse, setToggleCollapse] = useState(false);
    const [isCollapsible, setIsCollapsible] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(menuItems[0].id);
    const [hoveredItem, setHoveredItem] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Set active menu based on current path
        const currentPath = pathname.split('/')[1];
        const activeItem = menuItems.find(item => 
            item.link.toLowerCase() === currentPath?.toLowerCase()
        );
        if (activeItem) {
            setSelectedMenu(activeItem.id);
        }
    }, [pathname]);

    const handleClick = (e, path, id) => {
        e.preventDefault();
        setSelectedMenu(id);
        if (path === 'Home' || path === 'Request' || path === 'calendar-view' || path === 'email-management' || path === 'projects') {
            router.push('/' + path);
        }
        if (path === 'RequestStep') {
            router.push('/' + path);
        }
    };

    const wrapperClasses = classNames(
        "h-screen flex justify-between flex-col transition-all duration-300 ease-in-out",
        {
            ["w-80"]: !toggleCollapse,
            ["w-20"]: toggleCollapse,
        }
    );

    const collapseIconClasses = classNames(
        "p-2 rounded-full bg-white/10 absolute right-0 top-1/2 transform -translate-y-1/2",
        {
            "rotate-180": toggleCollapse,
        }
    );

    const getNavItemClasses = (menu) => {
        return classNames(
            "flex items-center cursor-pointer w-full overflow-hidden whitespace-nowrap rounded-lg transition-all duration-200",
            {
                ["bg-white/10"]: selectedMenu === menu.id,
                ["hover:bg-white/5"]: selectedMenu !== menu.id,
            }
        );
    };

    const onMouseOver = () => {
        setIsCollapsible(!isCollapsible);
    };

    const handleSidebarToggle = () => {
        setToggleCollapse(!toggleCollapse);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={wrapperClasses}
            onMouseEnter={onMouseOver}
            onMouseLeave={onMouseOver}
            style={{ background: 'linear-gradient(180deg, #00884e 0%, #006b3d 100%)' }}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <motion.div 
                    className="flex items-center justify-between relative p-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-4">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="relative"
                        >
                            <img
                                className="w-full h-full object-contain"
                                src="https://www.rcrc.gov.sa/wp-content/uploads/2025/04/RCRC-LOGO.png"
                                alt="RCRC"
                                loading="eager"
                            />
                        </motion.div>
                    </div>
                    {isCollapsible && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={collapseIconClasses}
                            onClick={handleSidebarToggle}
                        >
                            <ChevronLeft className="text-white" size={20} />
                        </motion.button>
                    )}
                </motion.div>

                {/* Navigation Items */}
                <motion.div 
                    className="flex flex-col items-start px-4 space-y-2 mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {menuItems.map((menu, index) => {
                        const isSelected = selectedMenu === menu.id;
                        const isHovered = hoveredItem === menu.id;
                        const classes = getNavItemClasses(menu);
                        return (
                            <motion.div
                                key={menu.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className={classes}
                                onMouseEnter={() => setHoveredItem(menu.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <a 
                                    href={menu.link} 
                                    onClick={(e) => handleClick(e, menu.link, menu.id)} 
                                    className="flex items-center w-full p-3"
                                >
                                    <motion.div 
                                        className="flex items-center justify-center w-8 h-8"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <menu.Icon 
                                            className={classNames(
                                                "transition-colors duration-200",
                                                {
                                                    "text-white": !isSelected && !isHovered,
                                                    "text-green-300": isSelected || isHovered,
                                                }
                                            )} 
                                            size={20} 
                                        />
                                    </motion.div>
                                    <AnimatePresence>
                                        {!toggleCollapse && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className={classNames(
                                                    "ml-3 font-medium transition-colors duration-200",
                                                    {
                                                        "text-white": !isSelected && !isHovered,
                                                        "text-green-300": isSelected || isHovered,
                                                    }
                                                )}
                                            >
                                                {menu.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </a>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Logout Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="p-4 mt-auto"
                >
                    <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-white/5"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center justify-center w-8 h-8"
                        >
                            <LogOut className="text-white" size={20} />
                        </motion.div>
                        <AnimatePresence>
                            {!toggleCollapse && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="ml-3 text-white font-medium"
                                >
                                    Logout
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default SideNav;