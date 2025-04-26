"use client"

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isToday, isSameDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useMemo, useEffect } from 'react';
import styled from '@emotion/styled';
import { FaSearch, FaPlus, FaChartPie, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaMinus, FaExpand, FaFileAlt, FaUsers, FaCheck, FaPaperclip, FaVideo, FaTrash, FaEdit, FaPlusCircle, FaUpload, FaClock, FaMapMarkerAlt, FaUser, FaTag, FaComments, FaShare, FaBell, FaStar, FaEllipsisH, FaDownload, FaReply, FaThumbsUp, FaRegThumbsUp, FaBuilding, FaGlobe, FaPhone, FaEnvelope, FaCalendarPlus, FaUserPlus } from 'react-icons/fa';

const locales = {
    'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const CalendarContainer = styled.div`
    height: 80vh;
    margin: 50px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 20px;
    animation: fadeIn 0.5s ease-out;
    position: relative;
    z-index: 1;
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .rbc-calendar {
        height: 100%;
        transition: all 0.3s ease;
    }
    
    .rbc-header {
        padding: 12px 0;
        font-weight: 600;
        color: #2d3748;
        transition: color 0.2s ease;
    }
    
    .rbc-today {
        background-color: rgba(72, 187, 120, 0.1);
        transition: background-color 0.3s ease;
    }
    
    .rbc-event {
        background-color: #48BB78;
        border-radius: 6px;
        padding: 2px 5px;
        font-size: 0.9em;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: center;
        
        &:hover {
            background-color: #38A169;
            transform: scale(1.02);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
    }
    
    .rbc-toolbar {
        margin-bottom: 20px;
        padding: 10px;
        background: #f7fafc;
        border-radius: 12px;
        transition: all 0.3s ease;
    }
    
    .rbc-toolbar button {
        color: #4a5568;
        border: 1px solid #e2e8f0;
        padding: 8px 16px;
        border-radius: 8px;
        background: white;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        
        &:hover {
            background: #edf2f7;
            color: #2d3748;
            transform: translateY(-2px);
        }
    }
    
    .rbc-toolbar button.rbc-active {
        background: #48BB78;
        color: white;
        border-color: #48BB78;
        transform: translateY(-2px);
    }

    .rbc-month-view {
        transition: all 0.3s ease;
    }

    .rbc-month-row {
        transition: all 0.3s ease;
    }

    .rbc-day-bg {
        transition: background-color 0.3s ease;
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    animation: fadeIn 0.3s ease;
    backdrop-filter: blur(4px);
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const ModalContent = styled.div`
    background: white;
    padding: 40px;
    border-radius: 20px;
    width: ${props => props.isCollapsed ? '400px' : '700px'};
    max-height: ${props => props.isCollapsed ? 'auto' : '85vh'};
    overflow-y: auto;
    position: relative;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transition: all 0.3s ease;
    
    @keyframes slideUp {
        from { 
            transform: translateY(30px) scale(0.95);
            opacity: 0;
        }
        to { 
            transform: translateY(0) scale(1);
            opacity: 1;
        }
    }
`;

const ModalTitle = styled.h2`
    font-size: ${props => props.isCollapsed ? '18px' : '24px'};
    margin-bottom: ${props => props.isCollapsed ? '12px' : '20px'};
    font-weight: 600;
    text-align: center;
    color: #2d3748;
    transition: all 0.3s ease;
    line-height: 1.3;
    padding: 0 20px;
`;

const ModalDetails = styled.div`
    font-size: ${props => props.isCollapsed ? '14px' : '16px'};
    line-height: 1.7;
    margin-bottom: ${props => props.isCollapsed ? '15px' : '30px'};
    color: #4a5568;
    transition: all 0.3s ease;
    
    div {
        margin-bottom: ${props => props.isCollapsed ? '8px' : '12px'};
    }
    
    strong {
        color: #2d3748;
        margin-right: 8px;
    }
`;

const ModalActions = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: ${props => props.isCollapsed ? '15px' : '30px'};
    transition: all 0.3s ease;
`;

const CollapseButton = styled.button`
    position: absolute;
    top: 20px;
    right: ${props => props.isCollapsed ? '20px' : '60px'};
    background: transparent;
    border: none;
    font-size: 20px;
    color: #a0aec0;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 5px;
    border-radius: 50%;
    
    &:hover {
        background: #f7fafc;
        color: #48BB78;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 24px;
`;

const Button = styled.button`
    padding: 14px 28px;
    font-size: 16px;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    min-width: 180px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 600;
    position: relative;
    overflow: hidden;
    
    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.1);
        transform: translateX(0);
        transition: transform 0.3s ease;
    }
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        
        &:before {
            transform: translateX(100%);
        }
    }
    
    &:active {
        transform: translateY(0);
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    background: transparent;
    border: none;
    font-size: 32px;
    color: #a0aec0;
    cursor: pointer;
    transition: color 0.2s;
    
    &:hover {
        color: #4a5568;
    }
`;

const Sidebar = styled.div`
    position: fixed;
    right: ${props => props.isCollapsed ? '-280px' : '20px'};
    top: 50%;
    transform: translateY(-50%);
    background: white;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    width: 300px;
    animation: ${props => props.isCollapsed ? 'slideOut' : 'slideIn'} 0.3s ease-out;
    z-index: 100;
    transition: right 0.3s ease-out;
    
    @keyframes slideIn {
        from { transform: translateX(100px) translateY(-50%); opacity: 0; }
        to { transform: translateX(0) translateY(-50%); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0) translateY(-50%); opacity: 1; }
        to { transform: translateX(100px) translateY(-50%); opacity: 0; }
    }
`;

const ToggleButton = styled.button`
    position: absolute;
    left: -30px;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 101;
    transition: all 0.3s ease;
    
    &:hover {
        background: #f7fafc;
        transform: translateY(-50%) scale(1.1);
    }
    
    svg {
        color: #48BB78;
        transition: transform 0.3s ease;
    }
`;

const SearchBar = styled.div`
    display: flex;
    align-items: center;
    background: #f7fafc;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
    
    input {
        border: none;
        background: transparent;
        padding: 8px;
        width: 100%;
        outline: none;
        color: #2d3748;
        
        &::placeholder {
            color: #a0aec0;
        }
    }
    
    svg {
        color: #a0aec0;
        margin-right: 10px;
    }
`;

const QuickAdd = styled.div`
    background: #f7fafc;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        background: #edf2f7;
        transform: translateY(-2px);
    }
    
    div {
        display: flex;
        align-items: center;
        color: #48BB78;
        font-weight: 600;
        
        svg {
            margin-right: 10px;
        }
    }
