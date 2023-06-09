"use client";

import React, { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Modal from "./Modal";
import useRentModal from "@/app/hooks/useRentModal";
import Heading from "../typography/Heading";
import { LISTING_ADD_ENDPOINT, categories } from "@/app/utils/constants";
import CategoryInput from "../form/CategoryInput";
import CountrySelect from "../form/CountrySelect";
import Counter from "../counter/Counter";
import ImageUpload from "../form/imageUpload";
import Input from "../form/Input";
import axiosInstance from "@/app/libs/axiosInstance";
import { useRouter } from "next/navigation";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

function RentModal() {
  const router = useRouter();
  const rentModal = useRentModal();
  const [step, setStep] = useState(STEPS.CATEGORY);
  const Map = dynamic(() => import("../map/Map"), {
    ssr: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: "",
      price: 1,
      title: "",
      description: "",
    },
  });

  const category = watch("category");
  const location = watch("location");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrc = watch("imageSrc");
  const title = watch("title");
  const description = watch("description");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    if (step === STEPS.CATEGORY && !category) {
      toast.error("Category is required");
    } else if (step === STEPS.LOCATION && !location) {
      toast.error("Location is required");
    } else if (step === STEPS.IMAGES && !imageSrc) {
      toast.error("Image is required");
    } else if (
      step === STEPS.DESCRIPTION &&
      (!title.trim() || !description.trim())
    ) {
      toast.error("Title and description are required");
    } else {
      setStep((value) => value + 1);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async (data) => {
      if (step >= STEPS.PRICE) {
        try {
          await axiosInstance.post(LISTING_ADD_ENDPOINT, data);
          toast.success("Listing Created!");
          router.refresh();
          reset();
          setStep(STEPS.CATEGORY);
          rentModal.onClose();
        } catch (error) {
          toast.error("Something went wrong");
        }
      }
    },
    [step, router, reset, rentModal]
  );

  const actionLabel = useMemo(() => {
    if (step >= STEPS.PRICE) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step <= STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue("category", category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your place located?"
          subtitle="Help guests find you!"
        />
        <CountrySelect
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subtitle="What amenities do you have?"
        />
        <Counter
          title="Guests"
          subtitle="How many guests do you allow?"
          value={guestCount}
          onChange={(value) => {
            setCustomValue("guestCount", value);
          }}
        />
        <hr />
        <Counter
          title="Rooms"
          subtitle="How many rooms do you have?"
          value={roomCount}
          onChange={(value) => {
            setCustomValue("roomCount", value);
          }}
        />
        <hr />
        <Counter
          title="Bathrooms"
          subtitle="How many bathrooms do you have?"
          value={bathroomCount}
          onChange={(value) => {
            setCustomValue("bathroomCount", value);
          }}
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like!"
        />
        <ImageUpload
          onChange={(value) => {
            setCustomValue("imageSrc", value);
          }}
          value={imageSrc}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place?"
          subtitle="Short and sweet best!"
        />
        <Input
          id="title"
          label="Title"
          disabled={false}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={false}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />
        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={false}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={rentModal.isOpen}
      title="Airbnb your home!"
      onClose={rentModal.onClose}
      onSubmit={step >= STEPS.PRICE ? handleSubmit(onSubmit) : null}
      onNext={step < STEPS.PRICE ? onNext : null}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step <= STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}
    />
  );
}

export default RentModal;
