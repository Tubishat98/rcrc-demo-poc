"use client";
import './Services.module.css';
import ServiceBox from '../Services/Services';
function ServiceContainer(props) {
    return (
        <div className="flex gap-4">
            <div className='flex-1'> <ServiceBox Title="Total Requests" icon="fa-solid fa-scroll"Color="white" FontColor="gray" FontColorNumber="rgba(33, 87, 50, 1)" Count={props.RequestCount} /></div>
            <div className='flex-1' > <ServiceBox Title="Total Approval" icon="fa-solid fa-list-check" Color="white" FontColor="gray" FontColorNumber="rgb(72 162 111)" Count={props.RequestStepCount} /></div>
            <div className='flex-1' > <ServiceBox Title="Total Pending Approval" icon="fa-solid fa-hourglass" Color="white" FontColor="gray" FontColorNumber="#4285F4" Count={props.RequestStepPendingCount} /></div>
            <div className='flex-1' > <ServiceBox Title="Total Reverted Approval"icon="fa-solid fa-circle-exclamation" Color="white" FontColor="gray" FontColorNumber="rgb(239, 41, 41)" Count={props.RequestStepRevertedCount} /></div>
        </div>
    )
}
export default ServiceContainer;
