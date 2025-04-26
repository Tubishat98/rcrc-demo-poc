"use client"
import { useState, useEffect } from 'react'
import EndPoints from "../../Services/EndPoints";
import { getRequest } from "../../Services/RestClient";
import ServiceContainer from '../../Components/Services/ServicesBox';
import { Pie, Line } from "react-chartjs-2";
import { useRouter } from "next/navigation";
import Badeel from 'Images/Badeel.png'
import Chart from 'chart.js/auto'
import SkeletonTable from '../../Components/Tables/SkeletonTable/SkeletonTable';
import Table from '../../Components/Tables/Table/Table';

export default function Home() {
    const [requestData, setRequestData] = useState([]);
    const [requestStepData, setRequestStepData] = useState([]);
    const [pendingRequestCount, setpendingRequestCount] = useState(0);
    const [revertedRequestCount, setrevertedRequestCount] = useState(0);
    const [submittedRequestCount, setsubmittedRequestCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const storedUser = localStorage.getItem('selectedUser');
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 4;
    const labels = ["Reverted", "Pending", "Submitted"];
    const router = useRouter();
    const columns = [
        { Header: 'SR #', accessor: 'RequestStepNumber' },
        { Header: 'Stage', accessor: 'Stage' },
        { Header: 'Date', accessor: 'Date' },
        { Header: 'Title', accessor: 'Summary' },
        { Header: 'Status', accessor: 'Status' }
    ];
    const columnsRequest = [
        { Header: 'SR #', accessor: 'RequestNumber' },
        { Header: 'Request Type', accessor: 'ProccessTemplate' },
        { Header: 'Date', accessor: 'Date' },
        { Header: 'Title', accessor: 'Title' },
        { Header: 'Status', accessor: 'Status' },
    ];
    const handleClick = (e, path) => {
        e.preventDefault();
        router.push(path);
    }
    const chartData = {
        labels: ["Reverted", "Pending", "Submitted"],
        datasets: [{
            data: [revertedRequestCount, pendingRequestCount, submittedRequestCount],
            backgroundColor: ["rgba(21, 50, 38, 1)", "#30A46C", "#483D8B"],
            hoverBackgroundColor: ["#B08B58", "#52BE80", "#695E98"],
            hoverBorderColor: "white",
            hoverBorderWidth: 2,
        }]
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Request Status Distribution',

                font: {
                    size: 22,
                    weight: 'bold',
                },
                color: '#34495E',
                padding: {
                    top: 10,
                    bottom: 30,
                }
            },
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 15,
                    fontStyle: 'bold',
                }
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleFont: { weight: 'bold', color: '#FFFFFF' },
                bodyColor: '#FFFFFF',
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true,
            tension: {
                duration: 1000,
                easing: 'easeOutQuart',
                from: 1,
                to: 0,
                loop: true
            }
        },
        cutout: '50%',
    };
    useEffect(() => {
        getRequest(EndPoints.Service.requestData + "?userID=" + JSON.parse(storedUser)?.id)
            .then((result) => {
                setRequestData(result.ListResponse);
            })
            .catch((error) => {
                console.error("There was an error fetching data", error);
            })
            .finally(() => {
            });
        getRequest(EndPoints.Service.requestStepData + "?userID=" + JSON.parse(storedUser)?.id)
            .then((result) => {
                setRequestStepData(result.ListResponse);
                setpendingRequestCount(result.ListResponse.filter(item => item.Status == "Open").length);
                setrevertedRequestCount(result.ListResponse.filter(item => item.Status == "Reverted").length);
                setsubmittedRequestCount(result.ListResponse.filter(item => item.Status == "Submitted").length);
            })
            .catch((error) => {
                console.error("There was an error fetching data", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [storedUser]);

    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const currentItemsSteps = requestStepData?.slice(firstItemIndex, lastItemIndex);
    const currentItems = requestData?.slice(firstItemIndex, lastItemIndex);
    return (
        <div className="  gap-4 px-6 pt-8 lg:px-8 ">
            <div className="row-span-3">
                <div className='flex flex-col mb-10 items-start'>
                    <div className='flex items-center'>
                        <img src={Badeel.src} style={{ objectFit: 'none' }} alt="logo"></img>
                        <div className='flex flex-col'>
                            <h1 className='text-4xl font-semibold mx-4'>Welcome back, {JSON.parse(storedUser)?.name}</h1>
                            <div className='text-gray-500 text-sm'>
                                <h2 className='mx-5'>Track your Requests and Actions Activity here.</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <ServiceContainer RequestCount={requestData.length} RequestStepCount={requestStepData.length} RequestStepPendingCount={pendingRequestCount} RequestStepRevertedCount={revertedRequestCount} />
                <div>
                </div>
            </div>
            <div className="col-span-3 flex pt-5 gap-4">
                <div className='flex-1 gridBorder'>
                    {isLoading ? (
                        <div className="col-span-3 row-span-4 col-start-2 row-start-2 gridBorder h-100">
                            <h1 className='p-4 MainTitle'>My Requests</h1>
                            <SkeletonTable columns={columns} />
                        </div>
                    ) : (
                        <div className="col-span-3 row-span-4 col-start-2 row-start-2 gridBorder h-100">
                            <div className="flex justify-between items-center">
                                <h1 className='p-4 MainTitle'>My Requests</h1>
                                <div className="relative group inline-block px-4">
                                    <div className="hidden absolute right-0 mt-2 space-y-2 bg-white border border-gray-200 rounded-lg shadow-lg group-hover:block">
                                        <button style={{ width: '20vh' }} className="block p-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={(e) => handleClick(e, "RequestForm")}>Create New Request</button>
                                        <button style={{ width: '20vh' }} className="block p-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={(e) => handleClick(e, "Request")}>View All</button>
                                    </div>
                                    <div className="group cursor-pointer">
                                        <i className="fa-solid fa-ellipsis fa-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <Table data={requestData} columns={columnsRequest} maxRows='4' />
                            </div>
                        </div>
                    )}
                </div>
                <div className='flex-1 gridBorder'>
                    {isLoading ? (
                        <div className="col-span-3 row-span-4 col-start-2 row-start-2 gridBorder h-100 h-100">
                            <h1 className='p-4 MainTitle'>My Approvals</h1>
                            <SkeletonTable columns={columnsRequest} />
                        </div>
                    ) : (
                        <div className="col-span-3 row-span-4 col-start-2 row-start-2 gridBorder h-100">
                            <div className="flex justify-between items-center">
                                <h1 className='p-4 MainTitle'>My Approvals</h1>
                                <div className="relative group inline-block px-4">
                                    <div className="hidden absolute right-0 mt-2 space-y-2 bg-white border border-gray-200 rounded-lg shadow-lg group-hover:block">
                                        <button style={{ width: '20vh' }} className="block p-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={(e) => handleClick(e, "RequestStep")}>View All</button>
                                    </div>
                                    <div className="group cursor-pointer">
                                        <i className="fa-solid fa-ellipsis fa-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <Table data={requestStepData} columns={columns} maxRows='4'  />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="col-span-3 flex pt-5 gap-4" style={{ height: '50vh' }}>
                <div className='flex-1 gridBorder flex justify-center align-center'>
                    <Line
                        className='px-3 h-100 w-100'
                        data={{
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Approvals Counts',
                                    data: [revertedRequestCount, pendingRequestCount, submittedRequestCount],
                                    fill: true,
                                    borderColor: 'rgba(21, 50, 38, 1)',
                                    borderWidth: 2,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                                title: {
                                    display: true,
                                    text: 'Request Step Line',
                                    font: {
                                        size: 22,
                                        weight: 'bold',
                                        family: 'Gilroy-Medium, sans-serif !important'
                                    },
                                    color: '#34495E',
                                    padding: {
                                        top: 10,
                                        bottom: 30,
                                    }
                                },
                            },
                            interaction: {
                                intersect: false,
                                mode: 'nearest',
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                            animation: {
                                tension: {
                                    duration: 1000,
                                    easing: 'linear',
                                    from: 1,
                                    to: 0,
                                    loop: false,
                                },
                            },
                        }}
                    />
                </div>
                <div className='flex-1 gridBorder flex justify-center align-center'>
                    <Pie
                        data={chartData}
                        options={chartOptions}
                        className='w-100'
                    />
                </div>
            </div>
        </div>
    )
}