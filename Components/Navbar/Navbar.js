'use client'
import { Fragment, useState, useEffect } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import EndPoints from "../../Services/EndPoints";
import { getRequest } from "../../Services/RestClient";
import './navbar.module.css';
import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
function NavBar() {
    const toast = useToast()
    const MAX_NOTIFICATIONS = 5;
    let router = useRouter();
    const navigation = [
        { name: 'Home', href: '#', current: true },
        { name: 'Request Step', href: '#', current: false },
        { name: 'Request', href: '#', current: false },
        { name: 'Contact Us', href: '#', current: false },
        { name: 'Meetings', href: '#', current: false },
    ];

    const predefinedUsers = [
        { name: 'Ahmed', image: 'https://i.ibb.co/tm6Dt3W/Saudi-Image2.jpg', id: '13f47ec4-4abd-ef11-b8e9-6045bdda0302', role: 'Approver' },
        { name: 'Mohammad Tubishat', image: 'https://i.ibb.co/qgPSHbW/Arabsstock-Saudi-Arabian-Gulf-Man-Standing-2.jpg', id: '13f47ec4-4abd-ef11-b8e9-6045bdda0302', role: 'Initiator' }
    ];
    const [requestStepData, setRequestStepData] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [navItems, setNavItems] = useState(navigation);
    const [selectedUser, setSelectedUser] = useState(predefinedUsers[0]);
    const storedUser = localStorage.getItem('selectedUser');

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };
    const handleClick = (e, path, item) => {
        e.preventDefault();
        if (path === 'Home' || path === 'Request') {
            router.replace(path);
        }
        const updatedNavItems = navItems.map((navItem) => {
            if (navItem.name === item.name) {
                return {
                    ...navItem,
                    current: true,
                };
            } else {
                return {
                    ...navItem,
                    current: false,
                };
            }
        });
        setNavItems(updatedNavItems);
    };
    const handleViewClick = (stepId) => {
        setShowNotifications(!showNotifications);
        router.push(`/RequestStep/${stepId}`);
    };
    const NavigatetoRequestStep = () => {
        setShowNotifications(!showNotifications);
        router.push(`/RequestStep/`);
    };
    const handleDismissClick = (notificationId) => {
        const notificationElement = document.getElementById(`notification-${notificationId}`);

        // Add the class for the fade-out effect.
        notificationElement.classList.add('dismissed-notification');

        // Wait for the animation to complete before removing the notification from the state.
        setTimeout(() => {
            const remainingNotifications = requestStepData.filter(notif => notif.ID !== notificationId);
            setRequestStepData(remainingNotifications);
            let dismissedNotifications = JSON.parse(localStorage.getItem('dismissedNotifications')) || [];
            dismissedNotifications.push(notificationId);
            localStorage.setItem('dismissedNotifications', JSON.stringify(dismissedNotifications));
        }, 500);
    };

    const handleUserSwitch = (user) => {
        setSelectedUser(user);
        toast({
            title: 'User Switched',
            description: "We've Switched the User to " + user.name,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top',
        })
        localStorage.setItem('selectedUser', JSON.stringify(user));
        location.reload();
    };

    useEffect(() => {
        if (storedUser) {
            setSelectedUser(JSON.parse(storedUser));
        }
        getRequest(EndPoints.Service.PendingRequestStepData + "?userID=" + JSON.parse(storedUser)?.id)
            .then((result) => {
                let dismissedNotifications = JSON.parse(localStorage.getItem('dismissedNotifications')) || [];
                let activeNotifications = result.ListResponse.filter(
                    notification => !dismissedNotifications.includes(notification.ID)
                );
                setRequestStepData(activeNotifications);
            })
            .catch((error) => {
                console.error("There was an error fetching data", error);
            })
            .finally(() => {
            });
    }, []);

    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        <input
                                            style={{ width: '40vh' }}
                                            type="text"
                                            id="first_name"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Search..."
                                            required
                                        ></input>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 mx-2">
                                    <div className="relative">
                                        <div className="relative">
                                            <button
                                                className="relative align-middle rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                                                onClick={toggleNotifications}
                                            >
                                                <BellIcon className="h-7 w-7" aria-hidden="true" />
                                                {requestStepData.length > 0 && (
                                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                                        {requestStepData.length}
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                        {showNotifications && (
                                            <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100" style={{ zIndex: 1000, width: '40vh' }}>
                                                <div className="px-4 py-3 bg-gray-50 text-gray-800 border-b font-bold">
                                                    Notifications Panel
                                                </div>
                                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                    {requestStepData.length > 0 ? (
                                                        <>
                                                            {requestStepData.slice(0, MAX_NOTIFICATIONS).map((step, index) => (
                                                                <div
                                                                    key={step.ID} id={`notification-${step.ID}`}
                                                                    className="block px-4 py-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                                    role="menuitem"
                                                                >
                                                                    <div className="flex justify-between">
                                                                        <div className="flex space-x-2">
                                                                            <i className="fa-solid fa-user fa-2xs d-flex items-center"></i>                                                                            <div>
                                                                                <div className="text-xs text-gray-500">
                                                                                    {step.Date}
                                                                                </div>
                                                                                <div className="oneline font-bold">
                                                                                    {step.Summary.length > 45 ? step.Summary.slice(0, 45) + "..." : step.Summary}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className={` flex text-center	items-center ${step.Status === 'Open' ? 'open' : 'bg-green-100 text-green-800'}`}>
                                                                            {step.Status}
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-2 flex justify-end space-x-2">
                                                                        <button onClick={() => handleViewClick(step.ID)} className="text-blue-600 hover:underline">View</button>
                                                                        {step.Status === 'Open' && (
                                                                            <button onClick={() => handleDismissClick(step.ID)} className="text-red-600 hover:underline">Dismiss</button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {requestStepData.length > MAX_NOTIFICATIONS && (
                                                                <div className="px-4 py-2 text-right text-sm">
                                                                    <a onClick={() => NavigatetoRequestStep()} className="text-blue-600 hover:underline cursor-pointer">View all notifications</a>
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="block px-4 py-2 text-sm text-gray-700">
                                                            No New Notifications
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Menu as="div" className="relative ml-3">
                                    <div className="flex items-center">
                                        <img
                                            className="h-9 w-9 rounded-full object-cover"
                                            src={selectedUser.image}
                                            alt=""
                                        />
                                        <div className="px-2">
                                            <span className='mx-1 row font-bold block text-base'>{selectedUser.name}</span>
                                            <span className='mx-1 block text-xs'>{selectedUser.role}</span>
                                        </div>
                                        <Menu.Button className="relative flex items-center">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                            <i className="fa-solid fa-chevron-down d-flex items-center"></i>
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            {predefinedUsers.map((user) => (
                                                <Menu.Item key={user.id}>
                                                    {({ active }) => (
                                                        <a
                                                            className={classNames(
                                                                active ? 'bg-gray-100' : '',
                                                                'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                                                            )}
                                                            onClick={() => handleUserSwitch(user)}
                                                        >
                                                            {user.name}
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                    onClick={(e) => handleClick(e, item.href, item)}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}

export default NavBar;