`;

const EventStats = styled.div`
    background: #f7fafc;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    
    h3 {
        color: #2d3748;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        
        svg {
            margin-right: 10px;
            color: #48BB78;
        }
    }
    
    .stat-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        color: #4a5568;
        
        .count {
            font-weight: 600;
            color: #48BB78;
        }
    }
`;

const TodaysEvents = styled.div`
    h3 {
        color: #2d3748;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        
        svg {
            margin-right: 10px;
            color: #48BB78;
        }
    }
    
    .event-item {
        background: #f7fafc;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 10px;
        transition: all 0.3s ease;
        
        &:hover {
            background: #edf2f7;
            transform: translateX(5px);
        }
        
        .time {
            font-size: 0.8em;
            color: #48BB78;
            margin-bottom: 5px;
        }
        
        .title {
            font-weight: 600;
            color: #2d3748;
        }
    }
`;

const CategoryTag = styled.span`
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8em;
    margin-right: 5px;
    background: ${props => props.color};
    color: white;
`;

const MoMSection = styled.div`
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
`;

const MoMHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
        display: flex;
        align-items: center;
        color: #2d3748;
        font-size: 18px;
        margin: 0;
        
        svg {
            margin-right: 10px;
            color: #48BB78;
        }
    }
`;

const AttendeesList = styled.div`
    margin-bottom: 20px;
    
    .attendee {
        display: flex;
        align-items: center;
        padding: 8px;
        background: #f7fafc;
        border-radius: 6px;
        margin-bottom: 8px;
        
        .status {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 10px;
            
            &.present {
                background: #48BB78;
            }
            
            &.absent {
                background: #e53e3e;
            }
            
            &.late {
                background: #ed8936;
            }
        }
        
        .name {
            color: #2d3748;
            font-weight: 500;
        }
        
        .role {
            color: #718096;
            font-size: 0.9em;
            margin-left: auto;
        }
    }
`;

const NotesSection = styled.div`
    margin-bottom: 20px;
    
    textarea {
        width: 100%;
        min-height: 150px;
        padding: 12px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        resize: vertical;
        font-size: 14px;
        line-height: 1.5;
        color: #2d3748;
        
        &:focus {
            outline: none;
            border-color: #48BB78;
            box-shadow: 0 0 0 2px rgba(72, 187, 120, 0.1);
        }
    }
`;

const ActionItems = styled.div`
    .action-item {
        display: flex;
        align-items: center;
        padding: 12px;
        background: #f7fafc;
        border-radius: 6px;
        margin-bottom: 8px;
        
        .checkbox {
            margin-right: 12px;
            cursor: pointer;
        }
        
        .content {
            flex: 1;
            
            .title {
                font-weight: 500;
                color: #2d3748;
                margin-bottom: 4px;
            }
            
            .assignee {
                font-size: 0.9em;
                color: #718096;
            }
        }
        
        .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: 500;
            
            &.pending {
                background: #fef3c7;
                color: #92400e;
            }
            
            &.in-progress {
                background: #dbeafe;
                color: #1e40af;
            }
            
            &.completed {
                background: #dcfce7;
                color: #166534;
            }
        }
    }
`;

const Attachments = styled.div`
    margin-top: 20px;
    
    .attachment {
        display: flex;
        align-items: center;
        padding: 8px;
        background: #f7fafc;
        border-radius: 6px;
        margin-bottom: 8px;
        
        svg {
            margin-right: 10px;
            color: #718096;
        }
        
        .name {
            color: #2d3748;
            font-size: 0.9em;
        }
        
        .size {
            color: #718096;
            font-size: 0.8em;
            margin-left: auto;
        }
    }
`;

const ExportButton = styled.button`
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background: #48BB78;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    
    svg {
        margin-right: 8px;
    }
    
    &:hover {
        background: #38A169;
        transform: translateY(-2px);
    }
`;

const ActionItemControls = styled.div`
    display: flex;
    gap: 8px;
    margin-left: auto;
    
    button {
        background: transparent;
        border: none;
        color: #718096;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
        
        &:hover {
            background: #edf2f7;
            color: #2d3748;
        }
        
        &.delete {
            &:hover {
                color: #e53e3e;
            }
        }
    }
`;

const AddActionItem = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 10px;
    padding: 10px;
    background: #f7fafc;
    border-radius: 6px;
    
    input {
        flex: 1;
        padding: 8px;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        font-size: 14px;
        
        &:focus {
            outline: none;
            border-color: #48BB78;
        }
    }
    
    select {
        padding: 8px;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        background: white;
        font-size: 14px;
        
        &:focus {
            outline: none;
            border-color: #48BB78;
        }
    }
    
    button {
        padding: 8px 16px;
        background: #48BB78;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
            background: #38A169;
        }
    }
`;

const FileUpload = styled.div`
    margin-top: 10px;
    padding: 10px;
    background: #f7fafc;
    border-radius: 6px;
    border: 2px dashed #e2e8f0;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        border-color: #48BB78;
        background: #f0fff4;
    }
    
    input[type="file"] {
        display: none;
    }
    
    .upload-text {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #718096;
        
        svg {
            color: #48BB78;
        }
    }
`;

const StatusSelect = styled.select`
    padding: 4px 8px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    background: white;
    font-size: 0.8em;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:focus {
        outline: none;
        border-color: #48BB78;
    }
