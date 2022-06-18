import { useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { Formik, Form } from "formik";
import Input from "./Input";
import ListSelect from "./Lists";
import ImageUpload from "./ImageUpload";
import axios from "axios";
import TicketInput from "./Ticket";

const StorySchema = Yup.object().shape({
  title: Yup.string().trim().required(),
  lists: Yup.string().trim().required(),
  description: Yup.string().trim().required(),
  ticket: Yup.string(),
  comment: Yup.string().trim().required(),
});

const StoryForm = ({
  initialValues = null,
  redirectPath = "",
  buttonText = "Submit",
  onSubmit = () => null,
}) => {
  const router = useRouter();

  const [disabled, setDisabled] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialValues?.image ?? "");

  const upload = async (image) => {
    if (!image) return;

    let toastId;
    try {
      // TODO: Upload image to remote storage
      setDisabled(true);
      toastId = toast.loading("Uploading...");
      const { data } = await axios.post("/api/image-upload", { image });
      setImageUrl(data?.url);
      toast.success("Successfully uploaded", { id: toastId });
    } catch (e) {
      toast.error("Unable to upload", { id: toastId });
      setImageUrl("");
    } finally {
      setDisabled(false);
    }
  };

  const handleOnSubmit = async (values = null) => {
    let toastId;
    try {
      setDisabled(true);
      toastId = toast.loading("Submitting...");
      // submit data
      if (typeof onSubmit === "function") {
        await onSubmit({ ...values, image: imageUrl });
      }
      toast.success("Successfully submitted", { id: toastId });
      // Redirect user
      if (redirectPath) {
        router.push(redirectPath);
      }
    } catch (e) {
      toast.error("Unable to submit", { id: toastId });
      setDisabled(false);
    }
  };

  const { image, ...initialFormValues } = initialValues ?? {
    image: "",
    title: "",
    lists: "",
    description: "",
    ticket: "",
    comment: "",
  };

  return (
    <div>
      <div className="mb-8 max-w-md">
        <ImageUpload
          initialImage={{ src: image, alt: initialFormValues.title }}
          onChangePicture={upload}
        />
      </div>

      <Formik
        initialValues={initialFormValues}
        validationSchema={StorySchema}
        validateOnBlur={false}
        onSubmit={handleOnSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="space-y-8">
            <div className="space-y-6">
              <Input
                name="title"
                type="text"
                label="Title"
                placeholder="Ej: Design DB from NFT project"
                disabled={disabled}
              />

              {/* Select Option Component for List State*/}
              <ListSelect name="lists" label="Lists" disabled={disabled} />

              <Input
                name="description"
                type="textarea"
                label="Description"
                placeholder="Add a more detailed description"
                disabled={disabled}
                rows={5}
              />


              <TicketInput
                type="text"
                name="ticket"
                label="Ticket"
                placeholder="Add ticket to break down step by step"
                disabled={disabled}
              />

              <Input
                name="comment"
                type="textarea"
                label="Comment"
                placeholder="Write a comment"
                disabled={disabled}
                rows={2}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={disabled || !isValid}
                className="bg-blue-600 text-white py-2 px-6 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              >
                {isSubmitting ? "Submitting..." : buttonText}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

StoryForm.propTypes = {
  initialValues: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    lists: PropTypes.string,
    description: PropTypes.string,
    ticket: PropTypes.string,
    comment: PropTypes.string,
  }),
  redirectPath: PropTypes.string,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
};

export default StoryForm;
