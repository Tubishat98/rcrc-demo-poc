"use client"
import { useState, useEffect } from 'react'
import EndPoints from "../../Services/EndPoints";
import { getRequest } from "../../Services/RestClient";
import { useRouter } from "next/navigation";
import { Button } from '@chakra-ui/react'

export default function Request() {
    const [requestData, setRequestData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const storedUser = localStorage.getItem('selectedUser'); 
    const itemsPerPage = 5;
    const router = useRouter();
    const fetchData = () => {
        setIsLoading(true);
        getRequest(EndPoints.Service.requestData + "?userID=" + JSON.parse(storedUser).id)
            .then((result) => {
                setRequestData(result.ListResponse);
            })
            .catch((error) => {
                console.error("There was an error fetching data", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    useEffect(() => {
        fetchData();
    }, [storedUser]);
    const navigateToCreateRequest = () => {
        router.push('RequestForm');
    };
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const currentItems = requestData?.slice(firstItemIndex, lastItemIndex);
    const totalPages = Math.ceil(requestData.length / itemsPerPage);
    function getStatusStyle(status) {
        switch (status.toLowerCase()) {
            case 'endorsed':
                case 'completed':
                return 'status submitted'; 
            case 'rejected':
            case 'reverted':
                return 'status rejected'; 
            case 'open':
                case 'submitted':

                return 'status open'; 
            default:
                return 'status default'; 
        }}
    function handlePageChange(newPage) {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    }
    function EmptyState() {
        return (
            <div className="w-full text-center py-12">
                                <i className="fa-solid fa-face-frown-open mb-3" style={{fontSize:'45px'}}></i>
                <p className="text-2xl text-gray-600 dark:text-gray-400">No items available</p>
            </div>
        );
    }
    return (
        <>
            <div className=" grid-cols-4 grid-rows-5 gap-4 px-6 pt-14 lg:px-8">
                {isLoading ? (
                    <div className="col-span-3 row-span-4 col-start-2 row-start-2 ">
                        <h1 className='m-3 MainTitle'>My Requests</h1>
                        <div className="skeleton-table p-4">
                            <table className="min-w-full text-left text-sm font-light">
                                <thead className="border-b font-medium dark:border-neutral-500">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 grid-row-header">SR #</th>
                                        <th scope="col" className="px-6 py-4 grid-row-header">Request Type</th>
                                        <th scope="col" className="px-6 py-4 grid-row-header">Submitted Date</th>
                                        <th scope="col" className="px-6 py-4 grid-row-header">Title</th>
                                        <th scope="col" className="px-6 py-4 grid-row-header">Email Address</th>
                                        <th scope="col" className="px-6 py-4 grid-row-header">Status</th>
                                    </tr>
                                </thead>
                            </table>
                            {[...Array(4)].map((_, rowIndex) => (
                                <div key={rowIndex} className="skeleton-row">
                                    {[...Array(4)].map((_, colIndex) => (
                                        <div key={colIndex} className="skeleton-cell"></div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="col-span-3 row-span-4 col-start-2 row-start-2 ">
                            <div className="flex justify-between items-center">
                                <h1 className='pb-5 MainTitle'>My Requests</h1>
                                    <div className="flex items-center pb-5">
                                        <Button leftIcon={<i className="fa-solid fa-plus cursor-pointer fa-sm" title='Create New'></i>} onClick={() => navigateToCreateRequest()} colorScheme='green' size='sm' variant='solid'>
                                            Create New
                                        </Button>
                                        <Button leftIcon={<i className="fa-solid fa-arrow-rotate-right fa-sm " title='Refresh'></i>} className='mx-2' onClick={fetchData} colorScheme='green' size='sm' variant='solid'>
                                            Refresh
                                        </Button>
                                </div>
                            </div>
                            <div className="flex flex-col bg-white rounded">
                                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                        <div className="overflow-hidden">
                                            <table className="min-w-full text-left text-sm font-light">
                                                <thead className="border-b font-medium dark:border-neutral-500">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-4 grid-row-header">SR #</th>
                                                        <th scope="col" className="px-6 py-4 grid-row-header">Request Type</th>
                                                        <th scope="col" className="px-6 py-4 grid-row-header">title</th>
                                                        <th scope="col" className="px-6 py-4 grid-row-header">Email Address</th>
                                                        <th scope="col" className="px-6 py-4 grid-row-header">Submitted Date</th>
                                                        <th scope="col" className="px-6 py-4 grid-row-header">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {currentItems?.length > 0 ? (
                                                    currentItems?.map(item => (
                                                        <tr key={item.id} className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                                                            <td className="whitespace-nowrap px-6 py-4 font-medium"><span>{item.RequestNumber}</span></td>
                                                            <td className="whitespace-nowrap px-6 py-4"><span>{item.ProccessTemplate}</span></td>
                                                            <td className="whitespace-nowrap px-6 py-4"><span>{item.Title}</span></td>
                                                            <td className="whitespace-nowrap px-6 py-4"><span>{item.EmailAddress}</span></td>
                                                            <td className="whitespace-nowrap px-6 py-4"><span>{item.Date}</span></td>
                                                            <td className="whitespace-nowrap px-6 py-4"><span className={getStatusStyle(item.Status)}>{item.Status}</span></td>
                                                        </tr>
                                                    ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="6">
                                                                <EmptyState />
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200  px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <a                                  
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Previous
                                </a>
                                <a                                  
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Next
                                </a>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{firstItemIndex + 1}</span> to <span className="font-medium">{Math.min(lastItemIndex, requestData.length)}</span> of{' '}
                                        <span className="font-medium">{requestData.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <a
                                            href="#"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <i className="fa-solid fa-angle-left"></i>

                                        </a>
                                        {[...Array(totalPages)].map((_, idx) => (
                                            <a
                                                key={idx}
                                               
                                                onClick={() => handlePageChange(idx + 1)}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold cursor-pointer ${currentPage === idx + 1 ? 'bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'text-gray-900 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`}
                                            >
                                                {idx + 1}
                                            </a>
                                        ))}
                                        <a                                          
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 cursor-pointer ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`}
                                        >
                                            <span className="sr-only">Next</span>
                                            <i className="fa-solid fa-angle-right"></i>
                                        </a>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
