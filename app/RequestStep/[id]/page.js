"use client"
import { useState, useEffect } from 'react';
import EndPoints from "../../../Services/EndPoints";
import { getRequest, postRequest } from "../../../Services/RestClient";
import { Button, ButtonGroup } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react'
import RichTextEditor, { createValueFromString } from 'react-rte';
import { useRouter } from "next/navigation";

export default function Page({ params }) {
  const [requestStepDetailsData, setRequestStepDetailsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let [formDataUpdate, setformDataUpdate] = useState(true);
  const router = useRouter();
  const toast = useToast()
  let [formData, setFormData] = useState({
    Title: "",
  });
  const getButtonColorScheme = (label) => {
    if (label.toLowerCase() === 'approve') {
      return 'green';
    } else if (label.toLowerCase() === 'revert') {
      return 'red';
    }
    return 'gray';
  };
  useEffect(() => {
    setIsLoading(true);
    getRequest(EndPoints.Service.requestStepDetails + "?requestStepId=" + params.id)
      .then((result) => {
        setRequestStepDetailsData(result.Value);
        setFormData({
          Title: result.Value.RequestEmailTitle || "",
          EmailTo: result.Value.RequestEmail || "",
        });
        if (result.Value.RequestBody) {
          const richTextValue = createValueFromString(result.Value.RequestBody, 'html');
          setValue(richTextValue);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [params.id]);

  async function ChangeStepStatus(requestStepID) {
    formDataUpdate = {
      Status: requestStepID,
      RequestStepID: params.id
    };
    await handleSubmit();
  }
  const [value, setValue] = useState(RichTextEditor.createEmptyValue());
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }
  function handleRichTextChange(value) {
    setValue(value);
    setFormData({ ...formData, Body: value.toString('html') });
  }
  async function handleSubmit() {
    postRequest(EndPoints.Service.UpdateRequestStepStatus, formDataUpdate)
      .then((result) => {
        toast({
          title: 'Action Submitted!',
          description: "Your request has been processed successfully.",
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        router.push('/RequestStep');
      })
      .catch((error) => {
        toast({
          title: error.Message,
          description: "Sorry,Something Went Wrong",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      });
  }
  return (
    <div>
      {isLoading ? (
        <div></div>
      ) : (
        <div>
          <form className='p-10' onSubmit={handleSubmit}>

            <div className="space-y-12">
              <div className="border-b border-gray-900/10">
                <span className="font-semibold leading-7 text-gray-900 text-xl">Request Info</span>
                <p className="py-5 text-lg text-gray-700">
                  Please review the request details below. If everything is accurate, you may proceed with one of the actions listed below. Your decision will affect the status of the request.
                </p>
                <div className="pt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 justify-content-start" style={{ justifyContent: 'start !important' }}>
                  <div className="sm:col-span-3" >
                    <label htmlFor="Title" className="block text-sm font-medium leading-6 text-gray-900">
                      Title
                    </label>
                    <div className="mt-2">
                      <input
                        readOnly
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
                        readOnly
                        type="text"
                        name="Email"
                        id="Email"
                        autoComplete="given-name"
                        value={formData.EmailTo}
                        onChange={handleChange}
                        className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="my-4">
                      <label htmlFor="Body" className="block text-sm font-medium leading-6 text-gray-900">
                        Body
                      </label>
                      <RichTextEditor
                        readOnly
                        value={value}
                        onChange={handleRichTextChange}
                        className="mt-2 height-rich-text-editor height-rich-text-editor-readOnly"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <ButtonGroup className="px-5">
            {requestStepDetailsData?.StepTrasnition?.map((item, index) => (
              <Button
                key={index}
                colorScheme={getButtonColorScheme(item.Label)}
                variant="solid"
                className='mx-4'
                onClick={() => ChangeStepStatus(item)}
              >
                {item.Label}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      )}
    </div>
  );
}