`;

const ModernButton = styled.button`
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: ${props => props.variant === 'primary' ? '#48BB78' : 
        props.variant === 'secondary' ? '#EDF2F7' : 'transparent'};
    color: ${props => props.variant === 'primary' ? 'white' : 
        props.variant === 'secondary' ? '#2D3748' : '#718096'};
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: ${props => props.variant === 'primary' ? '0 4px 12px rgba(72, 187, 120, 0.2)' : 
            props.variant === 'secondary' ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'};
    }
    
    &:active {
        transform: translateY(0);
    }
`;

const ModernInput = styled.input`
    padding: 12px;
    border: 2px solid #E2E8F0;
    border-radius: 8px;
    font-size: 14px;
    width: 100%;
    transition: all 0.3s ease;
    background: white;
    
    &:focus {
        outline: none;
        border-color: #48BB78;
        box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
    }
    
    &::placeholder {
        color: #A0AEC0;
    }
`;

const ModernSelect = styled.select`
    padding: 12px;
    border: 2px solid #E2E8F0;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:focus {
        outline: none;
        border-color: #48BB78;
        box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
    }
`;

const Tag = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    background: ${props => props.color || '#EDF2F7'};
    color: ${props => props.textColor || '#2D3748'};
    margin-right: 8px;
    
    svg {
        margin-right: 4px;
    }
`;

const Card = styled.div`
    background: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    
    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
`;

const ActionItemCard = styled(Card)`
    display: flex;
    align-items: center;
    gap: 16px;
    
    .checkbox {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 2px solid #E2E8F0;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:checked {
            background: #48BB78;
            border-color: #48BB78;
        }
    }
    
    .content {
        flex: 1;
        
        .title {
            font-weight: 600;
            color: #2D3748;
            margin-bottom: 4px;
        }
        
        .assignee {
            font-size: 14px;
            color: #718096;
            display: flex;
            align-items: center;
            gap: 4px;
        }
    }
    
    .status {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .actions {
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.2s ease;
    }
    
    &:hover .actions {
        opacity: 1;
    }
`;

const FileUploadCard = styled(Card)`
    border: 2px dashed #E2E8F0;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        border-color: #48BB78;
        background: #F0FFF4;
    }
    
    .upload-text {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        color: #718096;
        
        svg {
            font-size: 24px;
            color: #48BB78;
        }
    }
`;

const MeetingHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    .title-section {
        h2 {
            font-size: 24px;
            font-weight: 700;
            color: #2D3748;
            margin-bottom: 8px;
        }
        
        .meta {
            display: flex;
            gap: 16px;
            color: #718096;
            font-size: 14px;
            
            span {
                display: flex;
                align-items: center;
                gap: 4px;
            }
        }
    }
    
    .actions {
        display: flex;
        gap: 12px;
    }
`;

const NotesEditor = styled.div`
    margin-bottom: 24px;
    
    textarea {
        width: 100%;
        min-height: 150px;
        padding: 16px;
        border: 2px solid #E2E8F0;
        border-radius: 8px;
        font-size: 14px;
        line-height: 1.6;
        resize: vertical;
        transition: all 0.3s ease;
        
        &:focus {
            outline: none;
            border-color: #48BB78;
            box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
        }
    }
    
    .editor-toolbar {
        display: flex;
        gap: 8px;
        margin-top: 8px;
        
        button {
            padding: 6px 12px;
            border: none;
            border-radius: 6px;
            background: #EDF2F7;
            color: #2D3748;
            cursor: pointer;
            transition: all 0.2s ease;
            
            &:hover {
                background: #E2E8F0;
            }
        }
    }
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 16px;
    
    h3 {
        margin: 0;
        white-space: nowrap;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        color: #2D3748;
        
        svg {
            color: #48BB78;
            flex-shrink: 0;
        }
    }
    
    .actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
    }
`;

const Section = styled.div`
    margin-bottom: 32px;
    padding: 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    min-width: 0;
    
    h3 {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #2D3748;
        font-size: 16px;
        font-weight: 600;
        white-space: nowrap;
        
        svg {
            color: #48BB78;
            flex-shrink: 0;
        }
    }
`;

const Spacer = styled.div`
    height: 24px;
`;

const CommentCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    
    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .comment-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        
        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #48BB78;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 16px;
        }
        
        .user-info {
            flex: 1;
            
            .name {
                font-weight: 600;
                color: #2D3748;
                margin-bottom: 2px;
            }
            
            .time {
                font-size: 12px;
                color: #718096;
            }
        }
        
        .actions {
            display: flex;
            gap: 8px;
            opacity: 0;
            transition: opacity 0.2s ease;
            
            button {
                background: transparent;
                border: none;
                color: #718096;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
                
                &:hover {
                    background: #EDF2F7;
                    color: #2D3748;
                }
            }
        }
    }
    
    &:hover .actions {
        opacity: 1;
    }
    
    .comment-content {
        color: #2D3748;
        line-height: 1.6;
        margin-bottom: 12px;
    }
    
    .comment-footer {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .like-button {
            display: flex;
            align-items: center;
            gap: 4px;
            background: transparent;
            border: none;
            color: #718096;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
            
            &:hover {
                background: #EDF2F7;
                color: #48BB78;
            }
            
            &.liked {
                color: #48BB78;
            }
        }
        
        .reply-button {
            display: flex;
            align-items: center;
            gap: 4px;
            background: transparent;
            border: none;
            color: #718096;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
            
            &:hover {
                background: #EDF2F7;
                color: #2D3748;
            }
        }
    }
    
    .replies {
        margin-top: 16px;
        padding-left: 56px;
        border-left: 2px solid #E2E8F0;
    }
`;

