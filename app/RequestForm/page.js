"use client"
import { useState, useEffect } from 'react';
import EndPoints from "../../Services/EndPoints";
import { postRequest } from "../../Services/RestClient";
import { useToast } from '@chakra-ui/react'
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRouter } from "next/navigation";
import { Button } from '@chakra-ui/react';

export default function RequestForm() {
    const [formData, setFormData] = useState({
        Title: "",
        RequestType: "Annual Leave Approver",
    });
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [userId, setUserId] = useState(null);
    const toast = useToast()
    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('selectedUser');
        if (storedUser) {
            setUserId(JSON.parse(storedUser)?.id);
        }
    }, []);

    function handleChange(event) {
        const inputId = event.target.id;
        if (inputId === 'Email') {
            setEmail(event.target.value);
            validateEmail();
        }
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const validateEmail = () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!email) {
            setEmailError('Email is required');
            return false;
        } else if (!regex.test(email)) {
            setEmailError('Invalid email address');
            return false;
        } else {
            setEmailError('');
            return true;
        }
    };

    function handleSubmit(event) {
        event.preventDefault();
        if (!userId) {
            toast({
                title: 'Error.',
                description: "User not found. Please log in again.",
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }

        const areAllFieldsFilled = Object.values(formData).every(x => (x !== null && x !== ''));
        if (!areAllFieldsFilled) {
            toast({
                title: 'Error.',
                description: "All fields are required.",
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        if (!validateEmail()) {
            toast({
                title: 'Error.',
                description: "Invalid email address.",
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }

        const submitData = {
            ...formData,
            UserId: userId
        };

        postRequest(EndPoints.Service.requestSubmit, submitData)
            .then((result) => {
                toast({
                    title: 'Request Submitted Successfully!',
                    description: "Your request has been created and is now being processed.",
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                    position: 'top-right',
                });
                router.push('/Request');
            })
            .catch((error) => {
                console.error('Request submission failed:', error);
                toast({
                    title: 'Submission Failed',
                    description: "An error occurred while processing your request. Please try again later.",
                    status: 'error',
                    duration: 7000,
                    isClosable: true,
                    position: 'top-right',
                });
            });
    }

    return (
        <form className='p-10' onSubmit={handleSubmit}>
            <div className="space-y-12">
                <div className="pb-5">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Create a New Request</h2>
                    <p className="mt-2 text-gray-600 text-sm">Please fill out the information below to submit a new request. Our team will process your request promptly.</p>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 justify-content-start" style={{ justifyContent: 'start !important' }}>
                        <div className="sm:col-span-3" >
                            <label htmlFor="Title" className="block text-sm font-medium leading-6 text-gray-900">
                                Title
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="Title"
                                    id="Title"
                                    autoComplete="given-name"
                                    value={formData.Title}
                                    onChange={handleChange}
                                    className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <label htmlFor="Email" className="block text-sm mt-2 font-medium leading-6 text-gray-900">
                                Email To
                            </label>
                            <div className="my-2">
                                <input
                                    type="text"
                                    name="Email"
                                    id="Email"
                                    autoComplete="given-name"
                                    value={formData.EmailTo}
                                    onChange={handleChange}
                                    className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {emailError && <p className='pt-2' style={{ color: 'red' }}>{emailError}</p>}
                            </div>
                            <label htmlFor="requesttype" className="block text-sm mt-2 font-medium leading-6 text-gray-900">
                                Request Type
                            </label>
                            <div className="my-2">
                                <input
                                    type="text"
                                    name="text"
                                    id="requesttype"
                                    autoComplete="given-name"
                                    value={formData.RequestType}
                                    readOnly
                                    className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="my-4">
                                <label htmlFor="Body" className="block text-sm font-medium leading-6 text-gray-900">
                                    Body
                                </label>
                                <EditorContent editor={editor} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex items-center">
                <Button
                    type="submit"
                    colorScheme='gray'
                    variant="solid"
                    className=''
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    colorScheme='green'
                    variant="solid"
                    className='mx-3'
                >
                    Submit
                </Button>
            </div>
        </form>
    );
}