const CommentInput = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 20px;
    
    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #48BB78;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 16px;
        flex-shrink: 0;
    }
    
    .input-container {
        flex: 1;
        position: relative;
        
        textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #E2E8F0;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.6;
            resize: none;
            min-height: 80px;
            transition: all 0.3s ease;
            
            &:focus {
                outline: none;
                border-color: #48BB78;
                box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
            }
            
            &::placeholder {
                color: #A0AEC0;
            }
        }
        
        .input-actions {
            position: absolute;
            bottom: 12px;
            right: 12px;
            display: flex;
            gap: 8px;
            
            button {
                padding: 6px 12px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                
                &.cancel {
                    background: transparent;
                    color: #718096;
                    
                    &:hover {
                        background: #EDF2F7;
                    }
                }
                
                &.submit {
                    background: #48BB78;
                    color: white;
                    
                    &:hover {
                        background: #38A169;
                    }
                }
            }
        }
    }
`;

const MeetingForm = styled.div`
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    animation: fadeIn 0.3s ease;
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .form-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        
        h2 {
            font-size: 24px;
            color: #2D3748;
            font-weight: 600;
        }
        
        .close-button {
            background: transparent;
            border: none;
            color: #718096;
            cursor: pointer;
            font-size: 24px;
            transition: color 0.2s;
            
            &:hover {
                color: #2D3748;
            }
        }
    }
    
    .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        margin-bottom: 24px;
        
        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        
        label {
            font-size: 14px;
            font-weight: 500;
            color: #4A5568;
        }
        
        input, select, textarea {
            padding: 12px;
            border: 2px solid #E2E8F0;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.3s ease;
            
            &:focus {
                outline: none;
                border-color: #48BB78;
                box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
            }
        }
        
        textarea {
            min-height: 100px;
            resize: vertical;
        }
    }
    
    .attendees-section {
        margin-top: 24px;
        
        .attendees-list {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 12px;
        }
        
        .attendee-tag {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: #F7FAFC;
            border-radius: 6px;
            font-size: 14px;
            
            .remove-button {
                background: transparent;
                border: none;
                color: #718096;
                cursor: pointer;
                padding: 2px;
                
                &:hover {
                    color: #E53E3E;
                }
            }
        }
    }
    
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        margin-top: 24px;
        
        button {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            
            &.cancel {
                background: transparent;
                color: #718096;
                border: 2px solid #E2E8F0;
                
                &:hover {
                    background: #F7FAFC;
                    color: #2D3748;
                }
            }
            
            &.submit {
                background: #48BB78;
                color: white;
                border: none;
                
                &:hover {
                    background: #38A169;
                }
            }
        }
    }
`;

export default function MyCalendar() {
    const now = new Date();
    const [date, setDate] = useState(now);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isModalCollapsed, setIsModalCollapsed] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([
        {
            title: 'Weekly Strategy Meeting',
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
            description: 'Discussing weekly strategies and KPIs.',
            location: 'Conference Room A',
            organizer: 'John Doe',
            type: 'In-person',
            category: 'meeting',
            categoryColor: '#48BB78',
        },
        {
            title: 'Budget Review – Infrastructure Projects',
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12, 0),
            description: 'Reviewing upcoming project budgets.',
            location: 'Meeting Room 2B',
            organizer: 'Sarah Lee',
            type: 'Virtual',
            category: 'finance',
            categoryColor: '#4299e1',
        },
        {
            title: 'Meeting with Vision 2030 Delegation',
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 14, 0),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 15, 30),
            description: 'Discussion on Vision 2030 initiatives.',
            location: 'VIP Boardroom',
            organizer: 'Hassan Al-Saud',
            type: 'In-person',
            category: 'important',
            categoryColor: '#f56565',
        },
        {
            title: 'Smart City Tech Presentation',
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 10, 30),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 11, 30),
            description: 'Presenting Smart City technology solutions.',
            location: 'Auditorium',
            organizer: 'Dr. Emily Carter',
            type: 'Virtual',
            category: 'presentation',
            categoryColor: '#ed8936',
        },
    ]);
    const [momNotes, setMomNotes] = useState('');
    const [actionItems, setActionItems] = useState([]);
    const [attendees, setAttendees] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [newActionItem, setNewActionItem] = useState({ title: '', assignee: '', status: 'pending' });
    const [editingActionItem, setEditingActionItem] = useState(null);
    const [isAddingActionItem, setIsAddingActionItem] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [meetingTags, setMeetingTags] = useState(['Strategy', 'Weekly']);
    const [reminders, setReminders] = useState([]);
    const [comments, setComments] = useState([
        {
            id: 1,
            user: 'Ahmed Al-Saud',
            avatar: 'AS',
            text: 'Great meeting! Looking forward to implementing these changes.',
            timestamp: new Date(),
            likes: 2,
            isLiked: false,
            replies: [
                {
                    id: 2,
                    user: 'Fatima Al-Rashid',
                    avatar: 'FR',
                    text: 'Agreed! The new strategy looks promising.',
                    timestamp: new Date(),
                    likes: 1,
                    isLiked: false
                }
            ]
        },
        {
            id: 3,
            user: 'Khalid Al-Faisal',
            avatar: 'KF',
            text: 'Thank you for the detailed presentation. The timeline seems achievable.',
            timestamp: new Date(),
            likes: 3,
            isLiked: false,
            replies: [
                {
                    id: 4,
                    user: 'Noura Al-Ghamdi',
                    avatar: 'NG',
                    text: 'I have some suggestions for the implementation phase.',
                    timestamp: new Date(),
                    likes: 1,
                    isLiked: false
                }
            ]
        }
    ]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isSharing, setIsSharing] = useState(false);
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : {
            id: Date.now(),
            name: 'Mohammad Tubishat',
            avatar: 'MT',
            role: 'Manager'
        };
    });
    const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
    const [newMeeting, setNewMeeting] = useState({
        title: '',
        start: new Date(),
        end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
        description: '',
        location: '',
        type: 'In-person',
        category: 'meeting',
        attendees: [],
        organizer: currentUser.name,
        attachments: [],
        tags: []
    });
    const [newAttendee, setNewAttendee] = useState('');
    const [newTag, setNewTag] = useState('');

    // Save current user to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }, [currentUser]);

    // Load comments from localStorage
    useEffect(() => {
        const savedComments = localStorage.getItem(`comments_${selectedEvent?.id}`);
        if (savedComments) {
            setComments(JSON.parse(savedComments));
        }
    }, [selectedEvent]);

    // Save comments to localStorage
    useEffect(() => {
        if (selectedEvent) {
            localStorage.setItem(`comments_${selectedEvent.id}`, JSON.stringify(comments));
        }
    }, [comments, selectedEvent]);

    // Load saved data from localStorage
    useEffect(() => {
        const savedMomNotes = localStorage.getItem(`mom_${selectedEvent?.id}`);
        const savedActionItems = localStorage.getItem(`actionItems_${selectedEvent?.id}`);
        const savedAttendees = localStorage.getItem(`attendees_${selectedEvent?.id}`);
        const savedAttachments = localStorage.getItem(`attachments_${selectedEvent?.id}`);

        if (savedMomNotes) setMomNotes(savedMomNotes);
        if (savedActionItems) setActionItems(JSON.parse(savedActionItems));
        if (savedAttendees) setAttendees(JSON.parse(savedAttendees));
        if (savedAttachments) setAttachments(JSON.parse(savedAttachments));
    }, [selectedEvent]);

    // Save data to localStorage
    useEffect(() => {
        if (selectedEvent) {
            localStorage.setItem(`mom_${selectedEvent.id}`, momNotes);
            localStorage.setItem(`actionItems_${selectedEvent.id}`, JSON.stringify(actionItems));
            localStorage.setItem(`attendees_${selectedEvent.id}`, JSON.stringify(attendees));
            localStorage.setItem(`attachments_${selectedEvent.id}`, JSON.stringify(attachments));
        }
    }, [momNotes, actionItems, attendees, attachments, selectedEvent]);

    const filteredEvents = useMemo(() => {
        return events.filter(event => 
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [events, searchQuery]);

    const todaysEvents = useMemo(() => {
        return events.filter(event => isSameDay(event.start, now));
    }, [events, now]);

    const eventStats = useMemo(() => {
        return {
            total: events.length,
            today: todaysEvents.length,
            virtual: events.filter(e => e.type === 'Virtual').length,
            inPerson: events.filter(e => e.type === 'In-person').length,
        };
    }, [events, todaysEvents]);

    const eventStyleGetter = (event) => {
        return {
            style: {
                backgroundColor: event.categoryColor,
                borderRadius: '6px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block',
            }
        };
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
    };

    const closeModal = () => {
        setSelectedEvent(null);
    };

    const handleJoinMeeting = () => {
        alert('Joining meeting...');
        closeModal();
    };

    const handleAddToCalendar = () => {
        alert('Added to your personal calendar!');
        closeModal();
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleModalCollapse = () => {
        setIsModalCollapsed(!isModalCollapsed);
    };

    const handleActionItemToggle = (id) => {
        setActionItems(items => 
            items.map(item => 
                item.id === id 
                    ? { ...item, completed: !item.completed } 
                    : item
            )
        );
    };

    const handleAddNewActionItem = () => {
        if (newActionItem.title && newActionItem.assignee) {
            setActionItems([...actionItems, {
                id: Date.now(),
                ...newActionItem,
                completed: false
            }]);
            setNewActionItem({ title: '', assignee: '', status: 'pending' });
            setIsAddingActionItem(false);
        }
    };

    const handleEditActionItem = (item) => {
        setEditingActionItem(item);
        setNewActionItem({
            title: item.title,
            assignee: item.assignee,
            status: item.status
        });
    };

    const handleUpdateActionItem = () => {
        if (editingActionItem && newActionItem.title && newActionItem.assignee) {
            setActionItems(items =>
                items.map(item =>
                    item.id === editingActionItem.id
                        ? { ...item, ...newActionItem }
                        : item
                )
            );
            setEditingActionItem(null);
            setNewActionItem({ title: '', assignee: '', status: 'pending' });
        }
    };

    const handleDeleteActionItem = (id) => {
        setActionItems(items => items.filter(item => item.id !== id));
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const newAttachments = files.map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            size: formatFileSize(file.size),
            file: file
        }));
        setAttachments([...attachments, ...newAttachments]);
    };

    const handleDeleteAttachment = (id) => {
        setAttachments(attachments.filter(attachment => attachment.id !== id));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleExportMoM = () => {
        const momContent = {
            title: selectedEvent.title,
            date: format(selectedEvent.start, 'PP'),
            time: `${format(selectedEvent.start, 'p')} - ${format(selectedEvent.end, 'p')}`,
            location: selectedEvent.location,
            attendees,
            notes: momNotes,
            actionItems,
            attachments
        };
        
        // Create and download PDF
        const blob = new Blob([JSON.stringify(momContent, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MoM_${selectedEvent.title}_${format(selectedEvent.start, 'yyyy-MM-dd')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleAddTag = (tag) => {
        if (!meetingTags.includes(tag)) {
            setMeetingTags([...meetingTags, tag]);
        }
    };

    const handleRemoveTag = (tag) => {
        setMeetingTags(meetingTags.filter(t => t !== tag));
    };

    const handleAddReminder = (time) => {
        setReminders([...reminders, {
            id: Date.now(),
            time,
            isActive: true
        }]);
    };

    const handleToggleReminder = (id) => {
        setReminders(reminders.map(r => 
            r.id === id ? { ...r, isActive: !r.isActive } : r
        ));
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            const newCommentObj = {
                id: Date.now(),
                user: currentUser.name,
                avatar: currentUser.avatar,
                text: newComment,
                timestamp: new Date(),
                likes: 0,
                isLiked: false,
                replies: []
            };
            setComments([...comments, newCommentObj]);
            setNewComment('');
        }
    };

    const handleShareMeeting = (platform) => {
        // Implement sharing logic
        setIsSharing(false);
    };

    const handleLikeComment = (commentId) => {
        setComments(comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                    isLiked: !comment.isLiked
                };
            }
            if (comment.replies) {
                return {
                    ...comment,
                    replies: comment.replies.map(reply => {
                        if (reply.id === commentId) {
                            return {
                                ...reply,
                                likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                                isLiked: !reply.isLiked
                            };
                        }
                        return reply;
                    })
                };
            }
            return comment;
        }));
    };

    const handleAddReply = (commentId) => {
        if (replyText.trim()) {
            setComments(comments.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: [
                            ...(comment.replies || []),
                            {
                                id: Date.now(),
                                user: currentUser.name,
                                avatar: currentUser.avatar,
                                text: replyText,
                                timestamp: new Date(),
                                likes: 0,
                                isLiked: false
                            }
                        ]
                    };
                }
                return comment;
            }));
            setReplyText('');
            setReplyingTo(null);
        }
    };

    const handleCreateMeeting = () => {
        if (newMeeting.title && newMeeting.start && newMeeting.end) {
            const meetingEvent = {
                ...newMeeting,
                id: Date.now(),
                categoryColor: '#48BB78'
            };
            setEvents([...events, meetingEvent]);
            setIsCreatingMeeting(false);
            setNewMeeting({
                title: '',
                start: new Date(),
                end: new Date(new Date().getTime() + 60 * 60 * 1000),
                description: '',
                location: '',
                type: 'In-person',
                category: 'meeting',
                attendees: [],
                organizer: currentUser.name,
                attachments: [],
                tags: []
            });
        }
    };

    const handleAddAttendee = () => {
        if (newAttendee.trim() && !newMeeting.attendees.includes(newAttendee)) {
            setNewMeeting({
                ...newMeeting,
                attendees: [...newMeeting.attendees, newAttendee]
            });
            setNewAttendee('');
        }
    };

    const handleRemoveAttendee = (attendee) => {
        setNewMeeting({
            ...newMeeting,
            attendees: newMeeting.attendees.filter(a => a !== attendee)
        });
    };

    const handleAddMeetingTag = () => {
        if (newTag.trim() && !newMeeting.tags.includes(newTag)) {
            setNewMeeting({
                ...newMeeting,
                tags: [...newMeeting.tags, newTag]
            });
            setNewTag('');
        }
    };

    const handleRemoveMeetingTag = (tag) => {
        setNewMeeting({
            ...newMeeting,
            tags: newMeeting.tags.filter(t => t !== tag)
        });
    };

    return (
        <CalendarContainer>
            <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={({ start, end }) => {
                    setNewMeeting({
                        ...newMeeting,
                        start,
                        end
                    });
                    setIsCreatingMeeting(true);
                }}
                selectable
                views={['month', 'week', 'day']}
                defaultView="month"
                eventPropGetter={eventStyleGetter}
            />

            <Sidebar isCollapsed={isSidebarCollapsed}>
                <ToggleButton onClick={toggleSidebar}>
                    {isSidebarCollapsed ? <FaChevronLeft /> : <FaChevronRight />}
                </ToggleButton>

                <SearchBar>
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </SearchBar>

                <QuickAdd onClick={() => setIsCreatingMeeting(true)}>
                    <div>
                        <FaPlus />
                        Create New Meeting
                    </div>
                </QuickAdd>

                <EventStats>
                    <h3><FaChartPie /> Event Statistics</h3>
                    <div className="stat-item">
                        <span>Total Events</span>
                        <span className="count">{eventStats.total}</span>
                    </div>
                    <div className="stat-item">
                        <span>Today's Events</span>
                        <span className="count">{eventStats.today}</span>
                    </div>
                    <div className="stat-item">
                        <span>Virtual Meetings</span>
                        <span className="count">{eventStats.virtual}</span>
                    </div>
                    <div className="stat-item">
                        <span>In-Person Meetings</span>
                        <span className="count">{eventStats.inPerson}</span>
                    </div>
                </EventStats>

                <TodaysEvents>
                    <h3><FaCalendarAlt /> Today's Events</h3>
                    {todaysEvents.map((event, index) => (
                        <div key={index} className="event-item">
                            <div className="time">
                                {format(event.start, 'p')} - {format(event.end, 'p')}
                            </div>
                            <div className="">{event.title}</div>
                            <CategoryTag color={event.categoryColor}>
                                {event.category}
                            </CategoryTag>
                        </div>
                    ))}
                </TodaysEvents>
            </Sidebar>

            {isCreatingMeeting && (
                <ModalOverlay>
                    <MeetingForm>
                        <div className="form-header">
                            <h2>Create New Meeting</h2>
                            <button className="close-button" onClick={() => setIsCreatingMeeting(false)}>
                                &times;
                            </button>
                        </div>
                        
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Meeting Title</label>
                                <input
                                    type="text"
                                    value={newMeeting.title}
                                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                                    placeholder="Enter meeting title"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Meeting Type</label>
                                <select
                                    value={newMeeting.type}
                                    onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value })}
                                >
                                    <option value="In-person">In-person</option>
                                    <option value="Virtual">Virtual</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Start Time</label>
                                <input
                                    type="datetime-local"
                                    value={format(newMeeting.start, "yyyy-MM-dd'T'HH:mm")}
                                    onChange={(e) => setNewMeeting({ ...newMeeting, start: new Date(e.target.value) })}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>End Time</label>
                                <input
                                    type="datetime-local"
                                    value={format(newMeeting.end, "yyyy-MM-dd'T'HH:mm")}
                                    onChange={(e) => setNewMeeting({ ...newMeeting, end: new Date(e.target.value) })}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={newMeeting.location}
                                    onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                                    placeholder="Enter meeting location"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={newMeeting.category}
                                    onChange={(e) => setNewMeeting({ ...newMeeting, category: e.target.value })}
                                >
                                    <option value="meeting">Meeting</option>
                                    <option value="presentation">Presentation</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="training">Training</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={newMeeting.description}
                                onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                                placeholder="Enter meeting description"
                            />
                        </div>
                        
                        <div className="attendees-section">
                            <label>Attendees</label>
                            <div className="attendees-list">
                                {newMeeting.attendees.map(attendee => (
                                    <div key={attendee} className="attendee-tag">
                                        <span>{attendee}</span>
                                        <button 
                                            className="remove-button"
                                            onClick={() => handleRemoveAttendee(attendee)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <input
                                    type="text"
                                    value={newAttendee}
                                    onChange={(e) => setNewAttendee(e.target.value)}
                                    placeholder="Add attendee email"
                                    style={{ flex: 1 }}
                                />
                                <button 
                                    onClick={handleAddAttendee}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#48BB78',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <FaUserPlus />
                                </button>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Tags</label>
                            <div className="tags-list">
                                {newMeeting.tags.map(tag => (
                                    <div key={tag} className="tag">
                                        <span>{tag}</span>
                                        <button 
                                            className="remove-button"
                                            onClick={() => handleRemoveMeetingTag(tag)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Add tag"
                                    style={{ flex: 1 }}
                                />
                                <button 
                                    onClick={handleAddMeetingTag}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#48BB78',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <FaTag />
                                </button>
                            </div>
                        </div>
                        
                        <div className="form-actions">
                            <button 
                                className="cancel"
                                onClick={() => setIsCreatingMeeting(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="submit"
                                onClick={handleCreateMeeting}
                            >
                                Create Meeting
                            </button>
                        </div>
                    </MeetingForm>
                </ModalOverlay>
            )}

            {selectedEvent && (
                <ModalOverlay>
                    <ModalContent isCollapsed={isModalCollapsed}>
                        <CloseButton onClick={closeModal}>&times;</CloseButton>
                        <CollapseButton 
                            onClick={toggleModalCollapse}
                            isCollapsed={isModalCollapsed}
                        >
                            {isModalCollapsed ? <FaExpand /> : <FaMinus />}
                        </CollapseButton>
                        
                        <MeetingHeader>
                            <div className="title-section">
                                <h2>{selectedEvent.title}</h2>
                                <div className="meta">
                                    <span><FaClock /> {format(selectedEvent.start, 'p')} - {format(selectedEvent.end, 'p')}</span>
                                    <span><FaMapMarkerAlt /> {selectedEvent.location}</span>
                                    <span><FaUser /> {selectedEvent.organizer}</span>
                                </div>
                            </div>
                            <div className="actions">
                                <ModernButton variant="secondary" onClick={() => setIsEditing(!isEditing)}>
                                    <FaEdit /> {isEditing ? 'View' : 'Edit'}
                                </ModernButton>
                                <ModernButton variant="secondary" onClick={() => setIsSharing(!isSharing)}>
                                    <FaShare /> Share
                                </ModernButton>
                            </div>
                        </MeetingHeader>

                        <div className="tags">
                            {meetingTags.map(tag => (
                                <Tag key={tag} color="#E6FFFA" textColor="#234E52">
                                    <FaTag /> {tag}
                                </Tag>
                            ))}
                        </div>

                        {!isModalCollapsed && (
                            <>
                                <Section>
                                    <SectionHeader>
                                        <h3><FaFileAlt /> Meeting Notes</h3>
                                        <div className="actions">
                                            <ModernButton variant="secondary" onClick={() => setIsEditing(!isEditing)}>
                                                <FaEdit /> {isEditing ? 'View' : 'Edit'}
                                            </ModernButton>
                                        </div>
                                    </SectionHeader>
                                    <NotesEditor>
                                        <textarea
                                            value={momNotes}
                                            onChange={(e) => setMomNotes(e.target.value)}
                                            placeholder="Take meeting notes..."
                                        />
                                        <div className="editor-toolbar">
                                            <button><strong>B</strong></button>
                                            <button><em>I</em></button>
                                            <button><u>U</u></button>
                                            <button>•</button>
                                            <button>1.</button>
                                        </div>
                                    </NotesEditor>
                                </Section>

                                <Spacer />

                                <Section>
                                    <SectionHeader>
                                        <h3><FaCheck /> Action Items</h3>
                                        <div className="actions">
                                            <ModernButton
                                                variant="secondary"
                                                onClick={() => setIsAddingActionItem(true)}
                                            >
                                                <FaPlusCircle /> Add
                                            </ModernButton>
                                        </div>
                                    </SectionHeader>
                                    
                                    {actionItems.map(item => (
                                        <ActionItemCard key={item.id}>
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                checked={item.completed}
                                                onChange={() => handleActionItemToggle(item.id)}
                                            />
                                            <div className="content">
                                                <div className="">{item.title}</div>
                                                <div className="assignee">
                                                    <FaUser /> {item.assignee}
                                                </div>
                                            </div>
                                            <div className="status">
                                                <StatusSelect
                                                    value={item.status}
                                                    onChange={(e) => {
                                                        setActionItems(items =>
                                                            items.map(i =>
                                                                i.id === item.id
                                                                    ? { ...i, status: e.target.value }
                                                                    : i
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                </StatusSelect>
                                            </div>
                                            <div className="actions">
                                                <button onClick={() => handleEditActionItem(item)}>
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDeleteActionItem(item.id)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </ActionItemCard>
                                    ))}

                                    {isAddingActionItem && (
                                        <Card style={{ marginTop: '20px' }}>
                                            <ModernInput
                                                type="text"
                                                placeholder="Action item"
                                                value={newActionItem.title}
                                                onChange={(e) => setNewActionItem({ ...newActionItem, title: e.target.value })}
                                            />
                                            <ModernInput
                                                type="text"
                                                placeholder="Assignee"
                                                value={newActionItem.assignee}
                                                onChange={(e) => setNewActionItem({ ...newActionItem, assignee: e.target.value })}
                                            />
                                            <ModernSelect
                                                value={newActionItem.status}
                                                onChange={(e) => setNewActionItem({ ...newActionItem, status: e.target.value })}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </ModernSelect>
                                            <ButtonGroup>
                                                <ModernButton variant="primary" onClick={handleAddNewActionItem}>
                                                    Add Action Item
                                                </ModernButton>
                                                <ModernButton variant="secondary" onClick={() => setIsAddingActionItem(false)}>
                                                    Cancel
                                                </ModernButton>
                                            </ButtonGroup>
                                        </Card>
                                    )}
                                </Section>

                                <Spacer />

                                <Section>
                                    <SectionHeader>
                                        <h3><FaPaperclip /> Attachments</h3>
                                        <div className="actions">
                                            <ModernButton variant="secondary">
                                                <FaUpload /> Upload
                                            </ModernButton>
                                        </div>
                                    </SectionHeader>
                                    <FileUploadCard>
                                        <label htmlFor="file-upload">
                                            <div className="upload-text">
                                                <FaUpload />
                                                <span>Click to upload files or drag and drop</span>
                                                <small>Max file size: 10MB</small>
                                            </div>
                                        </label>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            multiple
                                            onChange={handleFileUpload}
                                        />
                                    </FileUploadCard>
                                </Section>

                                <Spacer />

                                <Section>
                                    <SectionHeader>
                                        <h3><FaComments /> Comments</h3>
                                    </SectionHeader>
                                    
                                    {comments.map(comment => (
                                        <CommentCard key={comment.id}>
                                            <div className="comment-header">
                                                <div className="avatar">{comment.avatar}</div>
                                                <div className="user-info">
                                                    <div className="name">{comment.user}</div>
                                                    <div className="time">
                                                        {format(comment.timestamp, 'MMM d, h:mm a')}
                                                    </div>
                                                </div>
                                                <div className="actions">
                                                    <button onClick={() => setReplyingTo(comment.id)}>
                                                        <FaReply />
                                                    </button>
                                                    <button>
                                                        <FaEllipsisH />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="comment-content">
                                                {comment.text}
                                            </div>
                                            
                                            <div className="comment-footer">
                                                <button 
                                                    className={`like-button ${comment.isLiked ? 'liked' : ''}`}
                                                    onClick={() => handleLikeComment(comment.id)}
                                                >
                                                    {comment.isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
                                                    {comment.likes > 0 && <span>{comment.likes}</span>}
                                                </button>
                                                <button 
                                                    className="reply-button"
                                                    onClick={() => setReplyingTo(comment.id)}
                                                >
                                                    <FaReply /> Reply
                                                </button>
                                            </div>
                                            
                                            {replyingTo === comment.id && (
                                                <CommentInput>
                                                    <div className="avatar">{currentUser.avatar}</div>
                                                    <div className="input-container">
                                                        <textarea
                                                            placeholder="Write a reply..."
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                        />
                                                        <div className="input-actions">
                                                            <button 
                                                                className="cancel"
                                                                onClick={() => {
                                                                    setReplyingTo(null);
                                                                    setReplyText('');
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button 
                                                                className="submit"
                                                                onClick={() => handleAddReply(comment.id)}
                                                            >
                                                                Reply
                                                            </button>
                                                        </div>
                                                    </div>
                                                </CommentInput>
                                            )}
                                            
                                            {comment.replies && comment.replies.length > 0 && (
                                                <div className="replies">
                                                    {comment.replies.map(reply => (
                                                        <CommentCard key={reply.id}>
                                                            <div className="comment-header">
                                                                <div className="avatar">{reply.avatar}</div>
                                                                <div className="user-info">
                                                                    <div className="name">{reply.user}</div>
                                                                    <div className="time">
                                                                        {format(reply.timestamp, 'MMM d, h:mm a')}
                                                                    </div>
                                                                </div>
                                                                <div className="actions">
                                                                    <button>
                                                                        <FaEllipsisH />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="comment-content">
                                                                {reply.text}
                                                            </div>
                                                            
                                                            <div className="comment-footer">
                                                                <button 
                                                                    className={`like-button ${reply.isLiked ? 'liked' : ''}`}
                                                                    onClick={() => handleLikeComment(reply.id)}
                                                                >
                                                                    {reply.isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
                                                                    {reply.likes > 0 && <span>{reply.likes}</span>}
                                                                </button>
                                                            </div>
                                                        </CommentCard>
                                                    ))}
                                                </div>
                                            )}
                                        </CommentCard>
                                    ))}
                                    
                                    <CommentInput>
                                        <div className="avatar">{currentUser.avatar}</div>
                                        <div className="input-container">
                                            <textarea
                                                placeholder="Add a comment..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                            />
                                            <div className="input-actions">
                                                <button 
                                                    className="cancel"
                                                    onClick={() => setNewComment('')}
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    className="submit"
                                                    onClick={handleAddComment}
                                                >
                                                    Post
                                                </button>
                                            </div>
                                        </div>
                                    </CommentInput>
                                </Section>

                                <Spacer />

                                <Section>
                                    <SectionHeader>
                                        <h3><FaDownload /> Export</h3>
                                    </SectionHeader>
                                    <ButtonGroup>
                                        <ModernButton variant="primary" onClick={handleExportMoM}>
                                            <FaDownload /> Export
                                        </ModernButton>
                                        <ModernButton variant="secondary">
                                            <FaShare /> Share
                                        </ModernButton>
                                    </ButtonGroup>
                                </Section>
                            </>
                        )}

                        <ModalActions isCollapsed={isModalCollapsed}>
                            <ButtonGroup>
                                <ModernButton variant="primary" onClick={handleJoinMeeting}>
                                    <FaVideo /> Join
                                </ModernButton>
                                {!isModalCollapsed && (
                                    <ModernButton variant="secondary" onClick={handleAddToCalendar}>
                                        <FaCalendarAlt /> Add to Calendar
                                    </ModernButton>
                                )}
                            </ButtonGroup>
                        </ModalActions>
                    </ModalContent>
                </ModalOverlay>
            )}
        </CalendarContainer>
    );
}
